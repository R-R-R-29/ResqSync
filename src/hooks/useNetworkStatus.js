/**
 * useNetworkStatus
 *
 * Aggregation hook consumed by Header, App, and other UI components.
 * Composes useOnlineStatus + useOfflineSync into one convenient object
 * so existing call-sites require no changes.
 *
 * Returns everything from both constituent hooks, flattened:
 *   isOnline, isServerReachable, isSimulatedOffline, setSimulatedOffline,
 *   syncState, pendingCount, conflictCount, conflicts,
 *   lastSyncedAt, flushQueue, dismissConflict, wsConnected
 */

import { useState, useEffect } from 'react';
import { useOnlineStatus }  from './useOnlineStatus';
import { useOfflineSync }   from './useOfflineSync';

export function useNetworkStatus() {
  const connectivity = useOnlineStatus();

  const {
    isOnline,
    isServerReachable,
    isSimulatedOffline,
    setSimulatedOffline,
    pingNow,
  } = connectivity;

  // Effective online = device online AND server reachable AND not simulating offline
  const effectivelyOnline = isOnline && isServerReachable && !isSimulatedOffline;

  const sync = useOfflineSync({
    isOnline:          effectivelyOnline,
    isServerReachable: isServerReachable && !isSimulatedOffline,
  });

  // wsConnected: derive from syncState (SYNCING means WS is active)
  // We track it locally here so Header can show the "pulse" indicator
  const [wsConnected, setWsConnected] = useState(false);
  useEffect(() => {
    setWsConnected(effectivelyOnline && sync.syncState !== 'ERROR');
  }, [effectivelyOnline, sync.syncState]);

  return {
    // ── Connectivity ──────────────────────────────────────────────────────────
    isOnline:           effectivelyOnline,
    isServerReachable,
    isSimulatedOffline,
    setSimulatedOffline,
    wsConnected,
    pingNow,

    // ── Sync ──────────────────────────────────────────────────────────────────
    syncState:       sync.syncState,
    pendingCount:    sync.pendingCount,
    conflictCount:   sync.conflictCount,
    conflicts:       sync.conflicts,
    lastSyncedAt:    sync.lastSyncedAt,
    isSyncing:       sync.syncState === 'SYNCING',

    // ── Actions ───────────────────────────────────────────────────────────────
    flushQueue:      sync.triggerManualSync,
    dismissConflict: sync.dismissConflict,
  };
}
