import React, { useState } from 'react';
import {
  MapPin,
  Cpu,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Check,
  X,
  User,
  HeartPulse,
} from 'lucide-react';
import { saveLocalRecord, deleteLocalRecord, addToOutbox } from '../db/indexedDB';

const LEVEL_CONFIG = {
  immediate: {
    label: 'RED',
    subtitle: 'Immediate',
    border: 'border-l-4 border-l-red-500 border-slate-800',
    badge: 'bg-red-500 text-white font-black',
    glow: 'hover:shadow-emergency-glow',
    accentText: 'text-red-400',
  },
  delayed: {
    label: 'YELLOW',
    subtitle: 'Delayed',
    border: 'border-l-4 border-l-amber-500 border-slate-800',
    badge: 'bg-amber-500 text-slate-950 font-black',
    glow: 'hover:shadow-warning-glow',
    accentText: 'text-amber-400',
  },
  minor: {
    label: 'GREEN',
    subtitle: 'Minor',
    border: 'border-l-4 border-l-emerald-500 border-slate-800',
    badge: 'bg-emerald-500 text-white font-black',
    glow: 'hover:shadow-stable-glow',
    accentText: 'text-emerald-400',
  },
  expectant: {
    label: 'BLACK',
    subtitle: 'Expectant',
    border: 'border-l-4 border-l-slate-500 border-slate-800',
    badge: 'bg-slate-700 text-slate-200 font-black',
    glow: '',
    accentText: 'text-slate-400',
  },
};

