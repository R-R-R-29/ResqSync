import React, { useState } from 'react';
import {
  AlertTriangle,
  GitMerge,
  ShieldAlert,
  Check,
  X,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { UX4GButton } from '../common/UX4GButton';
import { DiffField } from './DiffField';
import { saveLocalRecord, addToOutbox } from '../../db/indexedDB';

export function ConflictResolverModal({
  conflict,
  isOpen = false,
  onClose,
  onResolved,
  emergencyMode = false,
}) {
  if (!isOpen || !conflict) return null;

  const server = conflict.serverRecord || {};
  const client = conflict.clientPayload || {};

  const teamAName = client.responderId || client.deviceId || 'Team Alpha (Local)';
  const teamBName = server.responderId || server.deviceId || 'Team Beta (Tablet-02)';

  const triageA = (client.triageLevel || client.triage_category || 'delayed').toLowerCase();
  const triageB = (server.triageLevel || server.triage_category || 'immediate').toLowerCase();

  // Severity Rule Check: If either side is RED and the other is GREEN, critical downgrade safety guard
  const isRedToGreenSafetyAlert =
    (triageA === 'immediate' && triageB === 'minor') ||
    (triageA === 'minor' && triageB === 'immediate');

  const [safetyConfirmed, setSafetyConfirmed] = useState(!isRedToGreenSafetyAlert);
  const [activeMode, setActiveMode] = useState('decision'); // 'decision' | 'merge_editor'
  const [mergedTriage, setMergedTriage] = useState(triageB); // default to higher severity for safety
  const [mergedNotes, setMergedNotes] = useState(
    `[${teamAName}]: ${client.statusNotes || 'Initial assessment'}\n[${teamBName}]: ${server.statusNotes || 'Updated field status'}`
  );
  const [mergedLocation, setMergedLocation] = useState(server.location || client.location || 'Zone A');
  const [isResolving, setIsResolving] = useState(false);

  // Resolution 1: Keep Team Alpha (Client)
  const handleKeepAlpha = async () => {
    if (isRedToGreenSafetyAlert && !safetyConfirmed) return;
    setIsResolving(true);
    try {
      const now = new Date().toISOString();
      const resolved = {
        ...client,
        version: Math.max(server.version ?? 1, client.version ?? 1) + 1,
        syncState: 'PENDING_UPDATE',
        updatedAt: now,
      };
      await saveLocalRecord(resolved, true);
      await addToOutbox(resolved.id, 'UPDATE', resolved);
      if (onResolved) onResolved(resolved);
      onClose();
    } catch (err) {
      console.error('[ConflictResolver] Failed to keep Team Alpha edit:', err);
    } finally {
      setIsResolving(false);
    }
  };

  // Resolution 2: Keep Team Beta (Server)
  const handleKeepBeta = async () => {
    setIsResolving(true);
    try {
      const canonical = {
        ...server,
        syncState: 'SYNCED',
        updatedAt: new Date().toISOString(),
      };
      await saveLocalRecord(canonical, false);
      if (onResolved) onResolved(canonical);
      onClose();
    } catch (err) {
      console.error('[ConflictResolver] Failed to keep Team Beta edit:', err);
    } finally {
      setIsResolving(false);
    }
  };

  // Resolution 3: Merge & Combine Field Notes
  const handleCommitMerge = async () => {
    if (isRedToGreenSafetyAlert && !safetyConfirmed) return;
    setIsResolving(true);
    try {
      const now = new Date().toISOString();
      const mergedRecord = {
        ...server,
        ...client,
        id: server.id || client.id,
        victimName: client.victimName || server.victimName || 'Casualty',
        location: mergedLocation,
        triageLevel: mergedTriage,
        triage_category: mergedTriage,
        statusNotes: mergedNotes,
        injuries: mergedNotes,
        version: Math.max(server.version ?? 1, client.version ?? 1) + 1,
        syncState: 'PENDING_UPDATE',
        updatedAt: now,
      };
      await saveLocalRecord(mergedRecord, true);
      await addToOutbox(mergedRecord.id, 'UPDATE', mergedRecord);
      if (onResolved) onResolved(mergedRecord);
      onClose();
    } catch (err) {
      console.error('[ConflictResolver] Failed to commit merged record:', err);
    } finally {
      setIsResolving(false);
    }
  };

  const victimId = server.victimName || client.victimName || `RSQ-${server.id?.slice(0, 4) || '1042'}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-3xl bg-white border border-outline rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── 1. Human-Readable Conflict Header ── */}
        <div className="p-5 sm:p-6 bg-coral-light/60 border-b border-coral-light flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-coral text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-white text-coral border border-coral-light">
                  CONFLICT DETECTED
                </span>
                <span className="text-xs font-mono font-bold text-ink-secondary">{victimId}</span>
              </div>
              <h2 id="conflict-modal-title" className="text-base sm:text-lg font-bold text-ink tracking-tight leading-snug">
                Two responders updated this casualty differently while offline.
              </h2>
              <p className="text-xs text-ink-secondary font-medium mt-1 leading-relaxed">
                These updates cannot be safely merged automatically. Review the discrepancies below and select the authoritative medical state.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-white/60 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Safety Guard Alert (Red to Green Downgrade) ── */}
        {isRedToGreenSafetyAlert && (
          <div className="p-4 bg-[#FDE3DF] text-[#C94336] border-b border-[#FBCBC4] flex items-start space-x-3 text-xs font-semibold">
            <AlertOctagon className="w-5 h-5 shrink-0 text-[#D94343]" aria-hidden="true" />
            <div className="flex-1">
              <span className="uppercase tracking-wider font-bold block text-ink">
                CRITICAL MEDICAL SAFETY GUARD:
              </span>
              <span className="text-ink-secondary mt-0.5 block leading-relaxed">
                One responder assessed this casualty as RED (Immediate), while another marked GREEN (Minor). Downgrading triage requires explicit confirmation.
              </span>
              <label className="flex items-center space-x-2.5 mt-2.5 cursor-pointer bg-white p-2 rounded-xl border border-[#FBCBC4]">
                <input
                  type="checkbox"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  className="w-4 h-4 text-coral rounded focus:ring-coral-light"
                />
                <span className="text-xs text-ink font-bold">I confirm this triage decision as an authorized responder.</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Modal Content: Timeline & Side-by-Side Comparison ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* 2. Timeline Sequence */}
          <div className="bg-surface-secondary p-4 rounded-2xl border border-outline">
            <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider block mb-2.5">
              Chronological Sequence
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-outline flex items-center justify-center font-bold text-ink text-xs shadow-soft">
                  1
                </div>
                <div>
                  <span className="font-bold text-ink block">{teamAName}</span>
                  <span className="text-ink-muted text-[11px]">Edited locally at {new Date(client.updatedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-ink-muted hidden sm:block shrink-0" aria-hidden="true" />

              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-coral text-white flex items-center justify-center font-bold text-xs shadow-soft">
                  2
                </div>
                <div>
                  <span className="font-bold text-ink block">{teamBName}</span>
                  <span className="text-ink-muted text-[11px]">Updated remotely at {new Date(server.updatedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Side-by-Side Field Comparison */}
          <div className="space-y-3">
            <DiffField
              label="Triage Status"
              valueA={triageA}
              valueB={triageB}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={triageA !== triageB}
              customRenderer={(val) => <StatusBadge level={val} size="sm" />}
            />

            <DiffField
              label="Casualty Location"
              valueA={client.location || 'Zone A · Building 3'}
              valueB={server.location || 'Sector 4 · Field Hospital 01'}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={(client.location || '') !== (server.location || '')}
            />

            <DiffField
              label="Medical & Trauma Notes"
              valueA={client.statusNotes || 'Initial assessment: conscious, stable splint.'}
              valueB={server.statusNotes || 'Vitals deteriorating, breathing rate 36/min.'}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={(client.statusNotes || '') !== (server.statusNotes || '')}
            />
          </div>

          {/* Optional Merge Field Editor */}
          {activeMode === 'merge_editor' && (
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider block">
                Custom Reconciliation: Select Authoritative Fields
              </span>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Authoritative Triage Status:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['immediate', 'delayed', 'minor', 'expectant'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMergedTriage(lvl)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        mergedTriage === lvl
                          ? 'bg-coral text-white border-coral-dark shadow-sm'
                          : 'bg-white text-ink border-outline hover:border-coral/50'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Combined Field Notes:
                </label>
                <textarea
                  rows="3"
                  value={mergedNotes}
                  onChange={(e) => setMergedNotes(e.target.value)}
                  className="w-full bg-white border border-outline rounded-xl p-3 text-xs text-ink"
                />
              </div>

              <UX4GButton
                variant="primary"
                onClick={handleCommitMerge}
                disabled={isResolving || (isRedToGreenSafetyAlert && !safetyConfirmed)}
                className="w-full"
              >
                Commit Merged Record
              </UX4GButton>
            </div>
          )}

        </div>

        {/* ── 4. Human Decision Cards / Buttons (Large Pill CTAs) ── */}
        <div className="p-4 sm:p-5 bg-surface-secondary border-t border-outline flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          
          <UX4GButton
            variant="outline"
            onClick={handleKeepAlpha}
            disabled={isResolving || (isRedToGreenSafetyAlert && !safetyConfirmed)}
            emergencyMode={emergencyMode}
          >
            Keep {teamAName}
          </UX4GButton>

          <UX4GButton
            variant="secondary"
            onClick={handleKeepBeta}
            disabled={isResolving}
            emergencyMode={emergencyMode}
          >
            Keep {teamBName}
          </UX4GButton>

          <UX4GButton
            variant="primary"
            onClick={() => {
              if (activeMode === 'merge_editor') {
                handleCommitMerge();
              } else {
                setActiveMode('merge_editor');
              }
            }}
            disabled={isResolving || (isRedToGreenSafetyAlert && !safetyConfirmed)}
            icon={GitMerge}
            emergencyMode={emergencyMode}
          >
            {activeMode === 'merge_editor' ? 'Save Merged Notes' : 'Review & Merge'}
          </UX4GButton>

        </div>

      </div>
    </div>
  );
}

export default ConflictResolverModal;
