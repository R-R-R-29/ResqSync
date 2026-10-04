import React, { useState } from 'react';
import {
  Wrench,
  WifiOff,
  Wifi,
  Zap,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { clearLocalData } from '../db/indexedDB';

export function DemoToolbar({
  isSimulatedOffline,
  setSimulatedOffline,
  onTriggerConflict,
  onResetData,
  pendingCount = 0,
  conflictCount = 0,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  // 1. 🔘 Toggle Simulated Offline
  const handleToggleOffline = () => {
    const nextState = !isSimulatedOffline;
    setSimulatedOffline(nextState);
    showNotice(
      nextState
        ? 'Field Mode: Working offline without network'
        : 'Network Restored: Syncing with Base Station'
    );
  };

  // 2. ⚡ Simulate Multi-Device Conflict
  const handleSimulateConflict = async () => {
    setLoadingAction('conflict');
    try {
      if (onTriggerConflict) {
        await onTriggerConflict();
      } else {
        const res = await fetch('/api/demo/conflict', { method: 'POST' });
        if (!res.ok) throw new Error('Server returned ' + res.status);
      }
      showNotice('⚡ Simulated differing field update from Ambulance 04 (Dr. Sunita Rao)');
    } catch (err) {
      console.warn('[DemoToolbar] Conflict simulation fallback:', err.message);
      if (onTriggerConflict) onTriggerConflict();
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. 🧹 Clear Demo Data
  const handleClearDemoData = async () => {
    if (!window.confirm('Reset ResqSync demo state? Local storage and server records will be reinitialized.')) {
      return;
    }
    setLoadingAction('clear');
    try {
      await clearLocalData();
      await fetch('/api/demo/clear', { method: 'POST' }).catch(() => {});
      showNotice('🧹 Demo records reinitialized to initial state');

      if (onResetData) {
        onResetData();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      showNotice('Error resetting data: ' + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const showNotice = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-200 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pointer-events-auto">
        
        {/* Feedback Toast */}
        {actionFeedback && (
          <div className="max-w-md mx-auto mb-2 px-4 py-2 bg-ink border border-coral text-white text-xs font-bold rounded-full shadow-2xl flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-coral shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Floating Bar Container */}
        <div className="bg-ink/95 text-white border border-white/20 rounded-3xl sm:rounded-full p-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
            
            {/* Left Tag */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-coral/30 border border-coral flex items-center justify-center text-coral">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-wider uppercase text-white flex items-center gap-1.5">
                Judge Sandbox Tools
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isSimulatedOffline 
                    ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' 
                    : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                }`}>
                  {isSimulatedOffline ? 'SIMULATED OFFLINE' : 'ONLINE'}
                </span>
              </span>
            </div>

            {/* Quick Actions (Always visible on desktop, or collapsible on mobile) */}
            <div className={`flex flex-wrap items-center gap-2 ${isExpanded ? 'flex' : 'hidden sm:flex'}`}>
              <button
                id="btn-toggle-simulated-offline"
                onClick={handleToggleOffline}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 min-h-[38px] ${
                  isSimulatedOffline
                    ? 'bg-[#E5A33D] text-slate-950 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Toggles simulated network cut without disabling computer Wi-Fi"
              >
                {isSimulatedOffline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-slate-950" />
                    <span>Go Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-[#E5A33D]" />
                    <span>Simulate Offline</span>
                  </>
                )}
              </button>

              <button
                id="btn-simulate-conflict"
                onClick={handleSimulateConflict}
                disabled={loadingAction === 'conflict'}
                className="px-4 py-1.5 rounded-full bg-coral hover:bg-coral-dark text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm min-h-[38px] disabled:opacity-50"
                title="Inject a conflicting server update from Device-Tablet-02 to trigger 3-Way Conflict Modal"
              >
                <Zap className={`w-3.5 h-3.5 text-white ${loadingAction === 'conflict' ? 'animate-bounce' : ''}`} />
                <span>{loadingAction === 'conflict' ? 'Injecting...' : 'Simulate Conflict'}</span>
              </button>

              <button
                id="btn-clear-demo-data"
                onClick={handleClearDemoData}
                disabled={loadingAction === 'clear'}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-rose-900/80 text-white text-xs font-bold transition flex items-center space-x-1.5 min-h-[38px] disabled:opacity-50"
                title="Reset IndexedDB and SQLite database to clean state"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Mobile Toggle Button */}
            <button
              id="toggle-demo-toolbar-btn"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="sm:hidden text-xs text-white/70 hover:text-white flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10"
            >
              <span>{isExpanded ? 'Hide Tools' : 'Open Tools'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default DemoToolbar;
