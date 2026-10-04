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
    <div className={`p-3 rounded-xl border transition-colors ${
      isDifferent
        ? 'bg-amber-50/70 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700/60'
        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </span>
        {isDifferent && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
            Discrepancy
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Value A */}
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{labelA}:</span>
          {customRenderer ? customRenderer(valueA, 'A') : (
            <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{valueA || '—'}</p>
          )}
        </div>

        {/* Value B */}
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{labelB}:</span>
          {customRenderer ? customRenderer(valueB, 'B') : (
            <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">{valueB || '—'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiffField;
