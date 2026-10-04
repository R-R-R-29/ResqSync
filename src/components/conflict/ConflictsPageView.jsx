import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ShieldCheck,
  Zap,
  ArrowRight,
  Server,
  Smartphone,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';

export function ConflictsPageView({
  conflicts = [],
  onSelectConflict,
  onInjectConflict,
  emergencyMode = false,
}) {
  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      
      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-aid-primary" aria-hidden="true" />
            <span>Human-Readable 3-Way Conflict Resolver</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zero data loss reconciliation. Review and synthesize concurrent offline modifications.
          </p>
        </div>

        {onInjectConflict && (
          <UX4GButton
            variant="outline"
            size="sm"
            icon={Zap}
            onClick={onInjectConflict}
          >
            Inject Demo Conflict
          </UX4GButton>
        )}
      </div>

      {/* ── Conflict List or Clean State ── */}
      {conflicts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            All Field Records Reconciled & In-Sync
          </h3>

          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no multi-device synchronization discrepancies. All casualties match authoritative central command records.
          </p>

          {onInjectConflict && (
            <div className="pt-2">
              <UX4GButton
                variant="primary"
                size={emergencyMode ? 'lg' : 'md'}
                icon={Zap}
                onClick={onInjectConflict}
                emergencyMode={emergencyMode}
              >
                Simulate Dual-Device Conflict
              </UX4GButton>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict, idx) => {
            const server = conflict.serverRecord || {};
            const client = conflict.clientPayload || {};
            const victimName = server.victimName || client.victimName || `Victim #${server.id?.slice(0, 6) || idx + 1}`;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border-2 border-red-500/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                      ⚠️ CRITICAL CONFLICT #{idx + 1}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                      Conflict Alert: {victimName} was updated by Team Alpha and Team Beta independently while offline.
                    </h3>
                  </div>

                  <UX4GButton
                    variant="primary"
                    size="sm"
                    icon={GitMerge}
                    onClick={() => onSelectConflict(conflict)}
                  >
                    Open 3-Way Resolver
                  </UX4GButton>
                </div>

                {/* Quick Side-by-side snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-aid-primary" />
                      <span>Team Alpha (Local)</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white uppercase">
                      Triage: {client.triageLevel || 'delayed'}
                    </p>
                    <p className="text-slate-500 mt-1 line-clamp-2">
                      {client.statusNotes || 'Initial assessment'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <Server className="w-3.5 h-3.5 text-red-500" />
                      <span>Team Beta (Remote Override)</span>
                    </div>
                    <p className="font-bold text-red-600 uppercase">
                      Triage: {server.triageLevel || 'immediate'}
                    </p>
                    <p className="text-slate-500 mt-1 line-clamp-2">
                      {server.statusNotes || 'Updated condition'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default ConflictsPageView;
