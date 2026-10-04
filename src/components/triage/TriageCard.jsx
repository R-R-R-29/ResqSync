import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Edit2,
  Trash2,
  Check,
  Cpu,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { UX4GButton } from '../common/UX4GButton';

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
    : '2 min ago';

  const handleSave = async () => {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const updated = {
        ...record,
        victimName: editName.trim() || record.victimName || 'Casualty',
        patient_name: editName.trim() || record.patient_name || 'Casualty',
        location: editLocation.trim() || record.location || 'Chooralmala Relief Post',
        field_unit_id: editLocation.trim() || record.field_unit_id || 'Chooralmala Relief Post',
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
      className="bg-white border border-outline rounded-3xl p-5 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between relative"
    >
      {/* ── Top Header Line: ID + Triage Status Pill ── */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-base sm:text-lg font-black text-ink tracking-tight font-mono block">
            {record.victimName || record.patient_name || record.tag_number || 'RSQ-1042'}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-ink-secondary mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-coral shrink-0" aria-hidden="true" />
            <span className="font-medium truncate max-w-[200px]">{record.location || record.field_unit_id || 'Chooralmala Relief Post • Sector 3'}</span>
          </div>
        </div>

        {/* Triage Status Pill */}
        <StatusBadge
          type="triage"
          level={rawLevel}
          size={emergencyMode ? 'md' : 'sm'}
        />
      </div>

      {/* ── Body: Medical Notes & Summary ── */}
      {isEditing ? (
        <div className="space-y-3 my-3 p-4 bg-surface-secondary border border-outline rounded-2xl animate-in fade-in">
          <div className="text-xs font-bold text-coral uppercase tracking-wider">
            Edit Casualty Details
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Casualty Identifier
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white border border-outline rounded-xl px-3 py-2 text-xs text-ink"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full bg-white border border-outline rounded-xl px-3 py-2 text-xs text-ink"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Triage Status
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
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-bold uppercase border transition ${
                    editLevel === lvl.id
                      ? 'bg-coral text-white border-coral-dark shadow-sm'
                      : 'bg-white text-ink border-outline'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Medical Notes
            </label>
            <textarea
              rows="2"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full bg-white border border-outline rounded-xl p-2.5 text-xs text-ink resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1 border-t border-outline">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink min-h-[36px]"
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
              {saving ? 'Saving...' : 'Save'}
            </UX4GButton>
          </div>
        </div>
      ) : (
        <div className="my-3 flex-1">
          <div className="bg-surface-secondary border border-outline/70 rounded-2xl p-3.5 text-xs text-ink">
            <span className="font-bold text-ink-muted block text-[10px] uppercase tracking-wider mb-1">
              Medical Assessment
            </span>
            <p className="line-clamp-2 leading-relaxed font-medium">
              {record.statusNotes || record.injuries || 'No medical trauma observations recorded.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Footer: Sync Pill + Time + Actions ── */}
      {!isEditing && (
        <div className="mt-1 pt-3 border-t border-[#F3F1EF] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <StatusBadge
              type="sync"
              synced={isSynced}
              isConflict={isConflict}
              size="sm"
            />
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedTime}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {confirmDelete ? (
              <div className="flex items-center space-x-1 bg-[#FDE3DF] border border-[#FBCBC4] p-1 rounded-full animate-in fade-in">
                <span className="text-[11px] font-bold text-[#C94336] px-1.5">Delete?</span>
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1 bg-[#D94343] hover:bg-[#C94336] text-white rounded-full text-[11px] font-bold min-h-[30px]"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-ink-secondary hover:text-ink text-[11px] min-h-[30px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="min-h-[38px] min-w-[38px] p-2 rounded-full text-ink-muted hover:text-coral hover:bg-surface-secondary transition flex items-center justify-center"
                title="Soft delete casualty"
                aria-label={`Delete record for ${record.victimName || record.patient_name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface-secondary hover:bg-[#EAE6E2] text-ink border border-outline transition flex items-center space-x-1.5"
              aria-label={`Edit record for ${record.victimName || record.patient_name}`}
            >
              <Edit2 className="w-3 h-3 text-coral" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default TriageCard;
