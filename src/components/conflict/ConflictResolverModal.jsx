import React, { useState } from 'react';
import {
  AlertTriangle,
  GitMerge,
  Clock,
  ShieldAlert,
  Check,
  X,
  User,
  MapPin,
  Calendar,
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

  // UX4G Severity Rule Check: If either side is RED and the other is GREEN, critical downgrade safety guard
  const isRedToGreenSafetyAlert =
    (triageA === 'immediate' && triageB === 'minor') ||
    (triageA === 'minor' && triageB === 'immediate');

  const [safetyConfirmed, setSafetyConfirmed] = useState(!isRedToGreenSafetyAlert);
  const [activeMode, setActiveMode] = useState('decision'); // 'decision' | 'merge_editor'
  const [mergedTriage, setMergedTriage] = useState(triageB); // default to higher severity for safety
  const [mergedNotes, setMergedNotes] = useState(
    `[${teamAName}]: ${client.statusNotes || 'Initial assessment'}\n[${teamBName}]: ${server.statusNotes || 'Updated field status'}`
  );
  const [mergedLocation, setMergedLocation] = useState(server.location || client.location || 'Building B');
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

  const victimId = server.victimName || client.victimName || `Victim #${server.id?.slice(0, 6) || '104'}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ── 1. Human-Readable Conflict Header ── */}
        <div className="p-4 sm:p-5 bg-aid-light dark:bg-red-950/40 border-b border-aid-border/60 dark:border-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-aid-primary text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <h2 id="conflict-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                Conflict Alert: {victimId} was updated by {teamAName} and {teamBName} independently while offline.
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                Both field units modified this casualty concurrently. Please review the timeline below and confirm the canonical operational state.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── UX4G Safety Guard Alert (Red to Green Downgrade) ── */}
        {isRedToGreenSafetyAlert && (
          <div className="p-3.5 bg-red-600 text-white flex items-start space-x-2.5 text-xs font-bold shadow-inner">
            <AlertOctagon className="w-5 h-5 shrink-0 animate-bounce" aria-hidden="true" />
            <div className="flex-1">
              <span className="uppercase tracking-wider font-black block">CRITICAL SAFETY GUARD (UX4G Standard):</span>
              <span>
                One device assessed this casualty as 🔴 RED (Immediate Life Threat) while the other marked 🟢 GREEN (Minor). Automatic downgrade is locked.
              </span>
              <label className="flex items-center space-x-2 mt-2 cursor-pointer bg-white/10 p-1.5 rounded-lg">
                <input
                  type="checkbox"
                  checked={safetyConfirmed}
                  onChange={(e) => setSafetyConfirmed(e.target.checked)}
                  className="w-4 h-4 text-aid-primary rounded focus:ring-red-400"
                />
                <span className="text-xs text-white">I am an authorized medical coordinator explicitly confirming this triage resolution.</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Modal Content: Timeline & Side-by-Side Comparison ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* 2. Timeline View */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Chronological Modification Sequence
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
                  1
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{teamAName}</span>
                  <span className="text-slate-500 text-[11px]">Edited locally at {new Date(client.updatedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" aria-hidden="true" />

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-aid-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">{teamBName}</span>
                  <span className="text-slate-500 text-[11px]">Overrode via satellite/cellular at {new Date(server.updatedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Side-by-Side Field Comparison (AidConnect Clean Cards) */}
          <div className="space-y-3">
            <DiffField
              label="Triage Severity Classification"
              valueA={triageA}
              valueB={triageB}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={triageA !== triageB}
              customRenderer={(val) => <StatusBadge level={val} size="sm" />}
            />

            <DiffField
              label="Casualty Location"
              valueA={client.location || 'Building B · Floor 2'}
              valueB={server.location || 'Sector 4 · Ambulance 07'}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={(client.location || '') !== (server.location || '')}
            />

            <DiffField
              label="Status & Trauma Observations"
              valueA={client.statusNotes || 'Airway cleared, splint applied.'}
              valueB={server.statusNotes || 'Patient evacuated to mobile medical tent.'}
              labelA={teamAName}
              labelB={teamBName}
              isDifferent={(client.statusNotes || '') !== (server.statusNotes || '')}
            />
          </div>

          {/* Optional 3-Way Merge Field Editor */}
          {activeMode === 'merge_editor' && (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block">
                Custom Reconciliation: Pick Authoritative Fields
              </span>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Canonical Triage Severity:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['immediate', 'delayed', 'minor', 'expectant'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMergedTriage(lvl)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        mergedTriage === lvl
                          ? 'bg-aid-primary text-white border-red-700 shadow-sm ring-2 ring-red-300'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Combined Field Notes:
                </label>
                <textarea
                  rows="3"
                  value={mergedNotes}
                  onChange={(e) => setMergedNotes(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
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

        {/* ── 4. Human Action Controls (Large Accessible Buttons) ── */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          
          <UX4GButton
            variant="outline"
            onClick={handleKeepAlpha}
            disabled={isResolving || (isRedToGreenSafetyAlert && !safetyConfirmed)}
            emergencyMode={emergencyMode}
          >
            Keep {teamAName} Edit
          </UX4GButton>

          <UX4GButton
            variant="secondary"
            onClick={handleKeepBeta}
            disabled={isResolving}
            emergencyMode={emergencyMode}
          >
            Keep {teamBName} Edit
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
            {activeMode === 'merge_editor' ? 'Save Merged Notes' : 'Merge & Combine Field Notes'}
          </UX4GButton>

        </div>

      </div>
    </div>
  );
}

export default ConflictResolverModal;
