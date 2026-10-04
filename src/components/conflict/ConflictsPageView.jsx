import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  GitMerge,
  Zap,
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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-outline shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
            Data Integrity Center
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-coral" aria-hidden="true" />
            <span>Conflict Resolution Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Human-centered 3-way reconciliation. Reconcile concurrent offline field modifications.
          </p>
        </div>

        {onInjectConflict && (
          <UX4GButton
            variant="outline"
            size="sm"
            icon={Zap}
            onClick={onInjectConflict}
          >
            Simulate Conflict
          </UX4GButton>
        )}
      </div>

      {/* ── Conflict List or Clean State ── */}
      {conflicts.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-outline rounded-3xl shadow-soft space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-soft">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-ink">
            All Field Records Reconciled & In-Sync
          </h3>

          <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
            There are currently no multi-device synchronization discrepancies. All casualty records match central command.
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
            const victimName = server.victimName || client.victimName || `RSQ-${server.id?.slice(0, 4) || idx + 1}`;

            return (
              <div
                key={idx}
                className="bg-white border-2 border-coral rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-soft-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#F3F1EF]">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#FDE3DF] text-[#C94336] border border-[#FBCBC4]">
                      ⚠️ Conflict Detected #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-ink mt-2">
                      Two responders updated {victimName} differently while offline.
                    </h3>
                  </div>

                  <UX4GButton
                    variant="primary"
                    size="sm"
                    icon={GitMerge}
                    onClick={() => onSelectConflict(conflict)}
                  >
                    Resolve Conflict
                  </UX4GButton>
                </div>

                {/* Quick Side-by-side snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
                    <div className="flex items-center space-x-1.5 font-bold text-ink mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-coral" />
                      <span>Team Alpha (Local)</span>
                    </div>
                    <p className="font-bold text-ink uppercase">
                      Triage: {client.triageLevel || 'delayed'}
                    </p>
                    <p className="text-ink-secondary mt-1 line-clamp-2">
                      {client.statusNotes || 'Initial assessment'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
                    <div className="flex items-center space-x-1.5 font-bold text-ink mb-1">
                      <Server className="w-3.5 h-3.5 text-coral" />
                      <span>Team Beta (Remote Override)</span>
                    </div>
                    <p className="font-bold text-coral uppercase">
                      Triage: {server.triageLevel || 'immediate'}
                    </p>
                    <p className="text-ink-secondary mt-1 line-clamp-2">
                      {server.statusNotes || 'Updated field condition'}
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
