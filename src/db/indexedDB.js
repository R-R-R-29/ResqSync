import { openDB } from 'idb';

// ─── Constants ───────────────────────────────────────────────────────────────

const DB_NAME = 'ResqSyncDB';
const DB_VERSION = 1;

/**
 * Stable device ID: generated once per browser session and persisted in
 * localStorage so every outbox entry can be traced back to the originating
 * field device.
 */
function getDeviceId() {
  const key = 'resqsync_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    // Simple UUID-v4 without an external dependency at the db layer
    id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    localStorage.setItem(key, id);
  }
  return id;
}

// ─── DB Initialisation ────────────────────────────────────────────────────────

/**
 * Opens (and initialises on first run) the ResqSyncDB IndexedDB database.
 *
 * Object stores
 * ─────────────
 * records        keyPath: 'id'
 *   indexes: triageLevel | syncState | updatedAt
 *
 * outbox_queue   keyPath: 'queueId', autoIncrement: true
 *   indexes: recordId | status | timestamp
 *
 * @returns {Promise<import('idb').IDBPDatabase>}
 */
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // ── records store ────────────────────────────────────────────────────
      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'id' });
        // Index by START triage level for fast category queries
        recordStore.createIndex('triageLevel', 'triageLevel', { unique: false });
        // Index to find all dirty records that need to be pushed
        recordStore.createIndex('syncState', 'syncState', { unique: false });
        // Index for last-write-wins conflict resolution
        recordStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // ── outbox_queue store ───────────────────────────────────────────────
      if (!db.objectStoreNames.contains('outbox_queue')) {
        const outboxStore = db.createObjectStore('outbox_queue', {
          keyPath: 'queueId',
          autoIncrement: true,
        });
        // Look up queue entries by their associated record
        outboxStore.createIndex('recordId', 'recordId', { unique: false });
        // Filter by delivery status: 'PENDING' | 'SENDING' | 'FAILED'
        outboxStore.createIndex('status', 'status', { unique: false });
        // Chronological ordering for FIFO dispatch
        outboxStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
}

// ─── records helpers ──────────────────────────────────────────────────────────

/**
 * Returns all non-deleted triage records, sorted by triage severity then
 * most-recently-updated first.
 *
 * SyncState values used internally:
 *   'SYNCED'          – in-sync with server
 *   'PENDING_CREATE'  – created offline, not yet pushed
 *   'PENDING_UPDATE'  – edited offline, not yet pushed
 *   'PENDING_DELETE'  – soft-deleted offline, not yet pushed
 *
 * @returns {Promise<object[]>}
 */
export async function getLocalRecords() {
  try {
    const db = await getDB();
    const all = await db.getAll('records');

    // Filter out soft-deleted entries
    const active = all.filter((r) => !r.deleted);

    // Priority order: immediate(1) → delayed(2) → minor(3) → expectant(4)
    const PRIORITY = { immediate: 1, delayed: 2, minor: 3, expectant: 4 };
    return active.sort((a, b) => {
      const levelDiff =
        (PRIORITY[a.triageLevel] ?? 99) - (PRIORITY[b.triageLevel] ?? 99);
      if (levelDiff !== 0) return levelDiff;
      // Tie-break: most recently updated first
      return new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0);
    });
  } catch (err) {
    console.error('[ResqSyncDB] getLocalRecords failed:', err);
    return [];
  }
}

/**
 * Persists a triage record to the local `records` store.
 *
 * @param {object}  record         - The patient/triage object (must include `id`).
 * @param {boolean} isOfflineEdit  - When true, stamps the record as pending.
 * @returns {Promise<object>} The stored record (with syncState applied).
 */
export async function saveLocalRecord(record, isOfflineEdit = false) {
  if (!record?.id) {
    throw new Error('[ResqSyncDB] saveLocalRecord: record.id is required');
  }

  try {
    const db = await getDB();

    // Determine whether this is a brand-new local record or an edit
    let syncState = record.syncState ?? 'SYNCED';
    if (isOfflineEdit) {
      const existing = await db.get('records', record.id);
      syncState = existing ? 'PENDING_UPDATE' : 'PENDING_CREATE';
    }

    const now = new Date().toISOString();
    const stored = {
      ...record,
      syncState,
      updatedAt: record.updatedAt ?? now,
      _localSavedAt: now,
      deleted: record.deleted ?? false,
    };

    await db.put('records', stored);
    return stored;
  } catch (err) {
    console.error('[ResqSyncDB] saveLocalRecord failed:', err);
    throw err;
  }
}

/**
 * Soft-deletes a record by marking `deleted: true` and optionally setting
 * a pending sync state so the deletion propagates to the server.
 *
 * @param {string}  recordId   - The record `id` to soft-delete.
 * @param {boolean} isOffline  - When true, marks as `'PENDING_DELETE'`.
 * @returns {Promise<object|null>} The updated record, or null if not found.
 */
