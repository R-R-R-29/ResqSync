/**
 * server/database.js
 *
 * SQLite persistence layer via sql.js (pure WebAssembly — no native build
 * tools required).  The in-memory db is serialised to disk on every write so
 * data survives restarts.
 *
 * Schema mirrors the Prompt 3 specification:
 *   records(id, victimName, triageLevel, location, statusNotes, responderId,
 *           deviceId, updatedAt, version, deleted, vectorClock)
 */

import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/** Path to the binary snapshot written after every mutation */
const DB_PATH = path.join(__dirname, 'resqsync_server.db');

let _db = null;   // sql.js Database singleton

// ─── Schema ───────────────────────────────────────────────────────────────────

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS records (
    id          TEXT    PRIMARY KEY,
    victimName  TEXT    NOT NULL DEFAULT 'Unidentified',
    triageLevel TEXT    NOT NULL DEFAULT 'immediate',
    location    TEXT,
    statusNotes TEXT,
    responderId TEXT,
    deviceId    TEXT,
    updatedAt   TEXT    NOT NULL,
    version     INTEGER NOT NULL DEFAULT 1,
    deleted     INTEGER NOT NULL DEFAULT 0,
    vectorClock TEXT    NOT NULL DEFAULT '{}'
  );

  CREATE INDEX IF NOT EXISTS idx_records_triageLevel ON records(triageLevel);
  CREATE INDEX IF NOT EXISTS idx_records_updatedAt   ON records(updatedAt);
  CREATE INDEX IF NOT EXISTS idx_records_deleted     ON records(deleted);
