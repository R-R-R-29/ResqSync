import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Radio,
  ArrowRight,
} from 'lucide-react';

export function OfflineBanner({
  isOnline = true,
  isSimulatedOffline = false,
  setSimulatedOffline,
  syncState = 'IDLE',
  pendingCount = 0,
  conflictCount = 0,
  onResolveConflict,
}) {
  // 1. 🔴 Action Required: Conflict Detected
  if (conflictCount > 0 || syncState === 'CONFLICT') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="w-full bg-red-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-bold border-b border-red-700"
      >
        <div className="flex items-center space-x-2.5 max-w-4xl">
          <div className="p-1 rounded-md bg-white/20 shrink-0">
            <AlertTriangle className="w-4 h-4 text-white animate-bounce" aria-hidden="true" />
          </div>
          <span>
            <strong>CONFLICT DETECTED</strong> — {conflictCount} patient record{conflictCount > 1 ? 's' : ''} need human medical review.
          </span>
        </div>
        {onResolveConflict && (
          <button
            onClick={onResolveConflict}
            className="shrink-0 ml-3 px-3 py-1 bg-white text-red-700 hover:bg-red-50 rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center gap-1 min-h-[36px]"
          >
            <span>Resolve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // 2. 🟠 Offline & Queued
  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-bold border-b border-amber-600"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1 rounded-md bg-slate-950/10 shrink-0">
            <WifiOff className="w-4 h-4 text-slate-950" aria-hidden="true" />
          </div>
          <span>
            <strong>OFFLINE MODE</strong> — {pendingCount} change{pendingCount !== 1 ? 's' : ''} saved locally on this device.
          </span>
        </div>
        {isSimulatedOffline && setSimulatedOffline && (
          <button
            onClick={() => setSimulatedOffline(false)}
            className="shrink-0 ml-3 px-3 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition min-h-[36px]"
          >
            Resume Live Sync
          </button>
        )}
      </div>
    );
  }

  // 3. 🟡 Syncing in Progress
  if (syncState === 'SYNCING' || (pendingCount > 0 && isOnline)) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-4 py-2 shadow-sm flex items-center justify-between text-xs sm:text-sm font-semibold border-b border-amber-300 dark:border-amber-800"
      >
        <div className="flex items-center space-x-2.5">
          <RefreshCw className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-spin shrink-0" aria-hidden="true" />
          <span>
            <strong>SYNCHRONIZING</strong> — Uploading {pendingCount} pending edit{pendingCount !== 1 ? 's' : ''} to central command...
          </span>
        </div>
      </div>
    );
  }

  // 4. 🟢 Online & Synced (Clean subtle green bar)
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-emerald-50 text-emerald-900 dark:bg-slate-900 dark:text-emerald-300 px-4 py-1.5 flex items-center justify-between text-xs font-medium border-b border-emerald-200 dark:border-slate-800"
    >
      <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
        </span>
        <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <span>
          <strong>ONLINE</strong> — Central command linked. All patient changes synced.
        </span>
      </div>
    </div>
  );
}

export default OfflineBanner;
