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
 * Mobile Navigation (< 768px) per reference mobile app design:
 * - Crisp white surface with subtle top border
 * - Active coral state with pill indicator
 * - Muted inactive state
 * - Clean badges for unsynced and conflict records
 */
export function BottomNav({
  activeTab = 'dashboard',
  onSelectTab,
  conflictCount = 0,
  unsyncedCount = 0,
  emergencyMode = false,
}) {
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: Home },
    {
      id: 'records',
      label: 'Casualties',
      icon: Users,
      badge: unsyncedCount > 0 ? unsyncedCount : null,
      badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    },
    { id: 'map', label: 'Map', icon: MapPin },
    {
      id: 'conflicts',
      label: 'Conflicts',
      icon: AlertTriangle,
      badge: conflictCount > 0 ? conflictCount : null,
      badgeClass: 'bg-[#FDE3DF] text-[#C94336] border-[#FBCBC4] animate-pulse',
    },
    { id: 'settings', label: 'More', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-outline shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-[64px] max-w-lg mx-auto px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
                isActive
                  ? 'text-coral font-bold'
                  : 'text-ink-muted hover:text-ink font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Pill */}
              {isActive && (
                <span className="absolute top-1.5 w-6 h-1 bg-coral rounded-full" />
              )}

              {/* Icon with optional badge */}
              <div className="relative mt-1">
                <Icon className={emergencyMode ? 'w-6 h-6' : 'w-5 h-5'} aria-hidden="true" />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold leading-tight border shadow-sm ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-1 truncate max-w-[64px] ${isActive ? 'font-bold text-coral' : 'text-ink-muted'}`}>
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
