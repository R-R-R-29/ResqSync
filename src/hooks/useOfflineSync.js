/**
 * useOfflineSync
 *
 * Orchestrates the full offline → online sync cycle from inside a React
 * component.  Works alongside useOnlineStatus; accepts its output as props
 * so both hooks compose cleanly without duplicated connectivity logic.
 *
 * Responsibilities
 * ────────────────
 *  1. Drain outbox_queue → POST /api/sync → handle ACK / CONFLICT per item.
 *  2. Maintain a live WebSocket connection for incoming RECORD_UPDATED pushes.
 *  3. Expose reactive counters (pendingCount, conflictCount) and a
 *     triggerManualSync() escape hatch.
 *
 * Returns
 * ───────
 *   syncState       – 'IDLE' | 'SYNCING' | 'CONFLICT' | 'ERROR'
 *   pendingCount    – outbox_queue items not yet ACK'd
 *   conflictCount   – unresolved CONFLICT responses this session
 *   conflicts       – array of { serverRecord, clientPayload } objects
 *   lastSyncedAt    – ISO timestamp of the last successful flush
 *   triggerManualSync – () => void — force an immediate outbox flush
 *   dismissConflict – (index: number) => void — remove a conflict from list
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getOutboxItems,
  removeFromOutbox,
  updateOutboxStatus,
  saveLocalRecord,
  markRecordsSynced,
  bulkUpsertFromServer,
  getLocalRecords,
} from '../db/indexedDB';

// ─── Constants ────────────────────────────────────────────────────────────────

const SYNC_URL    = '/api/sync';
const RECORDS_URL = '/api/records';
const WS_RECONNECT_MS = 3_000;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {{ isOnline: boolean, isServerReachable: boolean }} connectivity
 *   Pass the return value of useOnlineStatus() directly.
 */
