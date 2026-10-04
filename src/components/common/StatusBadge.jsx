import React from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  Zap,
  Check,
  AlertTriangle,
} from 'lucide-react';

/**
 * Multi-Sensory Triage Status Badges (UX4G Standard: Never Color Alone)
 * Always combines Color + Icon + Explicit Text.
 */
export function StatusBadge({
  type = 'triage', // 'triage' | 'sync'
  level = 'immediate', // 'immediate' | 'delayed' | 'minor' | 'expectant'
  synced = true,
  isConflict = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  if (type === 'sync') {
    if (isConflict) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-700 ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>Conflict Alert</span>
        </span>
      );
    }

    if (!synced) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700 ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" aria-hidden="true" />
          <span>⚡ Saved on this device</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700 ${
          size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        } ${className}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <span>✓ Synced</span>
      </span>
    );
  }

  // Triage badge mapping
  const normalizedLevel = (level || 'immediate').toLowerCase();

  const configs = {
    immediate: {
      label: '🔴 RED - Immediate',
      shortLabel: '🔴 Immediate',
      icon: AlertCircle,
      bg: 'bg-red-600 text-white border-red-700 shadow-sm',
      softBg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
    },
    delayed: {
      label: '🟡 YELLOW - Delayed',
      shortLabel: '🟡 Delayed',
      icon: Clock,
      bg: 'bg-amber-600 text-white border-amber-700 shadow-sm',
      softBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    },
    minor: {
      label: '🟢 GREEN - Minor',
      shortLabel: '🟢 Minor',
      icon: CheckCircle2,
      bg: 'bg-emerald-600 text-white border-emerald-700 shadow-sm',
      softBg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    },
    expectant: {
      label: '⬛ BLACK - Expectant',
      shortLabel: '⬛ Expectant',
      icon: Activity,
      bg: 'bg-slate-700 text-white border-slate-800 shadow-sm',
      softBg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
  };

  const current = configs[normalizedLevel] || configs.immediate;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-black uppercase rounded-lg border tracking-wide transition-all ${
        current.bg
      } ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'} ${className}`}
      title={current.label}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      <span>{size === 'sm' ? current.shortLabel : current.label}</span>
    </span>
  );
}

export default StatusBadge;
