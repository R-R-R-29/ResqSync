import React from 'react';
import {
  AlertCircle,
  Truck,
  Zap,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Radio,
  Plus,
} from 'lucide-react';
import { QuickAddForm } from '../triage/QuickAddForm';
import { TriageCard } from '../triage/TriageCard';
import { UX4GButton } from '../common/UX4GButton';
import { useTranslation } from '../../i18n/LanguageContext';

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
  const { t } = useTranslation();

  // 4 Rounded Metric Cards per reference aesthetic: large numbers, concise labels
  const METRICS = [
    {
      id: 'critical',
      title: t('metricCriticalTitle', 'Critical casualties'),
      value: counts.immediate || 0,
      subtitle: t('metricCriticalSub', 'Immediate medical priority'),
      icon: AlertCircle,
      iconBg: 'bg-[#FDE3DF] text-[#C94336]',
      borderColor: 'border-[#E6E1DD] hover:border-[#FBCBC4]',
    },
    {
      id: 'evacuation',
      title: t('metricEvacTitle', 'Waiting for evacuation'),
      value: counts.delayed || 0,
      subtitle: t('metricEvacSub', 'Ambulance & transport'),
      icon: Truck,
      iconBg: 'bg-[#FEF3C7] text-[#92400E]',
      borderColor: 'border-[#E6E1DD] hover:border-[#FDE68A]',
    },
    {
      id: 'offline',
      title: t('metricOfflineTitle', 'Saved offline on device'),
      value: pendingCount,
      subtitle: t('metricOfflineSub', 'Awaiting network sync'),
      icon: Zap,
      iconBg: 'bg-[#F3F1EF] text-[#66615D]',
      borderColor: 'border-[#E6E1DD]',
    },
    {
      id: 'conflicts',
      title: t('metricConflictTitle', 'Conflicts requiring review'),
      value: conflictCount,
      subtitle: conflictCount > 0 ? t('metricConflictSubActive', 'Concurrent edits detected') : t('metricConflictSubNone', 'All field edits reconciled'),
      icon: AlertTriangle,
      iconBg: conflictCount > 0 ? 'bg-[#FDE3DF] text-[#C94336] animate-pulse' : 'bg-[#ECFDF5] text-[#065F46]',
      borderColor: conflictCount > 0 ? 'border-[#FBCBC4] ring-2 ring-[#FDE3DF]' : 'border-[#E6E1DD]',
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
      
      {/* ── 1. Greeting & Context Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
            NDRF & Health Mission • Wayanad Relief Sector
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {t('logbookTitle', 'Field Officer Logbook')}
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            {t('logbookSub', 'Offline triage desk. Records save to this handset and auto-upload when cellular or base Wi-Fi connects.')}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isOnline ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#4F9D69]' : 'bg-[#E5A33D]'}`} />
            <span>{isOnline ? t('baseLinked', 'Base Station Linked') : t('offlineMode', 'Offline Mode Active')}</span>
          </span>
        </div>
      </div>

      {/* ── 2. Prominent Emergency Card ── */}
      <div className="bg-coral text-white rounded-3xl p-5 sm:p-7 shadow-aid-raised relative overflow-hidden">
        {/* Soft decorative background rings */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('startTriageDesk', 'START Triage Desk')}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {t('heroCardTitle', 'Immediate Casualty Registration & Tagging')}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
              {t('heroCardDesc', 'Tag arriving casualties with standard color codes right on the field. Records are preserved on this device even without network and sync to Kalpetta hospital as soon as connected.')}
            </p>
          </div>

          {/* Quick Emergency Mode Glove Switch */}
          <div className="bg-white/15 border border-white/25 rounded-2xl p-3.5 backdrop-blur-sm self-start md:self-auto flex items-center justify-between gap-4 min-w-[210px]">
            <div>
              <span className="font-extrabold text-xs block text-white">{t('gloveMode', 'Glove Mode')}</span>
              <span className="text-[11px] text-white/80">{t('gloveModeSub', '56px touch buttons')}</span>
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
                  emergencyMode ? 'translate-x-6 bg-coral' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Rounded Summary Cards (4 Large Number Cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.id}
              onClick={metric.onClick}
              className={`p-5 rounded-3xl bg-white border ${metric.borderColor} shadow-soft flex flex-col justify-between transition-all ${
                metric.onClick ? 'cursor-pointer hover:shadow-soft-md active:scale-98' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold text-ink-secondary">{metric.title}</span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${metric.iconBg}`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-black text-ink tracking-tight block">
                  {metric.value}
                </span>
                <span className="text-xs text-ink-muted mt-1 block">
                  {metric.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Quick Casualty Registration Form ── */}
      <section aria-labelledby="quick-intake-heading">
        <QuickAddForm
          onSubmit={onAddTriage}
          isOnline={isOnline}
          emergencyMode={emergencyMode}
        />
      </section>

      {/* ── 5. Urgent Field Casualties Preview ── */}
      {urgentRecords.length > 0 && (
        <section className="space-y-3.5" aria-labelledby="urgent-casualties-heading">
          <div className="flex items-center justify-between">
            <h2 id="urgent-casualties-heading" className="text-base font-bold text-ink flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-coral" />
              <span>{t('urgentHeading', 'Priority Critical Casualties • Wayanad Sector')}</span>
            </h2>

            {onNavigateToRecords && (
              <button
                onClick={onNavigateToRecords}
                className="text-xs font-bold text-coral hover:text-coral-dark flex items-center gap-1 min-h-[36px]"
              >
                <span>{t('viewAllManifest', 'View All Manifest')} ({records.length})</span>
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