export function useOfflineSync({ isOnline, isServerReachable }) {
  // ── State ──────────────────────────────────────────────────────────────────

  const [syncState,    setSyncState]    = useState('IDLE');
  const [pendingCount, setPendingCount] = useState(0);
  const [conflicts,    setConflicts]    = useState([]);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // ── Refs (stable, no re-render on change) ──────────────────────────────────

  const isSyncingRef   = useRef(false);
  const wsRef          = useRef(null);
  const reconnectTRef  = useRef(null);

  // ─── Pending count refresh ─────────────────────────────────────────────────

  const refreshPending = useCallback(async () => {
    try {
      const q = await getOutboxItems();
      setPendingCount(q.length);
    } catch {
      /* non-fatal */
    }
  }, []);

  // ─── WebSocket ─────────────────────────────────────────────────────────────

  const openWebSocket = useCallback(() => {
    // Don't open a second socket if one is already live
    if (wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING) return;

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url   = `${proto}//${window.location.hostname}:3001/ws`;

    let ws;
    try {
      ws = new WebSocket(url);
    } catch {
      // Hostname is unreachable — will retry via onclose
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[useOfflineSync] WebSocket connected');
    };

    ws.onmessage = async ({ data }) => {
      let msg;
      try { msg = JSON.parse(data); } catch { return; }

      switch (msg.type) {
        // ── A remote device committed a change — merge into local DB ──────────
        case 'RECORD_UPDATED': {
          if (!msg.record) break;
          const normalised = _normalise(msg.record);
          await saveLocalRecord(normalised, /* isOfflineEdit */ false);
          refreshPending();
          break;
        }

        // ── Server signalling a conflict from another client's sync ───────────
        case 'SYNC_CONFLICT': {
          if (msg.conflict) {
            setConflicts((prev) => [...prev, msg.conflict]);
            setSyncState('CONFLICT');
          }
          break;
        }

        default:
          break;
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      // Auto-reconnect only while we still believe we're online
      if (isOnline && isServerReachable) {
        clearTimeout(reconnectTRef.current);
        reconnectTRef.current = setTimeout(openWebSocket, WS_RECONNECT_MS);
      }
    };

    ws.onerror = () => {
      // Error is always followed by onclose — let onclose handle reconnect
    };
  }, [isOnline, isServerReachable, refreshPending]);

  const closeWebSocket = useCallback(() => {
    clearTimeout(reconnectTRef.current);
    if (wsRef.current) {
      wsRef.current.onclose = null; // prevent reconnect loop on intentional close
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // ─── Core sync flush ───────────────────────────────────────────────────────

  /**
   * Reads every item from outbox_queue, batches them into a single
   * POST /api/sync call, then handles ACK / CONFLICT / ERROR per item.
   */
  const flushOutbox = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setSyncState('SYNCING');

    try {
      const queue = await getOutboxItems();

      if (!queue.length) {
        setSyncState('IDLE');
        return;
      }

      // Mark all items as SENDING (prevents duplicate dispatch)
      await Promise.all(queue.map((item) => updateOutboxStatus(item.queueId, 'SENDING')));

      // Build the mutations array expected by POST /api/sync
      const mutations = queue.map((item) => ({
        queueId:     item.queueId,
        recordId:    item.recordId,
        action:      item.action,
        payload:     item.payload,
        deviceId:    item.deviceId,
        version:     item.payload?.version     ?? 1,
        vectorClock: item.payload?.vectorClock ?? {},
      }));

      // ── Network call ───────────────────────────────────────────────────────
      const res = await fetch(SYNC_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mutations }),
      });

      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);

      const { results = [] } = await res.json();

      // ── Process per-item results ───────────────────────────────────────────
      const ackedIds    = [];
      const newConflicts = [];

      for (const result of results) {
        switch (result.status) {
          // ── SUCCESS ─────────────────────────────────────────────────────────
          case 'ACK':
          case 'DELETED': {
            await removeFromOutbox(result.queueId);
            ackedIds.push(result.recordId);

            // Overwrite local record with the authoritative server version
            if (result.record) {
              await saveLocalRecord(
                { ..._normalise(result.record), syncState: 'SYNCED' },
                false
              );
            }
            break;
          }

          // ── CONFLICT ────────────────────────────────────────────────────────
          case 'CONFLICT': {
            // Leave item in outbox; mark FAILED for retry after resolution
            await updateOutboxStatus(result.queueId, 'FAILED');

            // Stamp the local record with 'CONFLICT' so the UI can highlight it
            if (result.clientPayload?.id ?? result.recordId) {
              const localId = result.clientPayload?.id ?? result.recordId;
              const existing = await _getLocalById(localId);
              if (existing) {
                await saveLocalRecord({ ...existing, syncState: 'CONFLICT' }, false);
              }
            }

            newConflicts.push({
              serverRecord:  result.serverRecord,
              clientPayload: result.clientPayload,
            });
            break;
          }

          // ── UNEXPECTED ERROR ─────────────────────────────────────────────────
          default: {
            await updateOutboxStatus(result.queueId, 'FAILED');
            console.warn('[useOfflineSync] Unhandled result for', result.recordId, result);
          }
        }
      }

      // Batch-mark synced records
      if (ackedIds.length) await markRecordsSynced(ackedIds);

      // Accumulate new conflicts
      if (newConflicts.length) {
        setConflicts((prev) => [...prev, ...newConflicts]);
        setSyncState('CONFLICT');
      } else {
        setSyncState('IDLE');
      }

      setLastSyncedAt(new Date().toISOString());
      console.log(
        `[useOfflineSync] Flush complete — ACK:${ackedIds.length}  CONFLICT:${newConflicts.length}`
      );
    } catch (err) {
      console.warn('[useOfflineSync] Flush failed (server unreachable):', err.message);
      setSyncState('ERROR');

      // Reset any stuck SENDING → FAILED so next flush retries them
      const stale = await getOutboxItems();
      await Promise.all(
        stale
          .filter((i) => i.status === 'SENDING')
          .map((i) => updateOutboxStatus(i.queueId, 'FAILED'))
      );
    } finally {
      isSyncingRef.current = false;
      refreshPending();
    }
  }, [refreshPending]);

  // ─── Pull all records from server ──────────────────────────────────────────

  const fetchServerRecords = useCallback(async () => {
    try {
      const res = await fetch(RECORDS_URL, { cache: 'no-store' });
      if (!res.ok) return;
      const { data } = await res.json();
      if (Array.isArray(data) && data.length) {
        await bulkUpsertFromServer(data.map(_normalise));
      }
    } catch (err) {
      console.warn('[useOfflineSync] fetchServerRecords failed:', err.message);
    }
  }, []);

  // ─── Connectivity-driven effects ───────────────────────────────────────────

  // Open / close WebSocket and trigger sync when connectivity changes
  useEffect(() => {
    if (isOnline && isServerReachable) {
      openWebSocket();
      fetchServerRecords().then(() => flushOutbox());
    } else {
      closeWebSocket();
      setSyncState('IDLE');
    }
  }, [isOnline, isServerReachable]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial pending count load
  useEffect(() => {
    refreshPending();
  }, [refreshPending]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeWebSocket();
      clearTimeout(reconnectTRef.current);
    };
  }, [closeWebSocket]);

  // ─── Public API ────────────────────────────────────────────────────────────

  return {
    /** 'IDLE' | 'SYNCING' | 'CONFLICT' | 'ERROR' */
    syncState,
    /** Number of mutations waiting in the outbox_queue */
    pendingCount,
    /** Number of unresolved conflicts this session */
    conflictCount: conflicts.length,
    /** Full conflict objects for the resolution UI */
    conflicts,
    /** ISO timestamp of the last fully-successful outbox flush */
    lastSyncedAt,
    /** Manually kick off an outbox flush */
    triggerManualSync: flushOutbox,
    /** Remove a conflict from the list (after user resolves it) */
    dismissConflict: (index) =>
      setConflicts((prev) => prev.filter((_, i) => i !== index)),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise a server record to the shape expected by the local records store.
 * Bridges the server's camelCase fields to the aliases used by UI components.
 */
function _normalise(r) {
  if (!r) return r;
  return {
    ...r,
    // Canonical IndexedDB index field
    triageLevel:     r.triageLevel     ?? r.triage_category,
    // Legacy alias for TriageCard / TriageStats
    triage_category: r.triage_category ?? r.triageLevel,
    patient_name:    r.victimName      ?? r.patient_name,
    tag_number:      r.tag_number      ?? r.id?.slice(0, 8).toUpperCase(),
    updated_at:      r.updatedAt       ?? r.updated_at,
    created_at:      r.createdAt       ?? r.created_at ?? r.updatedAt,
  };
}

/**
 * Minimal local record lookup used when stamping a CONFLICT syncState.
 * Avoids importing the entire indexedDB module's internal helpers.
 */
async function _getLocalById(id) {
  const all = await getLocalRecords();
  return all.find((r) => r.id === id) ?? null;
}
