import React from 'react';
import {
  AlertCircle,
  Truck,
  Zap,
  AlertTriangle,
  Activity,
  ArrowRight,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { QuickAddForm } from '../triage/QuickAddForm';
import { TriageCard } from '../triage/TriageCard';
import { UX4GButton } from '../common/UX4GButton';

export function DashboardView({
  records = [],
  counts = {},
  pendingCount = 0,
  conflictCount = 0,
  isOnline = true,
  emergencyMode = false,
  setEmergencyMode,
  onAddTriage,
  onUpdateTriage,
  onDeleteTriage,
  onNavigateToRecords,
  onNavigateToConflicts,
}) {
  // 4 Large High-Contrast Summary Widgets per Prompt specification
  const METRICS = [
    {
      id: 'critical',
      title: 'Critical Casualties',
      value: `${counts.immediate || 0} Immediate`,
      subtitle: 'Airway / Hemorrhage Priority',
      icon: AlertCircle,
      cardClass: 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200',
      iconClass: 'bg-red-600 text-white',
      badge: '🔴 TIER 1',
    },
    {
      id: 'evacuation',
      title: 'Pending Evacuation',
      value: `${counts.delayed || 0} In Transit`,
      subtitle: 'Ambulance & Air Transport',
      icon: Truck,
      cardClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
      iconClass: 'bg-amber-600 text-white',
      badge: '🚑 AMBULANCE',
    },
    {
      id: 'offline',
      title: 'Offline Changes',
      value: `${pendingCount} Saved Locally`,
      subtitle: 'IndexedDB Outbox Queue',
      icon: Zap,
      cardClass: 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100',
      iconClass: 'bg-slate-800 text-amber-400',
      badge: '⚡ OUTBOX',
    },
    {
      id: 'conflicts',
      title: 'Unresolved Conflicts',
      value: `${conflictCount} Need Review`,
      subtitle: 'Dual-Device Discrepancies',
      icon: AlertTriangle,
      cardClass: conflictCount > 0
        ? 'bg-red-100 dark:bg-red-900/60 border-red-400 text-red-900 dark:text-red-100 ring-2 ring-red-400'
        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
      iconClass: conflictCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white',
      badge: conflictCount > 0 ? '⚠️ ACTION NEEDED' : '✓ CLEAN',
      onClick: conflictCount > 0 ? onNavigateToConflicts : undefined,
    },
  ];

  // Prioritize recent Immediate or Delayed records
  const urgentRecords = records
    .filter((r) => {
      const lvl = (r.triageLevel || r.triage_category || '').toLowerCase();
      return lvl === 'immediate' || lvl === 'delayed';
    })
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* ── 1. Top Emergency Banner (AidConnect Inspired Terracotta Card) ── */}
      <div className="bg-aid-primary text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle background radar ring */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/20 text-white">
                FIELD OPERATIONAL MODE
              </span>
              <span className="text-white/80 text-xs font-mono">SECTOR 4 QUAKE RESPONSE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              ResqSync Emergency Coordination
            </h1>

            <p className="text-sm text-white/90 font-medium">
              Offline-first disaster triage coordinator aligned with UX4G Indian Emergency Digital Service Standards. Zero data loss in disconnected environments.
            </p>
          </div>

          {/* Emergency Mode Large Switch */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3.5 backdrop-blur-md self-start md:self-auto flex items-center justify-between gap-3 min-w-[220px]">
            <div>
              <span className="font-extrabold text-xs block">Emergency Mode</span>
              <span className="text-[11px] text-white/80">Large 56px touch controls</span>
            </div>

            <button
              onClick={() => setEmergencyMode((v) => !v)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                emergencyMode ? 'bg-white' : 'bg-black/30'
              }`}
              aria-label="Toggle Emergency Glove Mode"
              aria-pressed={emergencyMode}
            >
              <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  emergencyMode ? 'translate-x-6 bg-aid-primary' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Key Metrics Cards (4 Large High-Contrast Widgets) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {METRICS.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.id}
              onClick={metric.onClick}
              className={`p-4 sm:p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                metric.cardClass
              } ${metric.onClick ? 'cursor-pointer hover:shadow-md active:scale-98' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${metric.iconClass}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {metric.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-none mb-1">
                  {metric.value}
                </h3>
                <span className="text-xs font-bold block opacity-90">{metric.title}</span>
                <span className="text-[11px] opacity-75 mt-0.5 block">{metric.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Quick Casualty Registration Form ── */}
      <section aria-labelledby="quick-intake-heading">
        <QuickAddForm
          onSubmit={onAddTriage}
          isOnline={isOnline}
          emergencyMode={emergencyMode}
        />
      </section>

      {/* ── 4. Urgent Field Casualties Preview ── */}
      {urgentRecords.length > 0 && (
        <section className="space-y-3" aria-labelledby="urgent-casualties-heading">
          <div className="flex items-center justify-between">
            <h2 id="urgent-casualties-heading" className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Priority Critical Casualties (Sector 4)</span>
            </h2>

            {onNavigateToRecords && (
              <button
                onClick={onNavigateToRecords}
                className="text-xs font-bold text-aid-primary hover:text-aid-hover flex items-center gap-1 min-h-[36px]"
              >
                <span>View All ({records.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {urgentRecords.map((record) => (
              <TriageCard
                key={record.id}
                record={record}
                onUpdate={onUpdateTriage}
                onDelete={onDeleteTriage}
                emergencyMode={emergencyMode}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default DashboardView;
