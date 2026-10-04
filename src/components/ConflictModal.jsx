import React, { useState } from 'react';
import {
  AlertTriangle,
  Server,
  Smartphone,
  GitMerge,
  Check,
  X,
  ShieldAlert,
  ArrowRight,
  Clock,
  Cpu,
} from 'lucide-react';
import { saveLocalRecord, addToOutbox } from '../db/indexedDB';

const TRIAGE_STYLES = {
  immediate: { bg: 'bg-red-500 text-white', text: 'text-red-400', label: 'RED (IMMEDIATE)' },
  delayed:   { bg: 'bg-amber-500 text-slate-950', text: 'text-amber-400', label: 'YELLOW (DELAYED)' },
  minor:     { bg: 'bg-emerald-500 text-white', text: 'text-emerald-400', label: 'GREEN (MINOR)' },
  expectant: { bg: 'bg-slate-700 text-slate-200', text: 'text-slate-400', label: 'BLACK (EXPECTANT)' },
};

export function ConflictModal({ conflict, isOpen, onClose, onResolved }) {
  if (!isOpen || !conflict) return null;

  const server = conflict.serverRecord || {};
  const client = conflict.clientPayload || {};

  const serverLevel = (server.triageLevel || server.triage_category || 'immediate').toLowerCase();
  const clientLevel = (client.triageLevel || client.triage_category || 'delayed').toLowerCase();

  const serverStyle = TRIAGE_STYLES[serverLevel] || TRIAGE_STYLES.immediate;
  const clientStyle = TRIAGE_STYLES[clientLevel] || TRIAGE_STYLES.delayed;

  // Custom merge state
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'merge'
  const [selectedTriage, setSelectedTriage] = useState(serverLevel);
  const [mergedNotes, setMergedNotes] = useState(
    `[Dr. Sunita Rao (Ambulance 04)]: ${server.statusNotes || 'Transit vitals: SpO2 dropped to 84%'}\n[Inspector Rajesh Nair (NDRF QRT)]: ${client.statusNotes || 'Conscious, right leg splinted'}`
  );
  const [isResolving, setIsResolving] = useState(false);

  // Resolution 1: Accept Server Version (Device-Tablet-02)
  const handleAcceptServer = async () => {
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
      console.error('[ConflictModal] Failed to accept server record:', err);
    } finally {
      setIsResolving(false);
    }
  };

  // Resolution 2: Keep Local Device Version (Force Overwrite)
  const handleKeepLocal = async () => {
    setIsResolving(true);
    try {
      const now = new Date().toISOString();
      const forcedLocal = {
        ...client,
        version: (server.version ?? 1) + 1,
        syncState: 'PENDING_UPDATE',
        updatedAt: now,
      };
      await saveLocalRecord(forcedLocal, true);
      await addToOutbox(forcedLocal.id, 'UPDATE', forcedLocal);
      if (onResolved) onResolved(forcedLocal);
      onClose();
    } catch (err) {
      console.error('[ConflictModal] Failed to keep local record:', err);
    } finally {
      setIsResolving(false);
    }
  };

  // Resolution 3: Merge Both (Custom 3-Way Merge)
  const handleMergeCustom = async () => {
    setIsResolving(true);
    try {
      const now = new Date().toISOString();
      const mergedRecord = {
        ...server,
        ...client,
        id: server.id || client.id,
        victimName: client.victimName || server.victimName,
        triageLevel: selectedTriage,
        triage_category: selectedTriage,
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
      console.error('[ConflictModal] Failed to merge records:', err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-amber-600/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 p-4 border-b border-amber-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shadow-warning-glow">
              <ShieldAlert className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-white tracking-wide">
                  3-Way Multi-Device Conflict Detected
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  REC: {server.id?.slice(0, 8) || 'MARCUS-R'}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                Concurrent offline modifications detected from Device-Tablet-02 vs Local Field Unit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'compare'
                  ? 'bg-amber-500 text-slate-950 shadow-warning-glow'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setActiveTab('merge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'merge'
                  ? 'bg-amber-500 text-slate-950 shadow-warning-glow'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>3-Way Merge Editor</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Tactical Vector Clock Conflict
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'compare' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Remote Device Column (Device-Tablet-02 / Command) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-slate-200">
                        Remote ({server.deviceId || 'Device-Tablet-02'})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded">
                      Version {server.version ?? 3}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Victim Name:</span>
                      <span className="font-bold text-white text-sm">
                        {server.victimName || server.patient_name || 'Aarav Sharma'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Triage Assessment:</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase mt-1 ${serverStyle.bg}`}>
                        {serverStyle.label}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Sector Location:</span>
                      <span className="text-slate-200 font-medium">
                        {server.location || 'Chooralmala Transit Ambulance • En route to Kalpetta'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Clinical Notes:</span>
                      <p className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                        {server.statusNotes || 'Dr. Sunita Rao (Ambulance 04): SpO2 dipped to 84%, breath sounds diminished. Upgraded to RED.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  id="accept-server-btn"
                  onClick={handleAcceptServer}
                  disabled={isResolving}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-emergency-glow transition flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Ambulance 04 (Dr. Sunita Rao)</span>
                </button>
              </div>

              {/* Local Device Column (Device-Phone-01) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">
                        This Unit ({client.deviceId || 'Field Unit 1'})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                      Version {client.version ?? 1}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Victim Name:</span>
                      <span className="font-bold text-white text-sm">
                        {client.victimName || client.patient_name || 'Aarav Sharma'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Triage Assessment:</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase mt-1 ${clientStyle.bg}`}>
                        {clientStyle.label}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Sector Location:</span>
                      <span className="text-slate-200 font-medium">
                        {client.location || 'Meppadi Junction • Relief Post 1'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Clinical Notes:</span>
                      <p className="mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                        {client.statusNotes || 'Inspector Rajesh Nair (NDRF QRT): Conscious, right leg splinted and dressed. Vitals steady.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  id="keep-local-btn"
                  onClick={handleKeepLocal}
                  disabled={isResolving}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs shadow-warning-glow transition flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Keep Local Version (Force Push)</span>
                </button>
              </div>

            </div>
          ) : (
            /* 3-Way Merge Custom Editor */
            <div className="space-y-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-amber-400" />
                <span>Tactical 3-Way Reconciliation Editor</span>
              </div>
              <p className="text-xs text-slate-400">
                Synthesize disparate field reports into a unified canonical casualty record.
              </p>

              {/* Choose Triage Level */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Unified Triage Level:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['immediate', 'delayed', 'minor', 'expectant'].map((lvl) => {
                    const conf = TRIAGE_STYLES[lvl];
                    const isSelected = selectedTriage === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedTriage(lvl)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? conf.bg + ' border-white ring-2 ring-white/60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {conf.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Synthesized Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Synthesized Clinical & Trauma Notes:
                </label>
                <textarea
                  rows="4"
                  value={mergedNotes}
                  onChange={(e) => setMergedNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                />
              </div>

              <button
                id="commit-merge-btn"
                onClick={handleMergeCustom}
                disabled={isResolving}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-warning-glow transition flex items-center justify-center space-x-2"
              >
                <GitMerge className="w-4 h-4" />
                <span>Commit 3-Way Merged Resolution</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>ResqSync Vector-Clock Conflict Handler</span>
          <span>Zero-Data-Loss Protocol</span>
        </div>

      </div>
    </div>
  );
}

export default ConflictModal;
