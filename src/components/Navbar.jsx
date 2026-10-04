import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  SlidersHorizontal,
  ShieldOff,
  Trash2,
  Database,
  PlusCircle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { clearLocalData } from '../db/indexedDB';

export function Navbar({ onOpenNewTriage, onSeedData }) {
  const {
    isOnline,
    isSimulatedOffline,
    setSimulatedOffline,
    syncState,
    pendingCount,
    conflictCount,
    isSyncing,
    flushQueue,
    wsConnected,
  } = useNetworkStatus();

  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  // Determine Live Status Badge state per Prompt 5 spec
  const renderLiveStatusBadge = () => {
    // 4. 🔴 Conflict Detected
    if (conflictCount > 0 || syncState === 'CONFLICT') {
      return (
        <div
          id="status-badge-conflict"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-bold tracking-wide shadow-emergency-glow animate-pulse"
          title={`${conflictCount} sync conflicts requiring resolution`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
          <span>Conflict Detected</span>
        </div>
      );
    }

    // 3. 🟠 Offline (N Queued)
    if (!isOnline) {
      return (
        <div
          id="status-badge-offline"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-950/70 border border-amber-600 text-amber-300 text-xs font-bold tracking-wide shadow-warning-glow"
          title="Field Mode active - operations stored in IndexedDB"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
          <span>Offline ({pendingCount} Queued)</span>
        </div>
      );
    }

    // 2. 🟡 Syncing (N Pending)
    if (isSyncing || syncState === 'SYNCING' || (isOnline && pendingCount > 0 && syncState !== 'IDLE')) {
      return (
        <div
          id="status-badge-syncing"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-950/70 border border-amber-400 text-amber-200 text-xs font-bold tracking-wide"
          title="Pushing local mutations to command server"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Syncing ({pendingCount} Pending)</span>
        </div>
      );
    }

    // 1. 🟢 Online (Synced)
    return (
      <div
        id="status-badge-online"
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/70 text-emerald-300 text-xs font-bold tracking-wide shadow-stable-glow"
        title="Connected to Incident Command Base (WebSocket active)"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span>Online (Synced)</span>
      </div>
    );
  };

  const handleClearDatabase = async () => {
    if (window.confirm('Reset local IndexedDB and outbox queue? All unsynced local triage records will be cleared.')) {
      try {
        await clearLocalData();
        setResetMessage('Local database wiped successfully');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (err) {
        setResetMessage('Failed to reset: ' + err.message);
      }
    }
  };

  return (
    <>
      <nav className="bg-slate-950/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Emergency Responder Header Logo with Beacon Icon */}
            <div className="flex items-center space-x-3.5">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 shadow-emergency-glow border border-red-500/50">
                <Radio className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-slate-900"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black tracking-wider text-white">ResqSync</span>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-red-500/20 text-red-400 border border-red-500/40">
                    EMERGENCY RESPONDER
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Tactical Incident Command • Zero-Latency Mesh
                </p>
              </div>
            </div>

            {/* Right: Live Status Badge + Demo Controls Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Live Status Badge */}
              <div className="hidden sm:block">
                {renderLiveStatusBadge()}
              </div>

              {/* Demo Controls Toggle Button */}
              <button
                id="demo-controls-toggle"
                onClick={() => setIsDemoControlsOpen((prev) => !prev)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  isDemoControlsOpen
                    ? 'bg-red-600/20 border-red-500 text-red-300 shadow-emergency-glow'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Open Simulator & Field Demo Controls"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Demo Controls</span>
                <span className="md:hidden">Demo</span>
              </button>

              {/* Optional Quick Intake modal opener */}
              {onOpenNewTriage && (
                <button
                  onClick={onOpenNewTriage}
                  className="px-3.5 py-2 rounded-xl bg-resq-immediate hover:bg-red-600 text-white text-xs font-extrabold shadow-emergency-glow transition flex items-center space-x-1.5 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">+ Intake</span>
                </button>
              )}

            </div>
          </div>

          {/* Mobile Status Badge row */}
          <div className="sm:hidden pt-2.5 pb-0.5 border-t border-slate-800/80 mt-2 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Link Status:</span>
            {renderLiveStatusBadge()}
          </div>
        </div>
      </nav>

      {/* Demo Controls Dropdown / Drawer Panel */}
      {isDemoControlsOpen && (
        <div className="bg-slate-900/95 border-b border-slate-800 backdrop-blur shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Disaster Drill Simulator & Demo Controls
                </h3>
              </div>
              <button
                onClick={() => setIsDemoControlsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition self-end md:self-auto"
                title="Close Demo Controls"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
              
              {/* Control 1: Simulate Offline */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">Simulate Offline</span>
                    {isSimulatedOffline ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        PAUSED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Cut network connection to test zero-network victim tagging and outbox queueing.
                  </p>
                </div>
                <button
                  id="toggle-simulated-offline"
                  onClick={() => setSimulatedOffline((prev) => !prev)}
                  className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    isSimulatedOffline
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <ShieldOff className="w-3.5 h-3.5" />
                  <span>{isSimulatedOffline ? 'Resume Network Link' : 'Simulate Offline Mode'}</span>
                </button>
              </div>

              {/* Control 2: Force Outbox Flush */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">Manual Outbox Flush</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {pendingCount} Pending
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Force synchronization of all pending mutations to SQLite server backend.
                  </p>
                </div>
                <button
                  id="force-sync-button"
                  onClick={flushQueue}
                  disabled={!isOnline || isSyncing}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing Outbox...' : 'Force Sync Now'}</span>
                </button>
              </div>

              {/* Control 3: Seed Demo Victims */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">Seed Drill Victims</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      +4 Sample
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Populate 4 realistic START triage casualties (Red, Yellow, Green, Black).
                  </p>
                </div>
                <button
                  id="seed-demo-data-button"
                  onClick={onSeedData}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center space-x-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Seed Drill Victims</span>
                </button>
              </div>

              {/* Control 4: Reset Local Database */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-300">Wipe IndexedDB</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Reset
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Clear local records and outbox stores to test fresh client bootstrapping.
                  </p>
                </div>
                <button
                  id="wipe-database-button"
                  onClick={handleClearDatabase}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-rose-600/80 hover:bg-rose-600 text-white transition flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Database</span>
                </button>
              </div>

            </div>

            {resetMessage && (
              <div className="mt-3 p-2 text-xs font-semibold bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-lg flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{resetMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
