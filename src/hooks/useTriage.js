import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getLocalRecords, saveLocalRecord, addToOutbox } from '../db/indexedDB';
import { syncService } from '../services/syncService';

export function useTriage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLocalData = useCallback(async () => {
    try {
      const data = await getLocalRecords();
      setRecords(data);
    } catch (err) {
      console.error('[useTriage] Failed to load local records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocalData();

    const unsubscribe = syncService.subscribe((event) => {
      if (['DATA_UPDATED', 'DATA_REFRESHED', 'SYNC_COMPLETE'].includes(event.type)) {
        loadLocalData();
      }
    });

    if (navigator.onLine) {
      syncService.fetchServerRecords();
    }

    return () => unsubscribe();
  }, [loadLocalData]);

  /**
   * Offline-first patient intake:
   *   1. Build record with required fields
   *   2. Persist to IndexedDB as PENDING_CREATE
   *   3. Enqueue a CREATE outbox item
   *   4. Optimistically update React state
   *   5. Trigger outbox flush if online
   */
  /**
   * Offline-first patient intake:
   *   1. Build record with required fields
   *   2. Persist to IndexedDB as PENDING_CREATE
   *   3. Enqueue a CREATE outbox item
   *   4. Optimistically update React state
   *   5. Trigger outbox flush if online
   */
  const addTriage = useCallback(async (formData) => {
    const now = new Date().toISOString();
    const victimName = formData.victimName || formData.patient_name || 'Unidentified Victim';
    const triageLevel = (formData.triageLevel || formData.triage_category || 'immediate').toLowerCase();
    const location = formData.location || formData.field_unit_id || 'Sector 4';
    const notes = formData.statusNotes || formData.injuries || '';
    const deviceId = formData.deviceId || localStorage.getItem('resqsync_device_id') || 'FIELD-TERM-1';

    const newRecord = {
      id: formData.id || uuidv4(),
      tag_number: formData.tag_number || `T-${Math.floor(1000 + Math.random() * 9000)}`,
      victimName,
      patient_name: victimName,
      age: formData.age ? parseInt(formData.age, 10) : null,
      gender: formData.gender || 'Unknown',
      // Canonical field for IndexedDB index & server
      triageLevel,
      // Legacy alias kept for TriageCard compatibility
      triage_category: triageLevel,
      location,
      statusNotes: notes,
      injuries: notes,
      respiration_rate: formData.respiration_rate ? parseInt(formData.respiration_rate, 10) : null,
      pulse_rate: formData.pulse_rate ? parseInt(formData.pulse_rate, 10) : null,
      mental_status: formData.mental_status || 'Alert',
      field_unit_id: location,
      deviceId,
      responderId: formData.responderId || 'FIELD-UNIT-1',
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      status: 'pending',
      version: 1,
      createdAt: now,
      updatedAt: now,
      created_at: now,
      updated_at: now,
      deleted: false,
    };

    // Persist locally as a pending create
    const stored = await saveLocalRecord(newRecord, true);

    // Enqueue for server sync
    await addToOutbox(stored.id, 'CREATE', stored);

    // Optimistic state update
    setRecords((prev) => [stored, ...prev.filter((r) => r.id !== stored.id)]);

    if (navigator.onLine) {
      syncService.flushOutbox();
    }

    return stored;
  }, []);

  /**
   * Offline-first record update:
   * Saves changes to local IndexedDB with PENDING_UPDATE and enqueues to outbox.
   */
  const updateTriage = useCallback(async (updatedData) => {
    const now = new Date().toISOString();
    const triageLevel = (updatedData.triageLevel || updatedData.triage_category || 'immediate').toLowerCase();
    const victimName = updatedData.victimName || updatedData.patient_name || 'Unidentified Victim';
    const notes = updatedData.statusNotes ?? updatedData.injuries ?? '';
    const location = updatedData.location ?? updatedData.field_unit_id ?? 'Sector 4';

    const merged = {
      ...updatedData,
      victimName,
      patient_name: victimName,
      triageLevel,
      triage_category: triageLevel,
      location,
      statusNotes: notes,
      injuries: notes,
      updatedAt: now,
      updated_at: now,
      version: (updatedData.version ?? 1) + 1,
    };

    const stored = await saveLocalRecord(merged, true);
    await addToOutbox(stored.id, 'UPDATE', stored);

    setRecords((prev) => prev.map((r) => (r.id === stored.id ? stored : r)));

    if (navigator.onLine) {
      syncService.flushOutbox();
    }

    return stored;
  }, []);

  /**
   * Offline-first soft-delete:
   * Marks record as deleted in IndexedDB and enqueues DELETE mutation to outbox.
   */
  const deleteTriage = useCallback(async (recordId) => {
    const record = records.find((r) => r.id === recordId);
    await deleteLocalRecord(recordId, true);
    
    if (record) {
      await addToOutbox(recordId, 'DELETE', { ...record, deleted: true });
    }

    // Optimistically remove from active list
    setRecords((prev) => prev.filter((r) => r.id !== recordId));

    if (navigator.onLine) {
      syncService.flushOutbox();
    }
  }, [records]);

  /**
   * Seeds realistic demo data for disaster triage training drills.
   */
  const seedDemoData = useCallback(async () => {
    const samples = [
      {
        victimName: 'Sarah Jenkins',
        triageLevel: 'immediate',
        location: 'Sector 4 - Subway Collapsed Concourse',
        statusNotes: 'Open pneumothorax, shallow breathing at 34/min, weak radial pulse.',
        respiration_rate: 34,
        pulse_rate: 130,
        mental_status: 'Confused',
      },
      {
        victimName: 'Marcus Ramirez',
        triageLevel: 'delayed',
        location: 'Sector 4 - East Wing Stairwell 2',
        statusNotes: 'Compound tibia fracture, severe hemorrhage controlled with field tourniquet.',
        respiration_rate: 22,
        pulse_rate: 96,
        mental_status: 'Alert',
      },
      {
        victimName: 'Elena Rostova',
        triageLevel: 'minor',
        location: 'Sector 4 - Safe Assembly Point A',
        statusNotes: 'Walking wounded. Superficial facial lacerations, mild smoke inhalation.',
        respiration_rate: 18,
        pulse_rate: 82,
        mental_status: 'Alert',
      },
      {
        victimName: 'Unidentified Male (VIC-408)',
        triageLevel: 'expectant',
        location: 'Sector 4 - Structural Void C-9',
        statusNotes: 'Massive cranial trauma, apnea despite airway repositioning, pulseless.',
        respiration_rate: 0,
        pulse_rate: 0,
        mental_status: 'Unresponsive',
      },
    ];

    for (const sample of samples) {
      await addTriage(sample);
    }
    await loadLocalData();
  }, [addTriage, loadLocalData]);

  // Triage category counters
  const counts = {
    total: records.length,
    immediate: records.filter((r) => (r.triageLevel ?? r.triage_category) === 'immediate').length,
    delayed: records.filter((r) => (r.triageLevel ?? r.triage_category) === 'delayed').length,
    minor: records.filter((r) => (r.triageLevel ?? r.triage_category) === 'minor').length,
    expectant: records.filter((r) => (r.triageLevel ?? r.triage_category) === 'expectant').length,
  };

  return {
    records,
    loading,
    counts,
    addTriage,
    updateTriage,
    deleteTriage,
    seedDemoData,
    refresh: loadLocalData,
  };
}
