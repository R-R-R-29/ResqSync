import React from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Radio, 
  ShieldAlert 
} from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function Header({ onOpenNewTriage }) {
  const { isOnline, isSyncing, wsConnected, pendingCount, flushQueue } = useNetworkStatus();

  return (
    <header className="bg-resq-dark border-b border-resq-border sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          
          {/* Logo & Emergency Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-resq-immediate to-red-600 flex items-center justify-center shadow-emergency-glow">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-wider text-white">ResqSync</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-resq-immediate/20 text-resq-immediate border border-resq-immediate/40">
                  DISASTER PROTOCOL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Field Triage & Command Coordination</p>
            </div>
          </div>

          {/* Network & Emergency Sync Indicators */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Online / Offline Status Badge */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              isOnline 
                ? 'bg-emerald-950/60 border-resq-minor text-resq-minor'
                : 'bg-rose-950/60 border-resq-immediate text-resq-immediate shadow-emergency-glow'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ONLINE</span>
                  {wsConnected && (
                    <span className="w-2 h-2 rounded-full bg-resq-minor animate-ping ml-1" title="Real-time WebSocket link active" />
                  )}
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>OFFLINE MODE</span>
                </>
              )}
            </div>

            {/* Offline Sync Queue Counter */}
            {pendingCount > 0 && (
              <button 
                onClick={flushQueue}
                disabled={!isOnline || isSyncing}
                title="Click to force-flush offline queue"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-resq-delayed text-resq-delayed text-xs font-semibold hover:bg-amber-900/60 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{pendingCount} Queued</span>
              </button>
            )}

            {/* Fast Quick-Action Triage Button */}
            <button
              onClick={onOpenNewTriage}
              className="px-4 py-2 rounded-lg bg-resq-immediate hover:bg-red-600 text-white text-sm font-bold tracking-wide flex items-center space-x-2 shadow-emergency-glow active:scale-95 transition"
            >
              <Activity className="w-4 h-4" />
              <span>+ TRIAGE INTAKE</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
