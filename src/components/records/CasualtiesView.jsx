import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Layers,
} from 'lucide-react';
import { FilterBar } from '../triage/FilterBar';
import { TriageCard } from '../triage/TriageCard';
import { UX4GButton } from '../common/UX4GButton';
import { useTranslation } from '../../i18n/LanguageContext';

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
  const { t } = useTranslation();
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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-outline shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
            {t('stateReliefCommand', 'Wayanad Casualty Manifest')}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-coral" aria-hidden="true" />
            <span>{t('manifestTitle', 'Casualty Register & Triage Roster')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            {filteredRecords.length} / {records.length} {t('navCasualties', 'casualties logged')}
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
            + {t('casualtyRegistration', 'Register Casualty')}
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
        <div className="text-center py-20 text-ink-muted font-mono text-sm animate-pulse flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-coral border-t-transparent rounded-full animate-spin"></div>
          <span>Loading local IndexedDB registry...</span>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-outline rounded-3xl shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary text-ink-muted flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-ink">
            {t('noCasualtiesFound', 'No Casualties Found')}
          </h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
            {searchQuery || activeFilter !== 'all'
              ? 'Try resetting your search query or selecting "All Casualties".'
              : 'No casualty records registered in this manifest yet.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            {(searchQuery || activeFilter !== 'all') && (
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-full bg-surface-secondary text-xs font-bold text-ink hover:bg-[#EAE6E2] transition"
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
                + {t('casualtyRegistration', 'Add Casualty')}
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
