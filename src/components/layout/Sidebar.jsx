import React from 'react';
import {
  Home,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
  Wifi,
  WifiOff,
  PhoneCall,
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
    { id: 'dashboard', label: 'Home', icon: Home, count: null },
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
      className={`hidden md:flex flex-col bg-white border-r border-outline transition-all duration-200 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Desktop Navigation"
    >
      {/* ── Top Sync Status Card ── */}
      <div className="p-3.5 border-b border-[#F3F1EF]">
        <div
          className={`rounded-2xl p-3 border transition-colors ${
            !isOnline
              ? 'bg-[#FEF3C7] border-[#FDE68A]'
              : conflictCount > 0
              ? 'bg-[#FDE3DF] border-[#FBCBC4]'
              : 'bg-[#ECFDF5] border-[#A7F3D0]'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="shrink-0">
              {!isOnline ? (
                <WifiOff className="w-5 h-5 text-[#E5A33D]" aria-hidden="true" />
              ) : conflictCount > 0 ? (
                <AlertTriangle className="w-5 h-5 text-[#D94343] animate-bounce" aria-hidden="true" />
              ) : (
                <Wifi className="w-5 h-5 text-[#4F9D69]" aria-hidden="true" />
              )}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-ink truncate">
                  {!isOnline ? 'Offline Safe' : conflictCount > 0 ? 'Conflict Alert' : 'Command Synced'}
                </div>
                <div className="text-[11px] text-ink-secondary truncate">
                  {!isOnline
                    ? `${pendingCount} saved in outbox`
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
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center rounded-full transition-all font-bold ${
                emergencyMode ? 'min-h-[56px] text-base px-4' : 'min-h-[46px] text-sm px-4'
              } ${
                isActive
                  ? 'bg-coral text-white shadow-aid-raised'
                  : item.highlight
                  ? 'bg-[#FDE3DF] text-[#C94336] hover:bg-[#FBCBC4]/60'
                  : 'text-ink-secondary hover:bg-surface-secondary hover:text-ink'
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
                      ? 'bg-[#D94343] text-white'
                      : 'bg-surface-secondary text-ink'
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
      <div className="p-3.5 border-t border-[#F3F1EF] space-y-2">
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-coral-light/50 border border-coral-light">
            <div className="flex items-center space-x-2 text-coral font-bold text-xs uppercase tracking-wider mb-1">
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Emergency Helpline</span>
            </div>
            <div className="text-base font-black text-ink font-mono">
              1078 <span className="text-xs text-ink-muted font-normal">/ 112 SOS</span>
            </div>
          </div>
        )}

        {/* Collapse Sidebar Button */}
        {setIsCollapsed && (
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="w-full flex items-center justify-center p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-secondary transition text-xs font-semibold"
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
