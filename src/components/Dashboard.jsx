import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Zap,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Skull,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TriageCard } from './TriageCard';
import { QuickAddForm } from './QuickAddForm';

export function Dashboard({
  records = [],
  loading = false,
  onAddTriage,
  onUpdateTriage,
  onDeleteTriage,
  isOnline = true,
  pendingCount = 0,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(true);

  // Compute category counts for tab badges
  const counts = useMemo(() => {
    const res = {
      all: records.length,
      red: 0,
      yellow: 0,
      green: 0,
      black: 0,
      queued: 0,
    };

    for (const r of records) {
      const level = (r.triageLevel || r.triage_category || '').toLowerCase();
      if (level === 'immediate' || level === 'red') res.red++;
      else if (level === 'delayed' || level === 'yellow') res.yellow++;
      else if (level === 'minor' || level === 'green') res.green++;
      else if (level === 'expectant' || level === 'black') res.black++;

      const isQueued =
        r.syncState?.startsWith('PENDING') ||
        r._synced === 0 ||
        r.syncState === 'PENDING_CREATE' ||
        r.syncState === 'PENDING_UPDATE' ||
        r.syncState === 'PENDING_DELETE';

      if (isQueued) res.queued++;
    }

    return res;
  }, [records]);

  // Tab definitions per Prompt 5 spec: All, Red, Yellow, Green, Queued Offline
  const TABS = [
    {
      id: 'all',
      label: 'All',
      count: counts.all,
      icon: Layers,
      color: 'hover:text-white',
      activeClass: 'bg-slate-800 text-white border-slate-600 shadow-sm',
    },
    {
      id: 'red',
      label: 'Red',
      subtitle: 'Immediate',
      count: counts.red,
      icon: AlertOctagon,
      color: 'hover:text-red-400',
      activeClass: 'bg-red-950/80 text-red-200 border-red-500 shadow-emergency-glow',
    },
    {
      id: 'yellow',
      label: 'Yellow',
      subtitle: 'Delayed',
      count: counts.yellow,
      icon: Clock,
      color: 'hover:text-amber-400',
      activeClass: 'bg-amber-950/80 text-amber-200 border-amber-500 shadow-warning-glow',
    },
    {
      id: 'green',
      label: 'Green',
      subtitle: 'Minor',
      count: counts.green,
      icon: CheckCircle2,
      color: 'hover:text-emerald-400',
      activeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-500 shadow-stable-glow',
    },
    {
      id: 'queued',
      label: 'Queued Offline',
      count: counts.queued,
      icon: Zap,
      color: 'hover:text-amber-300',
      activeClass: 'bg-amber-950/90 text-amber-200 border-amber-500 shadow-warning-glow',
    },
    {
      id: 'black',
      label: 'Black',
      subtitle: 'Expectant',
      count: counts.black,
      icon: Skull,
      color: 'hover:text-slate-300',
      activeClass: 'bg-slate-800 text-slate-200 border-slate-500',
    },
  ];

  // Filtering and live search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const level = (r.triageLevel || r.triage_category || '').toLowerCase();
      const isQueued =
        r.syncState?.startsWith('PENDING') ||
        r._synced === 0 ||
        r.syncState === 'PENDING_CREATE' ||
        r.syncState === 'PENDING_UPDATE' ||
        r.syncState === 'PENDING_DELETE';

      // Tab filter
      if (activeTab === 'red' && level !== 'immediate' && level !== 'red') return false;
      if (activeTab === 'yellow' && level !== 'delayed' && level !== 'yellow') return false;
      if (activeTab === 'green' && level !== 'minor' && level !== 'green') return false;
      if (activeTab === 'black' && level !== 'expectant' && level !== 'black') return false;
      if (activeTab === 'queued' && !isQueued) return false;

      // Search query filter (by name or location or tag)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (r.victimName || r.patient_name || '').toLowerCase().includes(query);
        const locMatch = (r.location || r.field_unit_id || '').toLowerCase().includes(query);
        const tagMatch = (r.tag_number || r.id || '').toLowerCase().includes(query);
        const notesMatch = (r.statusNotes || r.injuries || '').toLowerCase().includes(query);
        return nameMatch || locMatch || tagMatch || notesMatch;
      }

      return true;
    });
  }, [records, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* ── TOP SECTION: Quick Add Form with Expand/Collapse ── */}
      <section className="transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Field Intake Portal
          </span>
          <button
            onClick={() => setIsQuickAddExpanded((v) => !v)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 transition"
          >
            {isQuickAddExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Collapse Form</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Expand Intake Form</span>
              </>
            )}
          </button>
        </div>

        {isQuickAddExpanded && (
          <QuickAddForm onSubmit={onAddTriage} isOnline={isOnline} />
        )}
      </section>

      {/* ── MIDDLE SECTION: Filter Tabs & Live Search Bar ── */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur space-y-4">
        
        {/* Row 1: Filter Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Triage Category & Queue Filters</span>
            </span>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredRecords.length} of {records.length} total
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all duration-150 ${
                    isActive
                      ? tab.activeClass
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 ' + tab.color
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Live Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="triage-search-input"
            type="text"
            placeholder="Live search by victim name, identifier, sector, or clinical trauma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/90 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* ── BOTTOM SECTION: Responsive Grid of Triage Cards ── */}
      <section>
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-mono text-sm animate-pulse flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading victim database from local IndexedDB...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <Layers className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Patient Records Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              {searchQuery || activeTab !== 'all'
                ? `No records matching "${searchQuery || activeTab}". Try resetting search or selecting "All".`
                : 'No disaster victims have been recorded in this field sector yet.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              {(searchQuery || activeTab !== 'all') && (
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => setIsQuickAddExpanded(true)}
                className="px-4 py-2 rounded-xl bg-resq-immediate hover:bg-red-600 text-white text-xs font-bold shadow-emergency-glow transition flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Intake New Patient</span>
              </button>
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
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Dashboard;
