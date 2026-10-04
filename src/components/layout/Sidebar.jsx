import React from 'react';
import {
  Home,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
  Radio,
  Wifi,
  WifiOff,
  PhoneCall,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  isOnline = true,
  pendingCount = 0,
  conflictCount = 0,
  recordsCount = 0,
  isCollapsed = false,
  setIsCollapsed,
  emergencyMode = false,
}) {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, count: null },
    { id: 'records', label: 'Casualties', icon: Users, count: recordsCount },
    { id: 'map', label: 'Map / Field', icon: MapPin, count: null },
    {
      id: 'conflicts',
      label: 'Conflicts',
      icon: AlertTriangle,
      count: conflictCount > 0 ? conflictCount : null,
      highlight: conflictCount > 0,
    },
    { id: 'settings', label: 'Settings', icon: Settings, count: null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Desktop Tactical Navigation"
    >
      {/* ── Top Sync Status Card ── */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <div
          className={`rounded-xl p-3 border transition-colors ${
            !isOnline
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/50 dark:border-amber-700'
              : conflictCount > 0
              ? 'bg-red-50 border-red-300 dark:bg-red-950/50 dark:border-red-700'
              : 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="shrink-0">
              {!isOnline ? (
                <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              ) : conflictCount > 0 ? (
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-bounce" aria-hidden="true" />
              ) : (
                <Wifi className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 truncate">
                  {!isOnline ? 'Offline Field' : conflictCount > 0 ? 'Conflict Alert' : 'Command Synced'}
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                  {!isOnline
                    ? `${pendingCount} queued in outbox`
                    : conflictCount > 0
                    ? `${conflictCount} reviews required`
                    : 'Real-time WebSocket'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Navigation List ── */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center rounded-xl transition-all font-bold ${
                emergencyMode ? 'min-h-[56px] text-base px-4' : 'min-h-[48px] text-sm px-3.5'
              } ${
                isActive
                  ? 'bg-aid-primary text-white shadow-aid-raised'
                  : item.highlight
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={emergencyMode ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} aria-hidden="true" />

              {!isCollapsed && (
                <span className="ml-3 truncate flex-1 text-left">{item.label}</span>
              )}

              {!isCollapsed && item.count != null && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Emergency SOS / Quick Contact Bar ── */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-aid-light dark:bg-slate-800/80 border border-aid-border/40 dark:border-slate-700">
            <div className="flex items-center space-x-2 text-aid-primary font-bold text-xs uppercase tracking-wider mb-1">
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>National Disaster Hotline</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              1078 <span className="text-xs text-slate-500 font-normal">/ 112 SOS</span>
            </div>
          </div>
        )}

        {/* Collapse Sidebar Button */}
        {setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 mr-1" />}
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
