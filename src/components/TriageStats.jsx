import React from 'react';
import { AlertCircle, Clock, HeartPulse, Skull } from 'lucide-react';

export function TriageStats({ counts, activeFilter, onSelectFilter }) {
  const cards = [
    {
      id: 'immediate',
      label: 'IMMEDIATE',
      sublabel: 'Red Tag • Life Threatening',
      count: counts.immediate,
      icon: AlertCircle,
      borderColor: 'border-resq-immediate',
      bgColor: 'bg-resq-immediate/10',
      textColor: 'text-resq-immediate',
      badgeBg: 'bg-resq-immediate text-white',
      glow: 'hover:shadow-emergency-glow'
    },
    {
      id: 'delayed',
      label: 'DELAYED',
      sublabel: 'Yellow Tag • Serious Condition',
      count: counts.delayed,
      icon: Clock,
      borderColor: 'border-resq-delayed',
      bgColor: 'bg-resq-delayed/10',
      textColor: 'text-resq-delayed',
      badgeBg: 'bg-resq-delayed text-slate-950 font-bold',
      glow: 'hover:shadow-warning-glow'
    },
    {
      id: 'minor',
      label: 'MINOR',
      sublabel: 'Green Tag • Walking Wounded',
      count: counts.minor,
      icon: HeartPulse,
      borderColor: 'border-resq-minor',
      bgColor: 'bg-resq-minor/10',
      textColor: 'text-resq-minor',
      badgeBg: 'bg-resq-minor text-white',
      glow: 'hover:shadow-stable-glow'
    },
    {
      id: 'expectant',
      label: 'EXPECTANT',
      sublabel: 'Black Tag • Deceased / Palliative',
      count: counts.expectant,
      icon: Skull,
      borderColor: 'border-resq-expectant',
      bgColor: 'bg-resq-expectant/20',
      textColor: 'text-slate-300',
      badgeBg: 'bg-resq-expectant text-slate-200',
      glow: 'hover:border-slate-400'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected = activeFilter === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectFilter(isSelected ? null : item.id)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 ${
              item.borderColor
            } ${item.bgColor} ${item.glow} ${
              isSelected ? 'ring-2 ring-white scale-[1.02]' : 'opacity-90 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black tracking-wider uppercase ${item.textColor}`}>
                {item.label}
              </span>
              <Icon className={`w-5 h-5 ${item.textColor}`} />
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">
                {item.count}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${item.badgeBg}`}>
                Triage Tag
              </span>
            </div>

            <p className="mt-1 text-[11px] text-slate-400 truncate">
              {item.sublabel}
            </p>
          </button>
        );
      })}
    </div>
  );
}
