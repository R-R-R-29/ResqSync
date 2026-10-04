import React from 'react';
import {
  Search,
  X,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
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
      count: counts.total || 0,
      activeClass: 'bg-ink text-white border-ink shadow-sm',
    },
    {
      id: 'immediate',
      label: 'RED • Critical',
      count: counts.immediate || 0,
      activeClass: 'bg-coral text-white border-coral shadow-sm',
    },
    {
      id: 'delayed',
      label: 'YELLOW • Urgent',
      count: counts.delayed || 0,
      activeClass: 'bg-[#E5A33D] text-white border-[#E5A33D] shadow-sm',
    },
    {
      id: 'minor',
      label: 'GREEN • Minor',
      count: counts.minor || 0,
      activeClass: 'bg-[#4F9D69] text-white border-[#4F9D69] shadow-sm',
    },
    {
      id: 'unsynced',
      label: '⚡ Unsynced',
      count: counts.unsynced || 0,
      activeClass: 'bg-[#E5A33D] text-white border-[#E5A33D] shadow-sm',
    },
  ];

  return (
    <div className={`space-y-3.5 ${className}`}>
      
      {/* ── Search Bar (Pill Shaped Input) ── */}
      <div className="relative">
        <label htmlFor="casualty-search" className="sr-only">
          Search casualties by name, ID, sector, or team
        </label>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          id="casualty-search"
          type="search"
          placeholder="Search by ID (e.g. RSQ-1042), Name, Zone, or Notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full bg-white border border-outline rounded-full pl-11 pr-10 text-ink placeholder-ink-light focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light shadow-soft transition ${
            emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 rounded-full hover:bg-surface-secondary"
            title="Clear search query"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Filter Chips (Pill Shaped) ── */}
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
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all flex items-center space-x-1.5 shadow-soft ${
                isActive
                  ? chip.activeClass
                  : 'bg-white text-ink-secondary border-outline hover:border-coral/50 hover:text-ink'
              }`}
              aria-pressed={isActive}
            >
              <span>{chip.label}</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-secondary text-ink-secondary'
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
