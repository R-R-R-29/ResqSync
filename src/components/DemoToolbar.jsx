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
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  // 1. 🔘 Toggle Simulated Offline
  const handleToggleOffline = () => {
    const nextState = !isSimulatedOffline;
    setSimulatedOffline(nextState);
    showNotice(
      nextState
        ? 'Field Mode active: Simulated zero-network disconnected'
        : 'Network restored: Live synchronization active'
    );
  };

  // 2. ⚡ Simulate Multi-Device Conflict
  const handleSimulateConflict = async () => {
    setLoadingAction('conflict');
    try {
      if (onTriggerConflict) {
        await onTriggerConflict();
      } else {
        // Direct call to Express demo conflict endpoint
        const res = await fetch('/api/demo/conflict', { method: 'POST' });
        if (!res.ok) throw new Error('Server returned ' + res.status);
      }
      showNotice('⚡ Injected conflicting update from Device-Tablet-02!');
    } catch (err) {
      console.warn('[DemoToolbar] Conflict simulation fallback:', err.message);
      // Fallback local trigger
      if (onTriggerConflict) onTriggerConflict();
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. 🧹 Clear Demo Data (IndexedDB + SQLite)
  const handleClearDemoData = async () => {
    if (!window.confirm('Reset ResqSync demo state? Both client IndexedDB and server SQLite tables will be wiped clean.')) {
      return;
    }
    setLoadingAction('clear');
    try {
      // 1. Wipe client IndexedDB
      await clearLocalData();

      // 2. Wipe server SQLite database
      await fetch('/api/demo/clear', { method: 'POST' }).catch(() => {});

      showNotice('🧹 Demo data wiped clean from IndexedDB and SQLite');

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
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-200">
      
      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="max-w-md mx-auto mb-2 px-4 py-2 bg-slate-900 border border-amber-500/80 text-amber-200 text-xs font-bold rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Bar */}
      <div className="bg-slate-950/95 border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Strip with Toggle Chevron */}
          <div className="py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1.5">
                Judge Sandbox Controls
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  HACKATHON DEMO TOOLBAR
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Quick status counters */}
              <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono">
                <span className={`px-2 py-0.5 rounded border ${
                  isSimulatedOffline 
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700' 
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                }`}>
                  {isSimulatedOffline ? 'SIMULATED OFFLINE' : 'LIVE ONLINE'}
                </span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {pendingCount} Queued
                  </span>
                )}
                {conflictCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                    {conflictCount} Conflict
                  </span>
                )}
              </div>

              {/* Collapse/Expand Toggle */}
              <button
                id="toggle-demo-toolbar-btn"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800 transition"
                title={isExpanded ? 'Collapse Sandbox Toolbar' : 'Expand Sandbox Toolbar'}
              >
                <span className="text-[11px] font-semibold">{isExpanded ? 'Hide' : 'Show Tools'}</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Action Panel */}
          {isExpanded && (
            <div className="pt-1 pb-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-in fade-in duration-150">
              
              {/* Action 1: 🔘 Toggle Simulated Offline */}
              <button
                id="btn-toggle-simulated-offline"
                onClick={handleToggleOffline}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 active:scale-95 shadow-md ${
                  isSimulatedOffline
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 ring-2 ring-amber-400/40 shadow-warning-glow'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500/60'
                }`}
                title="Toggles simulated network cut without disabling computer Wi-Fi"
              >
                {isSimulatedOffline ? (
                  <>
                    <Wifi className="w-4 h-4 text-slate-950" />
                    <span>🔘 Resume Live Sync (Go Online)</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-amber-400" />
                    <span>🔘 Toggle Simulated Offline</span>
                  </>
                )}
              </button>

              {/* Action 2: ⚡ Simulate Multi-Device Conflict */}
              <button
                id="btn-simulate-conflict"
                onClick={handleSimulateConflict}
                disabled={loadingAction === 'conflict'}
                className="py-2 px-3 rounded-xl border border-red-500/60 bg-red-950/70 hover:bg-red-900/80 text-red-200 text-xs font-bold transition flex items-center justify-center space-x-2 active:scale-95 shadow-emergency-glow disabled:opacity-50"
                title="Inject a conflicting server update from Device-Tablet-02 to trigger 3-Way Conflict Modal"
              >
                <Zap className={`w-4 h-4 text-red-400 ${loadingAction === 'conflict' ? 'animate-bounce' : ''}`} />
                <span>
                  {loadingAction === 'conflict' ? 'Injecting...' : '⚡ Simulate Multi-Device Conflict'}
                </span>
              </button>

              {/* Action 3: 🧹 Clear Demo Data */}
              <button
                id="btn-clear-demo-data"
                onClick={handleClearDemoData}
                disabled={loadingAction === 'clear'}
                className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-rose-950/60 hover:border-rose-700/80 text-slate-300 hover:text-rose-200 text-xs font-bold transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                title="Reset IndexedDB and SQLite database to empty state"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>
                  {loadingAction === 'clear' ? 'Wiping DBs...' : '🧹 Clear Demo Data'}
                </span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DemoToolbar;