export async function deleteLocalRecord(recordId, isOffline = false) {
  if (!recordId) throw new Error('[ResqSyncDB] deleteLocalRecord: recordId is required');

  try {
    const db = await getDB();
    const existing = await db.get('records', recordId);
    if (!existing) {
      console.warn(`[ResqSyncDB] deleteLocalRecord: record ${recordId} not found`);
      return null;
    }

    const updated = {
      ...existing,
      deleted: true,
      syncState: isOffline ? 'PENDING_DELETE' : existing.syncState,
      updatedAt: new Date().toISOString(),
    };

    await db.put('records', updated);
    return updated;
  } catch (err) {
    console.error('[ResqSyncDB] deleteLocalRecord failed:', err);
    throw err;
  }
}

/**
 * Bulk-upserts records received from the server, marking them as SYNCED.
 * Used after a successful pull from the REST endpoint.
 *
 * @param {object[]} records
 */
export async function bulkUpsertFromServer(records) {
  if (!Array.isArray(records) || records.length === 0) return;
  try {
    const db = await getDB();
    const tx = db.transaction('records', 'readwrite');
    for (const r of records) {
      await tx.store.put({ ...r, syncState: 'SYNCED', deleted: r.deleted ?? false });
    }
    await tx.done;
  } catch (err) {
    console.error('[ResqSyncDB] bulkUpsertFromServer failed:', err);
    throw err;
  }
}

/**
 * Marks a list of record IDs as SYNCED after a successful outbox flush.
 *
 * @param {string[]} recordIds
 */
export async function markRecordsSynced(recordIds) {
  if (!recordIds?.length) return;
  try {
    const db = await getDB();
    const tx = db.transaction('records', 'readwrite');
    for (const id of recordIds) {
      const r = await tx.store.get(id);
      if (r) await tx.store.put({ ...r, syncState: 'SYNCED' });
    }
    await tx.done;
  } catch (err) {
    console.error('[ResqSyncDB] markRecordsSynced failed:', err);
    throw err;
  }
}

// ─── outbox_queue helpers ─────────────────────────────────────────────────────

/**
 * Enqueues a mutation so it can be replayed when connectivity is restored.
 *
 * @param {string} recordId  - The triage record this mutation targets.
 * @param {'CREATE'|'UPDATE'|'DELETE'} action - The mutation type.
 * @param {object} payload   - The full record snapshot at the time of the mutation.
 * @returns {Promise<number>} The auto-generated `queueId`.
 */
export async function addToOutbox(recordId, action, payload) {
  if (!recordId) throw new Error('[ResqSyncDB] addToOutbox: recordId is required');
  if (!['CREATE', 'UPDATE', 'DELETE'].includes(action)) {
    throw new Error(`[ResqSyncDB] addToOutbox: invalid action "${action}"`);
  }

  try {
    const db = await getDB();
    const entry = {
      recordId,
      action,
      payload,
      status: 'PENDING',          // PENDING | SENDING | FAILED
      timestamp: Date.now(),
      deviceId: getDeviceId(),
      retryCount: 0,
    };

    // `queueId` is set by autoIncrement; add() returns the generated key
    const queueId = await db.add('outbox_queue', entry);
    return queueId;
  } catch (err) {
    console.error('[ResqSyncDB] addToOutbox failed:', err);
    throw err;
  }
}

/**
 * Retrieves all pending outbox entries ordered by `timestamp` (oldest first),
 * ready for sequential dispatch to the server.
 *
 * @returns {Promise<object[]>}
 */
export async function getOutboxItems() {
  try {
    const db = await getDB();
    // Use the timestamp index for chronological FIFO order
    return db.getAllFromIndex('outbox_queue', 'timestamp');
  } catch (err) {
    console.error('[ResqSyncDB] getOutboxItems failed:', err);
    return [];
  }
}

/**
 * Removes a successfully-delivered mutation from the outbox queue.
 *
 * @param {number} queueId - The auto-incremented key of the outbox entry.
 */
export async function removeFromOutbox(queueId) {
  if (queueId == null) throw new Error('[ResqSyncDB] removeFromOutbox: queueId is required');

  try {
    const db = await getDB();
    await db.delete('outbox_queue', queueId);
  } catch (err) {
    console.error('[ResqSyncDB] removeFromOutbox failed:', err);
    throw err;
  }
}

/**
 * Updates the status of an outbox entry (e.g. to 'SENDING' or 'FAILED')
 * and increments retryCount on failure.
 *
 * @param {number} queueId
 * @param {'PENDING'|'SENDING'|'FAILED'} status
 */
export async function updateOutboxStatus(queueId, status) {
  try {
    const db = await getDB();
    const entry = await db.get('outbox_queue', queueId);
    if (!entry) return;
    await db.put('outbox_queue', {
      ...entry,
      status,
      retryCount: status === 'FAILED' ? (entry.retryCount ?? 0) + 1 : entry.retryCount,
    });
  } catch (err) {
    console.error('[ResqSyncDB] updateOutboxStatus failed:', err);
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Wipes all data from both object stores.  Intended for demo resets and
 * testing – never call in a production sync flow.
 *
 * @returns {Promise<void>}
 */
export async function clearLocalData() {
  try {
    const db = await getDB();
    const tx = db.transaction(['records', 'outbox_queue'], 'readwrite');
    await tx.objectStore('records').clear();
    await tx.objectStore('outbox_queue').clear();
    await tx.done;
    console.info('[ResqSyncDB] Local data cleared.');
  } catch (err) {
    console.error('[ResqSyncDB] clearLocalData failed:', err);
    throw err;
  }
}
