import React from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export function OfflineBanner({
  isOnline = true,
  isSimulatedOffline = false,
  setSimulatedOffline,
  syncState = 'IDLE',
  pendingCount = 0,
  conflictCount = 0,
  onResolveConflict,
}) {
  const { t } = useTranslation();

  // 1. 🔴 Action Required: Conflict Detected
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
              <strong className="font-bold text-[#171717]">{t('conflictTitle', 'SYNC DISCREPANCY DETECTED')}</strong>
              <span className="block text-xs text-[#66615D] sm:inline sm:ml-2">
                {conflictCount} {t('conflictSub', 'casualty records received differing field updates from another unit.')}
              </span>
            </div>
          </div>
          {onResolveConflict && (
            <button
              onClick={onResolveConflict}
              className="shrink-0 ml-3 px-4 py-1.5 bg-[#E85B4A] hover:bg-[#C94336] text-white rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1.5 min-h-[38px]"
            >
              <span>{t('resolveConflictsBtn', 'Review Differences')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. 🟠 Offline & Changes Queued
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
                {t('offlineStatusText', 'OFFLINE — LOGS SAVED LOCALLY')} ({pendingCount})
              </span>
              <span className="block text-xs text-[#66615D] sm:inline sm:ml-2">
                {t('logbookSub', 'Your entries remain safe on this handset and will upload automatically when signal returns.')}
              </span>
            </div>
          </div>
          {isSimulatedOffline && setSimulatedOffline && (
            <button
              onClick={() => setSimulatedOffline(false)}
              className="shrink-0 ml-3 px-4 py-1.5 bg-white border border-[#E6E1DD] hover:border-[#E85B4A] text-[#171717] rounded-full text-xs font-bold transition shadow-sm min-h-[38px]"
            >
              {t('goOnlineBtn', 'Resume Live Sync')}
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
                ● {t('syncedNow', 'Syncing outbox with command server...')} ({pendingCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. 🟢 Online & Synced
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
          <span className="font-bold text-[#171717]">{t('baseLinked', 'CONNECTED')}</span>
          <span className="hidden sm:inline text-[#8A8580]">• {t('connectedBase', 'Live link to base camp active.')}</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-[#8A8580] font-mono">
          <Wifi className="w-3.5 h-3.5 text-[#4F9D69]" aria-hidden="true" />
          <span className="hidden sm:inline">{t('baseLinked', 'Live Stream Active')}</span>
        </div>
      </div>
    </div>
  );
}

export default OfflineBanner;
