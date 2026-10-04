import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  UserPlus,
  MapPin,
  FileText,
  Tag,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';
import { InputGroup } from '../common/InputGroup';

const TRIAGE_TIERS = [
  {
    id: 'immediate',
    name: '🔴 RED - Immediate',
    subtitle: 'Critical / Life-Threatening',
    icon: AlertCircle,
    activeClasses: 'bg-red-600 text-white border-red-700 shadow-emergency-glow ring-2 ring-red-400',
    inactiveClasses: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-red-400',
  },
  {
    id: 'delayed',
    name: '🟡 YELLOW - Delayed',
    subtitle: 'Serious / Non-Life-Threatening',
    icon: Clock,
    activeClasses: 'bg-amber-600 text-white border-amber-700 shadow-warning-glow ring-2 ring-amber-400',
    inactiveClasses: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-400',
  },
  {
    id: 'minor',
    name: '🟢 GREEN - Minor',
    subtitle: 'Walking Wounded / Minimal',
    icon: CheckCircle2,
    activeClasses: 'bg-emerald-600 text-white border-emerald-700 shadow-stable-glow ring-2 ring-emerald-400',
    inactiveClasses: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-400',
  },
  {
    id: 'expectant',
    name: '⬛ BLACK - Expectant',
    subtitle: 'Deceased / Non-Survivable',
    icon: Activity,
    activeClasses: 'bg-slate-800 text-white border-slate-900 ring-2 ring-slate-400',
    inactiveClasses: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-500',
  },
];

export function QuickAddForm({
  onSubmit,
  isOnline = true,
  emergencyMode = false,
  className = '',
}) {
  const [victimName, setVictimName] = useState('');
  const [location, setLocation] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [triageLevel, setTriageLevel] = useState('immediate');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  const handleGenerateId = () => {
    const randomTag = `VIC-${Math.floor(100 + Math.random() * 900)}`;
    setVictimName(randomTag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = victimName.trim();
    const finalVictimName = trimmedName || `VIC-${Math.floor(100 + Math.random() * 900)}`;
    const finalLocation = location.trim() || 'Building B · Floor 2';

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

      setSuccessToast({
        name: finalVictimName,
        level: triageLevel.toUpperCase(),
        online: isOnline,
      });

      // Clear form
      setVictimName('');
      setLocation('');
      setStatusNotes('');
      setTriageLevel('immediate');

      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('[QuickAddForm] Failed to register casualty:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-aid-primary" aria-hidden="true" />
            <span>Quick Casualty Registration</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Offline-first triage entry. Changes immediately commit to local IndexedDB.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Direct Sync Ready</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Queued in Offline Outbox</span>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* 1. Triage Severity Selector (Large Accessible Buttons) */}
        <div>
          <label className="block font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Triage Severity Classification <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TRIAGE_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = triageLevel === tier.id;

              return (
                <button
                  key={tier.id}
                  type="button"
                  id={`triage-btn-${tier.id}`}
                  onClick={() => setTriageLevel(tier.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    emergencyMode ? 'min-h-[56px]' : 'min-h-[48px]'
                  } ${isSelected ? tier.activeClasses : tier.inactiveClasses}`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs tracking-wide">{tier.name}</span>
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </div>
                  <p className={`text-[11px] truncate ${isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                    {tier.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grouped Input Fields (Labels Strictly Above) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1">
          {/* Victim ID */}
          <div className="md:col-span-5">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="victim-name-field"
                className="font-bold text-xs text-slate-700 dark:text-slate-300"
              >
                Victim Identifier / Name <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateId}
                className="text-[11px] font-bold text-aid-primary hover:text-aid-hover flex items-center gap-1 transition"
                title="Generate anonymous casualty tag"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Tag</span>
              </button>
            </div>
            <input
              id="victim-name-field"
              type="text"
              placeholder="e.g. Victim #104 or Elena Vance"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-aid-primary focus:ring-2 focus:ring-aid-primary/20 transition ${
                emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
              }`}
            />
          </div>

          {/* Location */}
          <div className="md:col-span-7">
            <label
              htmlFor="location-field"
              className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Current Location (Building / Floor / Sector) <span className="text-red-500">*</span>
            </label>
            <input
              id="location-field"
              type="text"
              placeholder="e.g. Building B · Floor 2 · Stairwell A"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-aid-primary focus:ring-2 focus:ring-aid-primary/20 transition ${
                emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
              }`}
            />
          </div>
        </div>

        {/* 3. Clinical & Trauma Notes */}
        <div>
          <label
            htmlFor="notes-field"
            className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Clinical Status & Trauma Notes
          </label>
          <textarea
            id="notes-field"
            rows="2"
            placeholder="e.g. Severe compound femur fracture, tourniquet placed at 14:20, conscious and breathing at 24/min..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-aid-primary focus:ring-2 focus:ring-aid-primary/20 transition resize-none"
          />
        </div>

        {/* 4. Action & Success Indicator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {successToast ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 px-3.5 py-2 rounded-xl animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Registered <strong>{successToast.name}</strong> [{successToast.level}] — {successToast.online ? 'Synced to Central Command' : '⚡ Saved Locally in Outbox'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              Accessible offline: mutations will safely queue if disconnected.
            </span>
          )}

          <UX4GButton
            type="submit"
            variant="primary"
            size={emergencyMode ? 'lg' : 'md'}
            icon={UserPlus}
            disabled={submitting}
            emergencyMode={emergencyMode}
            className="w-full sm:w-auto shadow-aid-raised"
          >
            {submitting ? 'Registering...' : '+ Register Casualty (Offline Ready)'}
          </UX4GButton>
        </div>

      </form>
    </div>
  );
}

export default QuickAddForm;
