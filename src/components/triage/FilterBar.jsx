import React from 'react';
import {
  Search,
  X,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Layers,
} from 'lucide-react';

export function FilterBar({
  activeFilter = 'all',
  onSelectFilter,
  searchQuery = '',
  onSearchChange,
  counts = {},
  emergencyMode = false,
  className = '',
}) {
  const CHIPS = [
    {
      id: 'all',
      label: 'All Casualties',
      shortLabel: 'All',
      count: counts.total || 0,
      icon: Layers,
      activeClass: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm',
    },
    {
      id: 'immediate',
      label: '🔴 Critical',
      shortLabel: '🔴 Critical',
      count: counts.immediate || 0,
      icon: AlertCircle,
      activeClass: 'bg-red-600 text-white border-red-700 shadow-emergency-glow',
    },
    {
      id: 'delayed',
      label: '🟡 Urgent',
      shortLabel: '🟡 Urgent',
      count: counts.delayed || 0,
      icon: Clock,
      activeClass: 'bg-amber-600 text-white border-amber-700 shadow-warning-glow',
    },
    {
      id: 'minor',
      label: '🟢 Minor',
      shortLabel: '🟢 Minor',
      count: counts.minor || 0,
      icon: CheckCircle2,
      activeClass: 'bg-emerald-600 text-white border-emerald-700 shadow-stable-glow',
    },
    {
      id: 'unsynced',
      label: '⚡ Unsynced',
      shortLabel: '⚡ Unsynced',
      count: counts.unsynced || 0,
      icon: Zap,
      activeClass: 'bg-amber-500 text-slate-950 border-amber-600 shadow-warning-glow',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      
      {/* ── Search Bar (UX4G Standard) ── */}
      <div className="relative">
        <label htmlFor="casualty-search" className="sr-only">
          Search casualties by name, ID, sector, or team
        </label>
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          id="casualty-search"
          type="search"
          placeholder="Search by Victim ID, Name, Location (e.g. Building B), or Team..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-aid-primary focus:ring-2 focus:ring-aid-primary/20 shadow-sm transition ${
            emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            title="Clear search query"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Filter Chips ── */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        role="group"
        aria-label="Casualty Filter Categories"
      >
        {CHIPS.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              id={`filter-chip-${chip.id}`}
              onClick={() => onSelectFilter(chip.id)}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex items-center space-x-1.5 ${
                isActive
                  ? chip.activeClass
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
              }`}
              aria-pressed={isActive}
            >
              <span>{chip.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-black/20 text-inherit'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default FilterBar;