`;

// ─── Bootstrap ────────────────────────────────────────────────────────────────

/**
 * Initialises sql.js and opens (or reloads) the database.
 * Must be awaited once before any query helper is used.
 *
 * @returns {Promise<import('sql.js').Database>}
 */
export async function initDB() {
  if (_db) return _db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(buf);
    console.log('[DB] Reloaded existing database from disk →', DB_PATH);
  } else {
    _db = new SQL.Database();
    console.log('[DB] Created new database →', DB_PATH);
  }

  _db.run(SCHEMA);
  _persist();
  return _db;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Flush in-memory db to disk after every write */
function _persist() {
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * Convert a raw sql.js exec result set into an array of plain objects.
 *
 * @param {Array} results
 * @returns {object[]}
 */
function _rows(results) {
  if (!results || results.length === 0) return [];
  const { columns, values } = results[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

/**
 * Safely parse a vectorClock JSON string stored in the db.
 * Returns {} on any error so callers never have to guard against null.
 *
 * @param {string|null} raw
 * @returns {object}
 */
function _parseVC(raw) {
  try { return JSON.parse(raw || '{}'); }
  catch { return {}; }
}

// ─── Read operations ──────────────────────────────────────────────────────────

/**
 * Returns every non-deleted record ordered by triage severity.
 *
 * @returns {object[]}
 */
export function getAllRecords() {
  _assertReady();
  const PRIORITY = `
    CASE triageLevel
      WHEN 'immediate' THEN 1
      WHEN 'delayed'   THEN 2
      WHEN 'minor'     THEN 3
      WHEN 'expectant' THEN 4
      ELSE 5
    END
  `;
  const res = _db.exec(
    `SELECT * FROM records WHERE deleted = 0 ORDER BY ${PRIORITY}, updatedAt DESC`
  );
  return _rows(res).map(_deserialiseRecord);
}

/**
 * Fetches a single record by its id regardless of deleted state.
 *
 * @param {string} id
 * @returns {object|null}
 */
export function getRecordById(id) {
  _assertReady();
  const stmt = _db.prepare(`SELECT * FROM records WHERE id = :id`);
  stmt.bind({ ':id': id });
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows.length ? _deserialiseRecord(rows[0]) : null;
}

// ─── Conflict Detection & Write ───────────────────────────────────────────────

/**
 * Attempts to apply a single outbox mutation with version/vectorClock conflict
 * detection.
 *
 * Resolution rules
 * ────────────────
 * • Record not in DB yet              → INSERT, version = 1
 * • incomingVersion > serverVersion   → UPDATE, version++, merge vectorClock
 * • incomingVersion <= serverVersion
 *   AND payloads differ               → CONFLICT (caller decides how to surface)
 * • incomingVersion <= serverVersion
 *   AND payloads identical            → duplicate ACK (idempotent, no write)
 *
 * @param {{ recordId, action, payload, deviceId, version, vectorClock? }} mutation
 * @returns {{ status: 'ACK'|'CONFLICT'|'DELETED', record?: object, serverRecord?: object, clientPayload?: object }}
 */
export function applyMutation(mutation) {
  _assertReady();

  const {
    recordId,
    action,
    payload,
    deviceId,
    version: incomingVersion = 1,
    vectorClock: incomingVC  = {},
  } = mutation;

  const server = getRecordById(recordId);

  // ── Hard delete ──────────────────────────────────────────────────────────
  if (action === 'DELETE') {
    if (!server) return { status: 'ACK', record: { id: recordId, deleted: 1 } };

    if (incomingVersion <= server.version) {
      // Server has a newer version – treat as conflict
      return { status: 'CONFLICT', serverRecord: server, clientPayload: payload };
    }

    _runWrite(
      `UPDATE records SET deleted = 1, updatedAt = :ua, version = :v, vectorClock = :vc
       WHERE id = :id`,
      {
        ':ua': new Date().toISOString(),
        ':v':  server.version + 1,
        ':vc': JSON.stringify(_mergeVC(server.vectorClock, incomingVC, deviceId)),
        ':id': recordId,
      }
    );
    const deleted = getRecordById(recordId);
    return { status: 'DELETED', record: deleted };
  }

  // ── INSERT (record not in DB) ────────────────────────────────────────────
  if (!server) {
    const now       = new Date().toISOString();
    const newRecord = _buildRecord(payload, {
      id:          recordId,
      deviceId,
      version:     1,
      vectorClock: _tickVC({}, deviceId),
      updatedAt:   now,
    });
    _insertRecord(newRecord);
    return { status: 'ACK', record: newRecord };
  }

  // ── Conflict check ───────────────────────────────────────────────────────
  if (incomingVersion <= server.version) {
    const payloadsIdentical = _payloadsEqual(server, payload);
    if (payloadsIdentical) {
      // Idempotent duplicate – already applied, acknowledge without writing
      return { status: 'ACK', record: server };
    }
    return { status: 'CONFLICT', serverRecord: server, clientPayload: payload };
  }

  // ── Valid forward update ─────────────────────────────────────────────────
  const now       = new Date().toISOString();
  const mergedVC  = _mergeVC(server.vectorClock, incomingVC, deviceId);
  const newVersion = server.version + 1;

  _runWrite(
    `UPDATE records SET
        victimName  = :vn,
        triageLevel = :tl,
        location    = :loc,
        statusNotes = :sn,
        responderId = :ri,
        deviceId    = :di,
        updatedAt   = :ua,
        version     = :v,
        deleted     = :del,
        vectorClock = :vc
     WHERE id = :id`,
    {
      ':vn':  payload.victimName  ?? server.victimName,
      ':tl':  payload.triageLevel ?? server.triageLevel,
      ':loc': payload.location    ?? server.location,
      ':sn':  payload.statusNotes ?? server.statusNotes,
      ':ri':  payload.responderId ?? server.responderId,
      ':di':  deviceId            ?? server.deviceId,
      ':ua':  now,
      ':v':   newVersion,
      ':del': payload.deleted ? 1 : 0,
      ':vc':  JSON.stringify(mergedVC),
      ':id':  recordId,
    }
  );

  return { status: 'ACK', record: getRecordById(recordId) };
}

// ─── Private write helpers ────────────────────────────────────────────────────

function _assertReady() {
  if (!_db) throw new Error('[DB] Database not initialised — call initDB() first');
}

function _runWrite(sql, params) {
  _db.run(sql, params);
  _persist();
}

function _insertRecord(r) {
  _db.run(
    `INSERT INTO records
       (id, victimName, triageLevel, location, statusNotes, responderId,
        deviceId, updatedAt, version, deleted, vectorClock)
     VALUES
       (:id, :vn, :tl, :loc, :sn, :ri, :di, :ua, :v, :del, :vc)`,
    {
      ':id':  r.id,
      ':vn':  r.victimName  ?? 'Unidentified',
      ':tl':  r.triageLevel ?? 'immediate',
      ':loc': r.location    ?? null,
      ':sn':  r.statusNotes ?? null,
      ':ri':  r.responderId ?? null,
      ':di':  r.deviceId    ?? null,
      ':ua':  r.updatedAt   ?? new Date().toISOString(),
      ':v':   r.version     ?? 1,
      ':del': r.deleted     ? 1 : 0,
      ':vc':  JSON.stringify(r.vectorClock ?? {}),
    }
  );
  _persist();
}

/** Deserialise stored JSON fields back to objects */
function _deserialiseRecord(r) {
  if (!r) return r;
  return { ...r, vectorClock: _parseVC(r.vectorClock), deleted: !!r.deleted };
}

/**
 * Build a normalised record object from a client payload + server-side
 * overrides (version, vectorClock, etc.).
 */
function _buildRecord(payload, overrides) {
  return {
    id:          overrides.id,
    victimName:  payload.victimName  ?? 'Unidentified',
    triageLevel: payload.triageLevel ?? 'immediate',
    location:    payload.location    ?? null,
    statusNotes: payload.statusNotes ?? null,
    responderId: payload.responderId ?? null,
    deviceId:    overrides.deviceId  ?? payload.deviceId ?? null,
    updatedAt:   overrides.updatedAt ?? new Date().toISOString(),
    version:     overrides.version   ?? 1,
    deleted:     payload.deleted     ? 1 : 0,
    vectorClock: overrides.vectorClock ?? {},
  };
}

// ─── Vector Clock helpers ─────────────────────────────────────────────────────

/**
 * Increment device's clock entry by 1.
 *
 * @param {object} vc
 * @param {string} deviceId
 * @returns {object}
 */
function _tickVC(vc, deviceId) {
  if (!deviceId) return vc;
  const next = { ...vc };
  next[deviceId] = (next[deviceId] ?? 0) + 1;
  return next;
}

/**
 * Merge two vector clocks by taking the max of each device's counter,
 * then tick the resulting clock for the current device.
 *
 * @param {object} serverVC
 * @param {object} clientVC
 * @param {string} deviceId
 * @returns {object}
 */
function _mergeVC(serverVC, clientVC, deviceId) {
  const merged = { ...serverVC };
  for (const [dev, counter] of Object.entries(clientVC)) {
    merged[dev] = Math.max(merged[dev] ?? 0, counter);
  }
  return _tickVC(merged, deviceId);
}

/**
 * Shallow equality check over the mutable user-facing fields of a record.
 * Used to detect idempotent duplicates.
 */
function _payloadsEqual(serverRecord, clientPayload) {
  const fields = ['victimName', 'triageLevel', 'location', 'statusNotes', 'responderId'];
  return fields.every(
    (f) => (serverRecord[f] ?? null) === (clientPayload[f] ?? null)
  );
}

/**
 * Wipes all records from the SQLite database (for demo resets).
 */
export function clearAllRecords() {
  _assertReady();
  _db.run('DELETE FROM records');
  _persist();
}

/**
 * Injects or updates a record to create a high-version server record
 * from "Device-Tablet-02" to trigger a multi-device conflict.
 */
export function injectConflictRecord(targetId) {
  _assertReady();
  const existing = targetId ? getRecordById(targetId) : null;
  const now = new Date().toISOString();
  const id = existing?.id || targetId || 'REC-CONFLICT-001';
  const newVersion = (existing?.version ?? 1) + 2;

  if (existing) {
    _runWrite(
      `UPDATE records SET
        victimName  = :vn,
        triageLevel = :tl,
        location    = :loc,
        statusNotes = :sn,
        responderId = :ri,
        deviceId    = :di,
        updatedAt   = :ua,
        version     = :v,
        deleted     = 0,
        vectorClock = :vc
       WHERE id = :id`,
      {
        ':vn':  existing.victimName || 'Marcus Ramirez',
        ':tl':  'immediate', // Conflicting triage level: RED
        ':loc': 'Sector 4 - Intensive Care Transit Unit',
        ':sn':  'OVERRIDE BY Device-Tablet-02: Vital signs deteriorating rapidly. SpO2 84%, tension pneumothorax detected.',
        ':ri':  'Dr. Morales (Tablet-02)',
        ':di':  'Device-Tablet-02',
        ':ua':  now,
        ':v':   newVersion,
        ':vc':  JSON.stringify({ 'Device-Tablet-02': newVersion }),
        ':id':  id,
      }
    );
  } else {
    _insertRecord({
      id,
      victimName:  'Marcus Ramirez',
      triageLevel: 'immediate',
      location:    'Sector 4 - Intensive Care Transit Unit',
      statusNotes: 'OVERRIDE BY Device-Tablet-02: Vital signs deteriorating rapidly. SpO2 84%, tension pneumothorax detected.',
      responderId: 'Dr. Morales (Tablet-02)',
      deviceId:    'Device-Tablet-02',
      updatedAt:   now,
      version:     newVersion,
      deleted:     false,
      vectorClock: { 'Device-Tablet-02': newVersion },
    });
  }

  return getRecordById(id);
}

