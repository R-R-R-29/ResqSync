/**
 * server/server.js
 *
 * ResqSync field server — Express REST + WebSocket push.
 *
 * Endpoints
 * ─────────
 *  GET  /api/health          Liveness probe
 *  GET  /api/records         All canonical (non-deleted) records
 *  POST /api/sync            Batch outbox flush with conflict detection
 *
 * WebSocket
 * ─────────
 *  ws://host:PORT/ws
 *  Broadcasts { type: 'RECORD_UPDATED', record } after every successful sync.
 *  Broadcasts { type: 'SYNC_CONFLICT',  conflict } so dashboards can surface
 *  unresolved conflicts in real-time.
 */

import express     from 'express';
import http        from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors        from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { initDB, getAllRecords, applyMutation, clearAllRecords, injectConflictRecord } from './database.js';

// ─── App & Transport ──────────────────────────────────────────────────────────

const app    = express();
const PORT   = Number(process.env.PORT ?? 3001);
const server = http.createServer(app);

// Shared WebSocket server — all clients connect to the same port
const wss = new WebSocketServer({ server, path: '/ws' });

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Optional: structured request logging (keeps server output readable in field)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── WebSocket Connection Manager ────────────────────────────────────────────

/** @type {Set<WebSocket>} */
const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  const clientAddr = req.socket.remoteAddress ?? 'unknown';
  console.log(`[WS] Field unit connected from ${clientAddr}. Total: ${clients.size}`);

  // Handshake frame — lets clients know the channel is live
  _send(ws, {
    type:       'CONNECTED',
    serverTime: new Date().toISOString(),
    message:    'ResqSync Command Center linked — real-time push active',
  });

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'PING') _send(ws, { type: 'PONG', timestamp: Date.now() });
    } catch {
      _send(ws, { type: 'ERROR', message: 'Malformed JSON payload' });
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Unit disconnected. Remaining: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.warn('[WS] Socket error:', err.message);
    clients.delete(ws);
  });
});

/**
 * Send a JSON frame to a single client (swallows errors silently so a
 * broken socket never crashes the server).
 */
function _send(ws, payload) {
  if (ws.readyState !== WebSocket.OPEN) return;
  try { ws.send(JSON.stringify(payload)); } catch { /* ignore */ }
}

/**
 * Broadcast a JSON frame to every connected client, optionally excluding the
 * originating sender.
 *
 * @param {object}    payload
 * @param {WebSocket} [exclude]
 */
function broadcast(payload, exclude = null) {
  const frame = JSON.stringify(payload);
  for (const client of clients) {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      try { client.send(frame); } catch { /* ignore */ }
    }
  }
}

// ─── REST Endpoints ───────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Liveness probe — also exposes how many WS clients are currently connected.
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status:        'ok',
    serverTime:    new Date().toISOString(),
    service:       'ResqSync Field Server',
    engine:        'sql.js (WebAssembly SQLite)',
    activeSockets: clients.size,
  });
});

/**
 * GET /api/records
 * Returns all non-deleted canonical records sorted by triage severity.
 */
app.get('/api/records', (_req, res) => {
  try {
    const data = getAllRecords();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[GET /api/records]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/sync
 *
 * Accepts a batch of outbox mutations from a field device and resolves each
 * one using version / vectorClock conflict detection.
 *
 * Request body:
 * {
 *   mutations: [
 *     { recordId, action, payload, deviceId, version, vectorClock? }
 *   ]
 * }
 *
 * Response body:
 * {
 *   processed: number,
 *   results: [
 *     // ACK  → record successfully applied
 *     { queueId, recordId, status: 'ACK',     record }
 *     // CONFLICT → caller must present resolution UI
 *     { queueId, recordId, status: 'CONFLICT', serverRecord, clientPayload }
 *     // ERROR → unexpected server-side failure for this item
 *     { queueId, recordId, status: 'ERROR',    error }
 *   ]
 * }
 */
app.post('/api/sync', (req, res) => {
  const mutations = req.body?.mutations ?? req.body?.items ?? [];

  if (!Array.isArray(mutations) || mutations.length === 0) {
    return res.status(400).json({
      success: false,
      error:   'Request body must include a non-empty "mutations" array',
    });
  }

  const results = [];

  for (const mutation of mutations) {
    const { queueId, recordId } = mutation;

    // Validate minimum required fields
    if (!recordId) {
      results.push({ queueId, recordId, status: 'ERROR', error: 'recordId is required' });
      continue;
    }

    try {
      const outcome = applyMutation(mutation);

      results.push({ queueId, recordId, ...outcome });

      if (outcome.status === 'ACK' || outcome.status === 'DELETED') {
        // Push the accepted record to every connected dashboard / field unit
        broadcast({
          type:            'RECORD_UPDATED',
          record:          outcome.record,
          serverTimestamp: new Date().toISOString(),
        });
      } else if (outcome.status === 'CONFLICT') {
        // Notify all clients of the unresolved conflict so dashboards can act
        broadcast({
          type:            'SYNC_CONFLICT',
          conflict:        { serverRecord: outcome.serverRecord, clientPayload: outcome.clientPayload },
          serverTimestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`[POST /api/sync] Error on recordId=${recordId}:`, err);
      results.push({ queueId, recordId, status: 'ERROR', error: err.message });
    }
  }

  // Summarise outcome counts for the client's sync engine
  const summary = results.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  res.json({
    success:   true,
    processed: mutations.length,
    summary,
    results,
  });
});

/**
 * POST /api/demo/clear
 * Resets SQLite records table for clean demo testing.
 */
app.post('/api/demo/clear', (_req, res) => {
  try {
    clearAllRecords();
    broadcast({ type: 'DATA_REFRESHED', message: 'Database reset by demo controller' });
    res.json({ success: true, message: 'Server database wiped successfully' });
  } catch (err) {
    console.error('[POST /api/demo/clear]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/demo/conflict
 * Injects a conflicting version from "Device-Tablet-02" to test 3-way conflict resolution.
 */
app.post('/api/demo/conflict', (req, res) => {
  try {
    const { recordId } = req.body || {};
    const serverRecord = injectConflictRecord(recordId);

    // Simulated local client version with lower version / conflicting triage
    const clientPayload = {
      id:              serverRecord.id,
      victimName:      serverRecord.victimName,
      triageLevel:     'delayed', // Local responder triaged as YELLOW
      triage_category: 'delayed',
      location:        'Sector 4 - Stairwell B, East Tower',
      statusNotes:     'Local Responder: Conscious, stable breathing, splint applied to left femur.',
      responderId:     'FIELD-UNIT-1',
      deviceId:        'Device-Phone-01',
      version:         1,
      updatedAt:       new Date(Date.now() - 60000).toISOString(),
    };

    // Broadcast conflict to all dashboards
    broadcast({
      type:            'SYNC_CONFLICT',
      conflict:        { serverRecord, clientPayload },
      serverTimestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Conflict injected successfully from Device-Tablet-02',
      conflict: { serverRecord, clientPayload },
    });
  } catch (err) {
    console.error('[POST /api/demo/conflict]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function start() {
  try {
    await initDB();   // sql.js must fully init before we handle any request

    server.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════════════╗');
      console.log('║  🚨  ResqSync Disaster Response Server               ║');
      console.log(`║  REST   http://localhost:${PORT}/api                  ║`);
      console.log(`║  WS     ws://localhost:${PORT}/ws                     ║`);
      console.log('║  DB     sql.js (WebAssembly SQLite, disk-persisted)  ║');
      console.log('╚══════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (err) {
    console.error('[ResqSync] Fatal startup error:', err);
    process.exit(1);
  }
}

start();
