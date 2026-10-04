import React from 'react';

/**
 * DiffField
 * Visual comparison component for a single attribute.
 * Highlights discrepancies clearly with human-readable styling.
 */
export function DiffField({
  label,
  valueA,
  valueB,
  labelA = 'Team Alpha',
  labelB = 'Team Beta',
  isDifferent = false,
  customRenderer,
}) {
  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      isDifferent
        ? 'bg-[#FFFBEB] border-[#FDE68A]'
        : 'bg-surface-secondary border-outline'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">
          {label}
        </span>
        {isDifferent && (
          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Conflicting Updates
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Value A */}
        <div className="bg-white p-3 rounded-xl border border-outline shadow-soft">
          <span className="text-[11px] font-bold text-ink-muted block mb-1">{labelA}:</span>
          {customRenderer ? customRenderer(valueA, 'A') : (
            <p className="font-semibold text-ink break-words text-sm">{valueA || '—'}</p>
          )}
        </div>

        {/* Value B */}
        <div className="bg-white p-3 rounded-xl border border-outline shadow-soft">
          <span className="text-[11px] font-bold text-coral block mb-1">{labelB}:</span>
          {customRenderer ? customRenderer(valueB, 'B') : (
            <p className="font-semibold text-ink break-words text-sm">{valueB || '—'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiffField;
