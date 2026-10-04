import React from 'react';
import {
  Home,
  Users,
  MapPin,
  AlertTriangle,
  Settings,
} from 'lucide-react';

/**
 * BottomNav
 * Mobile Navigation (< 768px) per AidConnect Emergency UI Kit standard.
 * 5 primary destinations with min 48px touch targets.
 */
export function BottomNav({
  activeTab = 'dashboard',
  onSelectTab,
  conflictCount = 0,
  unsyncedCount = 0,
  emergencyMode = false,
}) {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    {
      id: 'records',
      label: 'Casualties',
      icon: Users,
      badge: unsyncedCount > 0 ? unsyncedCount : null,
      badgeClass: 'bg-amber-500 text-slate-950',
    },
    { id: 'map', label: 'Map / Field', icon: MapPin },
    {
      id: 'conflicts',
      label: 'Conflicts',
      icon: AlertTriangle,
      badge: conflictCount > 0 ? conflictCount : null,
      badgeClass: 'bg-red-600 text-white animate-pulse',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-[64px] max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
                isActive
                  ? 'text-aid-primary font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-aid-primary rounded-full" />
              )}

              {/* Icon with optional badge */}
              <div className="relative">
                <Icon className={emergencyMode ? 'w-6 h-6' : 'w-5 h-5'} aria-hidden="true" />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2.5 px-1.5 py-0.2 rounded-full text-[10px] font-black leading-tight border border-white dark:border-slate-900 shadow-sm ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] sm:text-[11px] mt-1 truncate max-w-[64px] ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
