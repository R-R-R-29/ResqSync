import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  UserPlus,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';

const TRIAGE_TIERS = [
  {
    id: 'immediate',
    name: 'RED • Immediate',
    subtitle: 'Critical / Life-Threatening',
    icon: AlertCircle,
    activeClasses: 'bg-[#FDE3DF] text-[#C94336] border-[#FBCBC4] ring-2 ring-coral',
    inactiveClasses: 'bg-white text-ink border-outline hover:border-[#FBCBC4]',
    dotClass: 'bg-[#D94343]',
  },
  {
    id: 'delayed',
    name: 'YELLOW • Delayed',
    subtitle: 'Serious / Non-Life-Threatening',
    icon: Clock,
    activeClasses: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] ring-2 ring-[#E5A33D]',
    inactiveClasses: 'bg-white text-ink border-outline hover:border-[#FDE68A]',
    dotClass: 'bg-[#E5A33D]',
  },
  {
    id: 'minor',
    name: 'GREEN • Minor',
    subtitle: 'Walking Wounded / Minimal',
    icon: CheckCircle2,
    activeClasses: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] ring-2 ring-[#4F9D69]',
    inactiveClasses: 'bg-white text-ink border-outline hover:border-[#A7F3D0]',
    dotClass: 'bg-[#4F9D69]',
  },
  {
    id: 'expectant',
    name: 'BLACK • Expectant',
    subtitle: 'Deceased / Non-Survivable',
    icon: Activity,
    activeClasses: 'bg-[#F3F1EF] text-ink border-[#C4BFBA] ring-2 ring-ink',
    inactiveClasses: 'bg-white text-ink border-outline hover:border-[#C4BFBA]',
    dotClass: 'bg-[#171717]',
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
    const randomTag = `RSQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setVictimName(randomTag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = victimName.trim();
    const finalVictimName = trimmedName || `RSQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalLocation = location.trim() || 'Zone A · Building 3';

    setSubmitting(true);
    try {
      const record = {
        victimName: finalVictimName,
        patient_name: finalVictimName,
        tag_number: finalVictimName.startsWith('RSQ-') ? finalVictimName : `T-${Math.floor(1000 + Math.random() * 9000)}`,
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
      className={`bg-white border border-outline rounded-3xl p-5 sm:p-7 shadow-soft transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-[#F3F1EF]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-coral" aria-hidden="true" />
            <span>Casualty Registration</span>
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Offline-first intake. Records are immediately persisted to local IndexedDB.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-surface-secondary text-ink self-start sm:self-auto">
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#4F9D69]" />
              <span>Direct Sync</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-[#E5A33D]" />
              <span>Outbox Queued</span>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* 1. Triage Severity Selector (Soft Tinted Rounded Buttons) */}
        <div>
          <label className="block font-bold text-xs uppercase tracking-wider text-ink-secondary mb-2">
            Triage Status <span className="text-coral">*</span>
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
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    emergencyMode ? 'min-h-[56px]' : 'min-h-[48px]'
                  } ${isSelected ? tier.activeClasses : tier.inactiveClasses}`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${tier.dotClass}`} />
                      <span className="font-bold text-xs tracking-wide">{tier.name}</span>
                    </div>
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </div>
                  <p className="text-[11px] text-ink-muted truncate pl-3.5">
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
                className="font-bold text-xs text-ink"
              >
                Victim Identifier / Name <span className="text-coral">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateId}
                className="text-[11px] font-bold text-coral hover:text-coral-dark flex items-center gap-1 transition"
                title="Generate casualty ID tag"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto ID</span>
              </button>
            </div>
            <input
              id="victim-name-field"
              type="text"
              placeholder="e.g. RSQ-1042 or Marcus Ramirez"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className={`w-full bg-white border border-outline rounded-2xl px-4 text-ink placeholder-ink-light focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light transition ${
                emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
              }`}
            />
          </div>

          {/* Location */}
          <div className="md:col-span-7">
            <label
              htmlFor="location-field"
              className="block font-bold text-xs text-ink mb-1.5"
            >
              Location (Building / Floor / Zone) <span className="text-coral">*</span>
            </label>
            <input
              id="location-field"
              type="text"
              placeholder="e.g. Zone A — Building 3, Floor 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full bg-white border border-outline rounded-2xl px-4 text-ink placeholder-ink-light focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light transition ${
                emergencyMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'
              }`}
            />
          </div>
        </div>

        {/* 3. Clinical & Medical Notes */}
        <div>
          <label
            htmlFor="notes-field"
            className="block font-bold text-xs text-ink mb-1.5"
          >
            Medical Observations & Trauma Notes
          </label>
          <textarea
            id="notes-field"
            rows="2"
            placeholder="e.g. Chest trauma, conscious, splint applied at 14:20..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            className="w-full bg-white border border-outline rounded-2xl p-3.5 text-sm text-ink placeholder-ink-light focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral-light transition resize-none"
          />
        </div>

        {/* 4. Action & Success Indicator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {successToast ? (
            <div className="flex items-center space-x-2 text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2.5 rounded-full animate-in fade-in">
              <Check className="w-4 h-4 text-[#4F9D69]" />
              <span>
                Registered <strong>{successToast.name}</strong> [{successToast.level}] — {successToast.online ? 'Synced to Command' : 'Saved Locally in Outbox'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-ink-muted font-medium">
              Offline-ready: safely saved even if connection drops.
            </span>
          )}

          <UX4GButton
            type="submit"
            variant="primary"
            size={emergencyMode ? 'lg' : 'md'}
            icon={UserPlus}
            disabled={submitting}
            emergencyMode={emergencyMode}
            className="w-full sm:w-auto shadow-sm"
          >
            {submitting ? 'Registering...' : '+ Register Casualty'}
          </UX4GButton>
        </div>

      </form>
    </div>
  );
}

export default QuickAddForm;
