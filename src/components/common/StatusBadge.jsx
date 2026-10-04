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
 * Multi-Sensory Triage Status Badges
 * Aligned with the reference mobile design:
 * - Soft tinted rounded-full pill backgrounds
 * - Small colored indicators & icons
 * - High-contrast text labels (never color alone)
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
          className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-full bg-[#FDE3DF] text-[#C94336] border border-[#FBCBC4] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          } ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#C94336]" aria-hidden="true" />
          <span>Conflict Alert</span>
        </span>
      );
    }

    if (!synced) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          } ${className}`}
        >
          <Zap className="w-3.5 h-3.5 text-[#E5A33D] animate-pulse" aria-hidden="true" />
          <span>Saved Locally</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        } ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-[#4F9D69]" aria-hidden="true" />
        <span>Synced</span>
      </span>
    );
  }

  // Triage badge mapping with soft tinted backgrounds & clean indicators
  const normalizedLevel = (level || 'immediate').toLowerCase();

  const configs = {
    immediate: {
      label: 'RED • Immediate',
      shortLabel: 'RED • Immediate',
      icon: AlertCircle,
      dotClass: 'bg-[#D94343]',
      pillClass: 'bg-[#FDE3DF] text-[#C94336] border border-[#FBCBC4]',
    },
    delayed: {
      label: 'YELLOW • Delayed',
      shortLabel: 'YELLOW • Delayed',
      icon: Clock,
      dotClass: 'bg-[#E5A33D]',
      pillClass: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    },
    minor: {
      label: 'GREEN • Minor',
      shortLabel: 'GREEN • Minor',
      icon: CheckCircle2,
      dotClass: 'bg-[#4F9D69]',
      pillClass: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    },
    expectant: {
      label: 'BLACK • Expectant',
      shortLabel: 'BLACK • Expectant',
      icon: Activity,
      dotClass: 'bg-[#171717]',
      pillClass: 'bg-[#F3F1EF] text-[#171717] border border-[#E6E1DD]',
    },
  };

  const current = configs[normalizedLevel] || configs.immediate;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-full tracking-wide transition-all ${
        current.pillClass
      } ${size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'} ${className}`}
      title={current.label}
    >
      <span className={`w-2 h-2 rounded-full ${current.dotClass}`} aria-hidden="true" />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      <span>{size === 'sm' ? current.shortLabel : current.label}</span>
    </span>
  );
}

export default StatusBadge;
