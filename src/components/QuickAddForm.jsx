import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  Skull,
  UserPlus,
  MapPin,
  FileText,
  Tag,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';

const TRIAGE_OPTIONS = [
  {
    id: 'immediate',
    name: 'RED',
    subtitle: 'Immediate Triage',
    desc: 'Critical / Life-threatening',
    icon: AlertOctagon,
    activeClasses: 'bg-red-950/80 border-red-500 text-white shadow-emergency-glow ring-2 ring-red-500/80',
    inactiveClasses: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-red-600/60 hover:bg-slate-800/80',
    badge: 'bg-red-500 text-white',
    dot: 'bg-red-500',
  },
  {
    id: 'delayed',
    name: 'YELLOW',
    subtitle: 'Delayed Triage',
    desc: 'Serious / Non-life-threatening',
    icon: Clock,
    activeClasses: 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-warning-glow ring-2 ring-amber-500/80',
    inactiveClasses: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-amber-600/60 hover:bg-slate-800/80',
    badge: 'bg-amber-500 text-slate-950',
    dot: 'bg-amber-500',
  },
  {
    id: 'minor',
    name: 'GREEN',
    subtitle: 'Minor Triage',
    desc: 'Walking wounded / Minimal',
    icon: CheckCircle2,
    activeClasses: 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-stable-glow ring-2 ring-emerald-500/80',
    inactiveClasses: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-600/60 hover:bg-slate-800/80',
    badge: 'bg-emerald-500 text-white',
    dot: 'bg-emerald-500',
  },
  {
    id: 'expectant',
    name: 'BLACK',
    subtitle: 'Expectant Triage',
    desc: 'Deceased or non-survivable',
    icon: Skull,
    activeClasses: 'bg-slate-800 border-slate-400 text-slate-100 ring-2 ring-slate-400/80 shadow-md',
    inactiveClasses: 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/80',
    badge: 'bg-slate-600 text-slate-200',
    dot: 'bg-slate-500',
  },
];

export function QuickAddForm({ onSubmit, isOnline = true }) {
  const [victimName, setVictimName] = useState('');
  const [location, setLocation] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [triageLevel, setTriageLevel] = useState('immediate');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(null);

  const handleGenerateId = () => {
    const randomTag = `VIC-${Math.floor(1000 + Math.random() * 9000)}`;
    setVictimName(randomTag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = victimName.trim();
    const finalVictimName = trimmedName || `VIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalLocation = location.trim() || 'Sector 4 - Incident Area';

    setSubmitting(true);
    try {
      const record = {
        victimName: finalVictimName,
        patient_name: finalVictimName,
        tag_number: finalVictimName.startsWith('VIC-') ? finalVictimName : `T-${Math.floor(1000 + Math.random() * 9000)}`,
        location: finalLocation,
        field_unit_id: finalLocation,
        statusNotes: statusNotes.trim(),
        injuries: statusNotes.trim(),
        triageLevel,
        triage_category: triageLevel,
      };

      if (onSubmit) {
        await onSubmit(record);
      }

      // Show temporary confirmation
      setSuccessNotice({
        name: finalVictimName,
        level: triageLevel.toUpperCase(),
        online: isOnline,
      });

      // Reset form
      setVictimName('');
      setLocation('');
      setStatusNotes('');
      setTriageLevel('immediate');

      setTimeout(() => {
        setSuccessNotice(null);
      }, 4000);
    } catch (err) {
      console.error('[QuickAddForm] Failed to submit victim record:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur relative overflow-hidden">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-resq-immediate">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Rapid Victim Intake
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                START Protocol
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Offline-first data intake. Records are immediately committed to local IndexedDB.
            </p>
          </div>
        </div>

        {/* Sync Mode Indicator */}
        <div className="flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 self-start sm:self-auto">
          {isOnline ? (
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Server Push</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-amber-400">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Outbox Local Queue</span>
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Triage Level Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Triage Assessment Level <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TRIAGE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = triageLevel === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  id={`triage-select-${option.id}`}
                  onClick={() => setTriageLevel(option.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-150 relative ${
                    isSelected ? option.activeClasses : option.inactiveClasses
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${option.badge}`}>
                      {option.name}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-white">{option.subtitle}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{option.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Victim Name / ID */}
          <div className="md:col-span-5">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="victim-name-input" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Victim Name / Identifier</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateId}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono transition"
                title="Generate anonymous victim code"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate ID</span>
              </button>
            </div>
            <input
              id="victim-name-input"
              type="text"
              placeholder="e.g. Elena Vance or VIC-7402"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>

          {/* Location */}
          <div className="md:col-span-7">
            <label htmlFor="location-input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location / Field Sector</span>
            </label>
            <input
              id="location-input"
              type="text"
              placeholder="e.g. Sector 4 - Stairwell B, East Tower"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>
        </div>

        {/* Row 3: Status Notes */}
        <div>
          <label htmlFor="status-notes-input" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Clinical Status & Field Notes</span>
          </label>
          <textarea
            id="status-notes-input"
            rows="2"
            placeholder="e.g. Airway cleared, heavy bleeding controlled by tourniquet, pulse 110 bpm, responsive to verbal stimuli..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none"
          />
        </div>

        {/* Row 4: Action & Feedback */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {successNotice ? (
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/80 px-3.5 py-2 rounded-xl animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                Recorded <strong>{successNotice.name}</strong> as [{successNotice.level}] — {successNotice.online ? 'Synced to Command' : '⚡ Queued Locally in Outbox'}
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-mono">
              Press Enter or click Submit to commit to local IndexedDB
            </div>
          )}

          <button
            id="quick-add-submit-btn"
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-emergency-glow transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Recording...' : 'Commit Victim Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuickAddForm;
