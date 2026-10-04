import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
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
  // 1. 🔴 Action Required: Conflict Detected (Soft Coral card with clear icon & action)
  if (conflictCount > 0 || syncState === 'CONFLICT') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <div
          role="alert"
          aria-live="assertive"
          className="w-full bg-[#FDE3DF] text-[#C94336] border border-[#FBCBC4] rounded-2xl px-4 py-3 shadow-soft flex items-center justify-between text-xs sm:text-sm font-semibold"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-full bg-white text-[#C94336] shadow-sm shrink-0">
              <AlertTriangle className="w-4 h-4 animate-bounce" aria-hidden="true" />
            </div>
            <div>
              <strong className="font-bold text-[#171717]">CONFLICTS REQUIRE ATTENTION</strong>
              <span className="block text-xs text-[#66615D] sm:inline sm:ml-2">
                {conflictCount} casualty record{conflictCount > 1 ? 's' : ''} updated concurrently while offline.
              </span>
            </div>
          </div>
          {onResolveConflict && (
            <button
              onClick={onResolveConflict}
              className="shrink-0 ml-3 px-4 py-1.5 bg-[#E85B4A] hover:bg-[#C94336] text-white rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1.5 min-h-[38px]"
            >
              <span>Review Conflict</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. 🟠 Offline & Changes Queued (Calm warm neutral card, not an aggressive error)
  if (!isOnline) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <div
          role="status"
          aria-live="polite"
          className="w-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] rounded-2xl px-4 py-3 shadow-soft flex items-center justify-between text-xs sm:text-sm font-semibold"
        >
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-full bg-white text-[#E5A33D] shadow-sm shrink-0">
              <WifiOff className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#171717]">
                <span className="w-2 h-2 rounded-full bg-[#E5A33D]" />
                OFFLINE — {pendingCount} {pendingCount === 1 ? 'CHANGE' : 'CHANGES'} QUEUED
              </span>
              <span className="block text-xs text-[#66615D] sm:inline sm:ml-2">
                All records stored safely in device IndexedDB. Will sync when link restores.
              </span>
            </div>
          </div>
          {isSimulatedOffline && setSimulatedOffline && (
            <button
              onClick={() => setSimulatedOffline(false)}
              className="shrink-0 ml-3 px-4 py-1.5 bg-white border border-[#E6E1DD] hover:border-[#E85B4A] text-[#171717] rounded-full text-xs font-bold transition shadow-sm min-h-[38px]"
            >
              Resume Live Sync
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. 🟡 Syncing in Progress
  if (syncState === 'SYNCING' || (pendingCount > 0 && isOnline)) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <div
          role="status"
          aria-live="polite"
          className="w-full bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] rounded-2xl px-4 py-2.5 shadow-soft flex items-center justify-between text-xs sm:text-sm font-semibold"
        >
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-4 h-4 text-[#5C83B6] animate-spin shrink-0" aria-hidden="true" />
            <div>
              <span className="font-bold text-[#171717]">
                ● SYNCING — {pendingCount} {pendingCount === 1 ? 'CHANGE' : 'CHANGES'}
              </span>
              <span className="text-xs text-[#66615D] ml-2 hidden sm:inline">
                Reconciling local mutations with central command...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. 🟢 Online & Synced (Clean, unobtrusive status bar)
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-0.5">
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-white border border-[#E6E1DD] rounded-full px-4 py-1.5 flex items-center justify-between text-xs text-[#66615D] shadow-soft"
      >
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F9D69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F9D69]"></span>
          </span>
          <span className="font-bold text-[#171717]">ONLINE — SYNCED</span>
          <span className="hidden sm:inline text-[#8A8580]">• Central command linked. Zero data loss protocol active.</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-[#8A8580] font-mono">
          <Wifi className="w-3.5 h-3.5 text-[#4F9D69]" aria-hidden="true" />
          <span className="hidden sm:inline">WebSocket Live</span>
        </div>
      </div>
    </div>
  );
}

export default OfflineBanner;
