/**
 * src/services/syncService.js
 *
 * Orchestrates bidirectional synchronisation between the local IndexedDB
 * outbox_queue and the ResqSync REST + WebSocket server.
 *
 * Flow (online):
 *   1. WebSocket connects and receives RECORD_UPDATED / SYNC_CONFLICT pushes.
 *   2. On connect (or when coming back online) flushOutbox() drains the
 *      outbox_queue by POSTing to /api/sync.
 *   3. Server returns per-item ACK | CONFLICT | ERROR results.
 *   4. Listeners (useNetworkStatus, useTriage) are notified so the UI
 *      updates without an explicit refresh.
 *
 * Flow (offline):
 *   All mutations are stored in IndexedDB (outbox_queue + records) and the
 *   service emits NETWORK_CHANGE events so the UI shows "Field Mode" banners.
 */

import {
  saveLocalRecord,
  getOutboxItems,
  removeFromOutbox,
  updateOutboxStatus,
  bulkUpsertFromServer,
  markRecordsSynced,
} from '../db/indexedDB';

class SyncService {
  constructor() {
    this.ws          = null;
    this.isOnline    = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSyncing   = false;
    this.listeners   = new Set();
    this._reconnectT = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('online',  () => this._handleNetworkChange(true));
      window.addEventListener('offline', () => this._handleNetworkChange(false));
      this.initWebSocket();
    }
  }

  // ─── Pub/Sub ────────────────────────────────────────────────────────────────

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(event) {
    for (const fn of this.listeners) {
      try { fn(event); } catch (err) { console.error('[SyncService]', err); }
    }
  }

  // ─── Network state ──────────────────────────────────────────────────────────

  _handleNetworkChange(online) {
    this.isOnline = online;
    console.log(`[SyncService] Network → ${online ? 'ONLINE' : 'OFFLINE'}`);
    this._emit({ type: 'NETWORK_CHANGE', isOnline: online });

    if (online) {
      this.initWebSocket();
      this.flushOutbox();
    } else {
      this.ws?.close();
    }
  }

  // ─── WebSocket ──────────────────────────────────────────────────────────────

  initWebSocket() {
    if (!this.isOnline) return;
    if (this.ws?.readyState === WebSocket.OPEN ||
        this.ws?.readyState === WebSocket.CONNECTING) return;

    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host  = window.location.host;
    const url   = `${proto}//${host}/ws`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[SyncService] WebSocket connected');
        this._emit({ type: 'WS_STATUS', connected: true });
        this.flushOutbox();
      };

      this.ws.onmessage = async ({ data }) => {
        try { await this._handleServerPush(JSON.parse(data)); }
        catch (err) { console.error('[SyncService] Bad WS frame:', err); }
      };

      this.ws.onclose = () => {
        this._emit({ type: 'WS_STATUS', connected: false });
        if (this.isOnline) {
          clearTimeout(this._reconnectT);
          this._reconnectT = setTimeout(() => this.initWebSocket(), 3000);
        }
      };

      this.ws.onerror = () => {
        console.warn('[SyncService] WebSocket error — server may be down');
      };
    } catch (err) {
      console.warn('[SyncService] Could not open WebSocket:', err);
    }
  }

  /** Handle server-pushed events (RECORD_UPDATED, SYNC_CONFLICT) */
  async _handleServerPush(msg) {
    switch (msg.type) {
      case 'RECORD_UPDATED':
        if (msg.record) {
          await saveLocalRecord(_normaliseServerRecord(msg.record), false);
          this._emit({ type: 'DATA_UPDATED', record: msg.record });
        }
        break;

      case 'SYNC_CONFLICT':
        // Bubble conflict up so UI can present a resolution dialog
        this._emit({ type: 'CONFLICT_DETECTED', conflict: msg.conflict });
        break;

      case 'BATCH_SYNC_COMPLETED':
        await this.fetchServerRecords();
        break;

      default:
        break;
    }
  }

  // ─── Outbox flush ───────────────────────────────────────────────────────────

  /**
   * Drains the outbox_queue to /api/sync.
   * Handles ACK, CONFLICT, and ERROR results per item.
   */
  async flushOutbox() {
    if (!this.isOnline || this.isSyncing) return;
    this.isSyncing = true;
    this._emit({ type: 'SYNC_START' });

    try {
      const queue = await getOutboxItems();
      if (!queue.length) {
        this._emit({ type: 'SYNC_COMPLETE', syncedCount: 0 });
        return;
      }

      console.log(`[SyncService] Flushing ${queue.length} outbox items…`);

      // Mark all as SENDING so concurrent calls skip them
      await Promise.all(queue.map((item) => updateOutboxStatus(item.queueId, 'SENDING')));

      // Build mutations array for the server
      const mutations = queue.map((item) => ({
        queueId:     item.queueId,
        recordId:    item.recordId,
        action:      item.action,
        payload:     item.payload,
        deviceId:    item.deviceId,
        version:     item.payload?.version ?? 1,
        vectorClock: item.payload?.vectorClock ?? {},
      }));

      const res = await fetch('/api/sync', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mutations }),
      });

      if (!res.ok) throw new Error(`Server responded with HTTP ${res.status}`);

      const { results = [] } = await res.json();

      const syncedRecordIds = [];

      for (const result of results) {
        if (result.status === 'ACK' || result.status === 'DELETED') {
          await removeFromOutbox(result.queueId);
          syncedRecordIds.push(result.recordId);
        } else if (result.status === 'CONFLICT') {
          // Leave in outbox; mark FAILED so the UI can surface it
          await updateOutboxStatus(result.queueId, 'FAILED');
          this._emit({
            type:     'CONFLICT_DETECTED',
            conflict: { serverRecord: result.serverRecord, clientPayload: result.clientPayload },
          });
        } else {
          // Unexpected ERROR
          await updateOutboxStatus(result.queueId, 'FAILED');
          console.warn(`[SyncService] Item ${result.recordId} errored:`, result.error);
        }
      }

      if (syncedRecordIds.length) await markRecordsSynced(syncedRecordIds);

      console.log(`[SyncService] Flush done — ${syncedRecordIds.length} ACK'd`);
      this._emit({ type: 'SYNC_COMPLETE', syncedCount: syncedRecordIds.length });
    } catch (err) {
      console.warn('[SyncService] Flush deferred (server unreachable):', err.message);

      // Reset SENDING → FAILED so next flush retries them
      const stale = await getOutboxItems();
      await Promise.all(
        stale.filter((i) => i.status === 'SENDING')
             .map((i) => updateOutboxStatus(i.queueId, 'FAILED'))
      );

      this._emit({ type: 'SYNC_ERROR', error: err.message });
    } finally {
      this.isSyncing = false;
    }
  }

  // ─── Server pull ────────────────────────────────────────────────────────────

  /** Pull all canonical records from the server and merge into local DB */
  async fetchServerRecords() {
    try {
      const res = await fetch('/api/records');
      if (!res.ok) return;
      const { data } = await res.json();
      if (Array.isArray(data) && data.length) {
        await bulkUpsertFromServer(data.map(_normaliseServerRecord));
        this._emit({ type: 'DATA_REFRESHED' });
      }
    } catch (err) {
      console.warn('[SyncService] fetchServerRecords offline:', err.message);
    }
  }
}

// ─── Normalisation ────────────────────────────────────────────────────────────

/**
 * Map the server's canonical field names to the shape expected by the local
 * IndexedDB `records` store, preserving both naming conventions so the UI
 * components (which reference `triageLevel` / `triage_category`) work without
 * changes.
 */
function _normaliseServerRecord(r) {
  return {
    ...r,
    // Canonical IndexedDB index field
    triageLevel:     r.triageLevel ?? r.triage_category,
    // Legacy alias kept for TriageCard / TriageStats compatibility
    triage_category: r.triage_category ?? r.triageLevel,
    // Alias for server field
    patient_name:    r.victimName ?? r.patient_name,
    tag_number:      r.tag_number ?? r.id?.slice(0, 8).toUpperCase(),
    updated_at:      r.updatedAt ?? r.updated_at,
    created_at:      r.createdAt ?? r.created_at ?? r.updatedAt,
  };
}

export const syncService = new SyncService();
