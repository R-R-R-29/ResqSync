import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  User,
  Edit2,
  Trash2,
  Check,
  X,
  Cpu,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { UX4GButton } from '../common/UX4GButton';

const STRIPE_COLORS = {
  immediate: 'border-l-[6px] border-l-red-600',
  delayed:   'border-l-[6px] border-l-amber-500',
  minor:     'border-l-[6px] border-l-emerald-600',
  expectant: 'border-l-[6px] border-l-slate-700',
};

export function TriageCard({
  record,
  onUpdate,
  onDelete,
  emergencyMode = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const rawLevel = (record.triageLevel || record.triage_category || 'immediate').toLowerCase();
  const stripeClass = STRIPE_COLORS[rawLevel] || STRIPE_COLORS.immediate;

  // Inline edit state
  const [editName, setEditName] = useState(record.victimName || record.patient_name || '');
  const [editLocation, setEditLocation] = useState(record.location || record.field_unit_id || '');
  const [editNotes, setEditNotes] = useState(record.statusNotes || record.injuries || '');
  const [editLevel, setEditLevel] = useState(rawLevel);

  // Sync state
  const isPendingSync =
    record.syncState?.startsWith('PENDING') ||
    record._synced === 0 ||
    record.syncState === 'PENDING_CREATE' ||
    record.syncState === 'PENDING_UPDATE';
  const isConflict = record.syncState === 'CONFLICT';
  const isSynced = !isPendingSync && !isConflict;

  // Time formatting
  const timeStr = record.updatedAt || record.updated_at || record.createdAt || record.created_at;
  const formattedTime = timeStr
    ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  const handleSave = async () => {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const updated = {
        ...record,
        victimName: editName.trim() || record.victimName || 'Unidentified Victim',
        patient_name: editName.trim() || record.patient_name || 'Unidentified Victim',
        location: editLocation.trim() || record.location || 'Building B · Floor 2',
        field_unit_id: editLocation.trim() || record.field_unit_id || 'Building B · Floor 2',
        statusNotes: editNotes.trim(),
        injuries: editNotes.trim(),
        triageLevel: editLevel,
        triage_category: editLevel,
        updatedAt: now,
        updated_at: now,
        version: (record.version ?? 1) + 1,
        syncState: 'PENDING_UPDATE',
      };

      if (onUpdate) await onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('[TriageCard] Failed to update casualty:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) await onDelete(record.id);
  };

  return (
    <article
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl ${stripeClass} p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative`}
    >
      {/* ── Top Line: Victim #ID + Triage Badge + Sync Status ── */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide">
            {record.victimName || record.patient_name || record.tag_number || 'Victim #ID'}
          </span>
          <StatusBadge
            type="triage"
            level={rawLevel}
            size={emergencyMode ? 'md' : 'sm'}
          />
        </div>

        {/* Sync Badge */}
        <StatusBadge
          type="sync"
          synced={isSynced}
          isConflict={isConflict}
          size="sm"
        />
      </div>

      {/* ── Sub-Line: Location & Team/Timestamp ── */}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
        <div className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-aid-primary shrink-0" aria-hidden="true" />
          <span>{record.location || record.field_unit_id || 'Building B · Floor 2'}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>Updated {formattedTime} by {record.responderId || 'Team Alpha'}</span>
        </div>
      </div>

      {/* ── Body: Edit Mode vs View Mode ── */}
      {isEditing ? (
        <div className="space-y-3 my-2 p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl animate-in fade-in">
          <div className="text-xs font-bold text-aid-primary uppercase tracking-wider">
            Edit Casualty Details (Offline Safe)
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Victim Identifier
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Triage Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'immediate', label: 'RED' },
                { id: 'delayed', label: 'YELLOW' },
                { id: 'minor', label: 'GREEN' },
                { id: 'expectant', label: 'BLACK' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setEditLevel(lvl.id)}
                  className={`py-1.5 px-1 rounded text-[10px] font-black uppercase border transition ${
                    editLevel === lvl.id
                      ? 'bg-aid-primary text-white border-red-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Clinical Notes
            </label>
            <textarea
              rows="2"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 min-h-[36px]"
            >
              Cancel
            </button>
            <UX4GButton
              variant="primary"
              size="sm"
              icon={Check}
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </UX4GButton>
          </div>
        </div>
      ) : (
        <div className="my-1.5 flex-1">
          {/* Clinical Notes snippet */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 min-h-[46px]">
            <span className="font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase mb-0.5 tracking-wider">
              Clinical Notes
            </span>
            <p className="line-clamp-2">
              {record.statusNotes || record.injuries || 'No clinical observations entered.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Footer: Device ID & Action Controls ── */}
      {!isEditing && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-mono">
            <Cpu className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span className="truncate max-w-[120px]">{record.deviceId || 'DEV-TEAM-01'}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {confirmDelete ? (
              <div className="flex items-center space-x-1 bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-700 p-1 rounded-lg animate-in fade-in">
                <span className="text-[11px] font-bold text-red-700 dark:text-red-300 px-1">Delete?</span>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold min-h-[32px]"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-[11px] min-h-[32px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="min-h-[40px] min-w-[40px] p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition flex items-center justify-center"
                title="Soft delete casualty record"
                aria-label={`Delete record for ${record.victimName || record.patient_name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition flex items-center space-x-1"
              aria-label={`Edit record for ${record.victimName || record.patient_name}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default TriageCard;