export function TriageCard({ record, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const rawLevel = (record.triageLevel || record.triage_category || 'immediate').toLowerCase();
  const [editName, setEditName] = useState(record.victimName || record.patient_name || '');
  const [editLocation, setEditLocation] = useState(record.location || record.field_unit_id || '');
  const [editNotes, setEditNotes] = useState(record.statusNotes || record.injuries || '');
  const [editLevel, setEditLevel] = useState(rawLevel);

  const levelInfo = LEVEL_CONFIG[rawLevel] || LEVEL_CONFIG.immediate;

  // Determine sync status per Prompt 5 spec
  const isPendingSync =
    record.syncState?.startsWith('PENDING') ||
    record._synced === 0 ||
    record.syncState === 'PENDING_CREATE' ||
    record.syncState === 'PENDING_UPDATE';

  const isConflict = record.syncState === 'CONFLICT';
  const isSynced = !isPendingSync && !isConflict;

  // Format timestamp cleanly
  const timestampStr = record.updatedAt || record.updated_at || record.createdAt || record.created_at;
  const formattedTime = timestampStr
    ? new Date(timestampStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  // Handle Edit Save (Works 100% offline)
  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const updatedRecord = {
        ...record,
        victimName: editName.trim() || record.victimName || 'Unidentified Casualty',
        patient_name: editName.trim() || record.patient_name || 'Unidentified Casualty',
        location: editLocation.trim() || record.location || 'Chooralmala Relief Post • Sector 3',
        field_unit_id: editLocation.trim() || record.field_unit_id || 'Chooralmala Relief Post • Sector 3',
        statusNotes: editNotes.trim(),
        injuries: editNotes.trim(),
        triageLevel: editLevel,
        triage_category: editLevel,
        updatedAt: now,
        updated_at: now,
        syncState: 'PENDING_UPDATE',
      };

      if (onUpdate) {
        await onUpdate(updatedRecord);
      } else {
        // Fallback direct IndexedDB write + outbox enqueue
        await saveLocalRecord(updatedRecord, true);
        await addToOutbox(record.id, 'UPDATE', updatedRecord);
      }

      setIsEditing(false);
    } catch (err) {
      console.error('[TriageCard] Failed to save edit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Soft-Delete (Works 100% offline)
  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(record.id);
      } else {
        // Fallback direct soft delete in IndexedDB + outbox enqueue
        await deleteLocalRecord(record.id, true);
        await addToOutbox(record.id, 'DELETE', { ...record, deleted: true });
      }
    } catch (err) {
      console.error('[TriageCard] Failed to soft-delete record:', err);
    }
  };

  return (
    <div
      id={`triage-card-${record.id}`}
      className={`rounded-2xl border bg-slate-900/90 ${levelInfo.border} ${levelInfo.glow} p-4 sm:p-5 shadow-lg backdrop-blur transition-all duration-200 flex flex-col justify-between relative group`}
    >
      {/* ── CARD HEADER: Triage Badge, Tag, and Sync Status Badge ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          {/* Triage Level Badge */}
          <span className={`px-2.5 py-0.5 rounded-lg text-xs tracking-wider uppercase ${levelInfo.badge}`}>
            {levelInfo.label} • {levelInfo.subtitle}
          </span>

          {/* Tag Number */}
          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded">
            {record.tag_number || record.id?.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Sync Status Badge per Prompt 5 spec */}
        <div>
          {isConflict ? (
            <span
              id={`sync-badge-${record.id}`}
              className="flex items-center space-x-1 text-[11px] font-extrabold text-rose-300 bg-rose-950/80 border border-rose-600/80 px-2.5 py-0.5 rounded-full shadow-emergency-glow animate-pulse"
              title="Conflict detected on server"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>CONFLICT</span>
            </span>
          ) : isPendingSync ? (
            <span
              id={`sync-badge-${record.id}`}
              className="flex items-center space-x-1 text-[11px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-600/80 px-2.5 py-0.5 rounded-full shadow-warning-glow animate-pulse"
              title="Stored in IndexedDB outbox — will sync on reconnect"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>⚡ QUEUED OFFLINE</span>
            </span>
          ) : (
            <span
              id={`sync-badge-${record.id}`}
              className="flex items-center space-x-1 text-[11px] font-extrabold text-emerald-300 bg-emerald-950/60 border border-emerald-600/80 px-2.5 py-0.5 rounded-full"
              title="Authoritative match with SQLite server database"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>SYNCED</span>
            </span>
          )}
        </div>
      </div>

      {/* ── CARD BODY (VIEW OR EDIT MODE) ── */}
      {isEditing ? (
        <div className="space-y-3 my-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl animate-in fade-in duration-150">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
            <span>Inline Field Edit</span>
            <span className="text-[10px] text-slate-500 font-mono">Zero-Network Safe</span>
          </div>

          {/* Edit Victim Name */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Victim Name / ID</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Edit Location */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Location / Sector</label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Edit Notes */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Status & Clinical Notes</label>
            <textarea
              rows="2"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Edit Triage Level Buttons */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Change Triage Level</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['immediate', 'delayed', 'minor', 'expectant'].map((lvl) => {
                const conf = LEVEL_CONFIG[lvl];
                const active = editLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEditLevel(lvl)}
                    className={`py-1 px-1 rounded text-[10px] font-bold uppercase border transition ${
                      active
                        ? conf.badge + ' border-white ring-1 ring-white/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-stable-glow transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 my-1 flex-1">
          {/* Victim Name */}
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
              {record.victimName || record.patient_name || 'Unidentified Casualty'}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-red-400/80 shrink-0" />
            <span className="font-medium text-slate-300">
              {record.location || record.field_unit_id || 'Chooralmala Relief Post • Sector 3'}
            </span>
          </div>

          {/* Clinical / Status Notes */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed min-h-[48px]">
            <span className="font-semibold text-slate-400 block text-[11px] mb-0.5">Clinical Notes:</span>
            {record.statusNotes || record.injuries ? (
              <p className="line-clamp-3">{record.statusNotes || record.injuries}</p>
            ) : (
              <p className="italic text-slate-500">No triage notes recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* ── CARD FOOTER: Device ID, Timestamp & Edit/Delete Controls ── */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          {/* Device ID */}
          <div className="flex items-center space-x-1 text-slate-400 truncate max-w-[160px]" title={`Device: ${record.deviceId || 'DEV-ALPHA-1'}`}>
            <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{record.deviceId ? record.deviceId.slice(0, 14) : 'FIELD-UNIT-1'}</span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center space-x-1 text-slate-400 shrink-0">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Action Buttons: Edit and Soft-Delete */}
        {!isEditing && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-mono">
              Version: {record.version ?? 1}
            </span>

            <div className="flex items-center space-x-1.5">
              {/* Soft-Delete Button */}
              {confirmDelete ? (
                <div className="flex items-center space-x-1 bg-red-950/90 border border-red-700/80 px-2 py-0.5 rounded-lg animate-in fade-in">
                  <span className="text-[10px] font-bold text-red-300">Delete?</span>
                  <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-red-800 text-white rounded transition"
                    title="Confirm delete"
                  >
                    <Check className="w-3 h-3 text-red-300" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="p-1 hover:bg-slate-800 text-slate-400 rounded transition"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  id={`delete-btn-${record.id}`}
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/60 transition"
                  title="Soft-delete record (queued offline if disconnected)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Edit Button */}
              <button
                id={`edit-btn-${record.id}`}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition"
                title="Edit victim details in offline mode"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TriageCard;
