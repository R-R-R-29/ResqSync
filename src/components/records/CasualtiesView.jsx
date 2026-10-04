import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Filter,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { FilterBar } from '../triage/FilterBar';
import { TriageCard } from '../triage/TriageCard';
import { UX4GButton } from '../common/UX4GButton';

export function CasualtiesView({
  records = [],
  counts = {},
  loading = false,
  onAddTriage,
  onUpdateTriage,
  onDeleteTriage,
  emergencyMode = false,
  onOpenIntakeModal,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate unsynced count
  const unsyncedCount = useMemo(() => {
    return records.filter((r) => r.syncState?.startsWith('PENDING') || r._synced === 0).length;
  }, [records]);

  const enhancedCounts = {
    ...counts,
    unsynced: unsyncedCount,
  };

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const level = (r.triageLevel || r.triage_category || '').toLowerCase();
      const isUnsynced = r.syncState?.startsWith('PENDING') || r._synced === 0;

      // Filter chip
      if (activeFilter === 'immediate' && level !== 'immediate') return false;
      if (activeFilter === 'delayed' && level !== 'delayed') return false;
      if (activeFilter === 'minor' && level !== 'minor') return false;
      if (activeFilter === 'unsynced' && !isUnsynced) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (r.victimName || r.patient_name || '').toLowerCase().includes(q);
        const locMatch = (r.location || r.field_unit_id || '').toLowerCase().includes(q);
        const tagMatch = (r.tag_number || r.id || '').toLowerCase().includes(q);
        const teamMatch = (r.responderId || '').toLowerCase().includes(q);
        const notesMatch = (r.statusNotes || r.injuries || '').toLowerCase().includes(q);
        return nameMatch || locMatch || tagMatch || teamMatch || notesMatch;
      }

      return true;
    });
  }, [records, activeFilter, searchQuery]);

  return (
    <div className="space-y-5">
      
      {/* ── Header Strip ── */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-aid-primary" aria-hidden="true" />
            <span>Casualties Registry & Field Manifest</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational triage census. Showing {filteredRecords.length} of {records.length} total casualties.
          </p>
        </div>

        {onOpenIntakeModal && (
          <UX4GButton
            variant="primary"
            size={emergencyMode ? 'lg' : 'md'}
            icon={Plus}
            onClick={onOpenIntakeModal}
            emergencyMode={emergencyMode}
          >
            + Register Casualty
          </UX4GButton>
        )}
      </div>

      {/* ── Search & Filter Controls ── */}
      <FilterBar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={enhancedCounts}
        emergencyMode={emergencyMode}
      />

      {/* ── Casualties Cards Grid ── */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-mono text-sm animate-pulse flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-aid-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading local IndexedDB registry...</span>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
            No Casualties Found Matching Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || activeFilter !== 'all'
              ? 'Try resetting your search query or selecting "All Casualties".'
              : 'No casualties registered in this field manifest yet.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            {(searchQuery || activeFilter !== 'all') && (
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Clear Filters
              </button>
            )}
            {onOpenIntakeModal && (
              <UX4GButton
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={onOpenIntakeModal}
              >
                Add Casualty
              </UX4GButton>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <TriageCard
              key={record.id}
              record={record}
              onUpdate={onUpdateTriage}
              onDelete={onDeleteTriage}
              emergencyMode={emergencyMode}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default CasualtiesView;
