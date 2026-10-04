/**
 * ConflictBanner
 *
 * Renders a dismissible banner for each unresolved sync conflict detected by
 * useOfflineSync.  Lets field commanders see exactly what the server and
 * client disagreed on, and dismiss each conflict once resolved.
 */
import React from 'react';
import { AlertTriangle, X, Server, Smartphone } from 'lucide-react';

const TRIAGE_COLORS = {
  immediate: 'text-resq-immediate',
  delayed:   'text-resq-delayed',
  minor:     'text-resq-minor',
  expectant: 'text-slate-300',
};

export function ConflictBanner({ conflicts = [], onDismiss }) {
  if (!conflicts.length) return null;

  return (
    <div className="space-y-2 my-3">
      {conflicts.map((conflict, idx) => {
        const server = conflict.serverRecord ?? {};
        const client = conflict.clientPayload ?? {};
        const serverLevel = server.triageLevel ?? server.triage_category ?? '—';
        const clientLevel = client.triageLevel ?? client.triage_category ?? '—';

        return (
          <div
            key={idx}
            className="flex items-start gap-3 bg-amber-950/60 border border-amber-700/70 rounded-xl p-4 text-sm shadow-warning-glow"
          >
            {/* Icon */}
            <AlertTriangle className="w-5 h-5 text-resq-delayed shrink-0 mt-0.5" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-amber-200 text-xs uppercase tracking-wider mb-1.5">
                Sync Conflict Detected — Record {server.id?.slice(0, 8) ?? '—'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Server version */}
                <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                    <Server className="w-3 h-3" />
                    <span>Command Server (v{server.version ?? '?'})</span>
                  </div>
                  <p className="text-slate-200 font-medium truncate">{server.victimName ?? server.patient_name ?? 'Unknown'}</p>
                  <p className={`text-xs font-bold uppercase ${TRIAGE_COLORS[serverLevel] ?? 'text-slate-300'}`}>
                    {serverLevel}
                  </p>
                  {server.statusNotes && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{server.statusNotes}</p>
                  )}
                </div>

                {/* Client version */}
                <div className="bg-slate-950/60 rounded-lg p-2.5 border border-amber-900/60">
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-amber-400 uppercase font-semibold tracking-wider">
                    <Smartphone className="w-3 h-3" />
                    <span>This Device</span>
                  </div>
                  <p className="text-slate-200 font-medium truncate">{client.victimName ?? client.patient_name ?? 'Unknown'}</p>
                  <p className={`text-xs font-bold uppercase ${TRIAGE_COLORS[clientLevel] ?? 'text-slate-300'}`}>
                    {clientLevel}
                  </p>
                  {client.statusNotes && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{client.statusNotes}</p>
                  )}
                </div>
              </div>

              <p className="mt-2 text-[11px] text-amber-300/70">
                The server record was updated by another device. Review and re-submit if your version is correct.
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => onDismiss(idx)}
              className="shrink-0 p-1 rounded text-amber-400 hover:text-white hover:bg-amber-900/60 transition"
              title="Dismiss conflict"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
