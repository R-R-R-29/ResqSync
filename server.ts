import fs from 'fs';
import path from 'path';
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { initDB, getAllRecords, applyMutation, clearAllRecords, injectConflictRecord } from './server/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const server = http.createServer(app);

// Shared WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

app.use((req, _res, next) => {
  if (!req.path.startsWith('/@') && !req.path.startsWith('/node_modules') && !req.path.startsWith('/src')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// WebSocket Connection Manager
const clients = new Set<WebSocket>();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  const clientAddr = req.socket.remoteAddress ?? 'unknown';
  console.log(`[WS] Field unit connected from ${clientAddr}. Total: ${clients.size}`);

  _send(ws, {
    type: 'CONNECTED',
    serverTime: new Date().toISOString(),
    message: 'ResqSync Command Center linked — real-time push active',
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

function _send(ws: WebSocket, payload: any) {
  if (ws.readyState !== WebSocket.OPEN) return;
  try {
    ws.send(JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function broadcast(payload: any, exclude: WebSocket | null = null) {
  const frame = JSON.stringify(payload);
  for (const client of clients) {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      try {
        client.send(frame);
      } catch {
        /* ignore */
      }
    }
  }
}

// ─── REST Endpoints ───────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    service: 'ResqSync Field Server',
    engine: 'sql.js (WebAssembly SQLite)',
    activeSockets: clients.size,
  });
});

app.get('/api/records', (_req, res) => {
  try {
    const data = getAllRecords();
    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error('[GET /api/records]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sync', (req, res) => {
  const mutations = req.body?.mutations ?? req.body?.items ?? [];

  if (!Array.isArray(mutations) || mutations.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Request body must include a non-empty "mutations" array',
    });
  }

  const results: any[] = [];

  for (const mutation of mutations) {
    const { queueId, recordId } = mutation;

    if (!recordId) {
      results.push({ queueId, recordId, status: 'ERROR', error: 'recordId is required' });
      continue;
    }

    try {
      const outcome = applyMutation(mutation);
      results.push({ queueId, recordId, ...outcome });

      if (outcome.status === 'ACK' || outcome.status === 'DELETED') {
        broadcast({
          type: 'RECORD_UPDATED',
          record: outcome.record,
          serverTimestamp: new Date().toISOString(),
        });
      } else if (outcome.status === 'CONFLICT') {
        broadcast({
          type: 'SYNC_CONFLICT',
          conflict: { serverRecord: outcome.serverRecord, clientPayload: outcome.clientPayload },
          serverTimestamp: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error(`[POST /api/sync] Error on recordId=${recordId}:`, err);
      results.push({ queueId, recordId, status: 'ERROR', error: err.message });
    }
  }

  const summary = results.reduce((acc: Record<string, number>, r: any) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    processed: mutations.length,
    summary,
    results,
  });
});

app.post('/api/demo/clear', (_req, res) => {
  try {
    clearAllRecords();
    broadcast({ type: 'DATA_REFRESHED', message: 'Database reset by demo controller' });
    res.json({ success: true, message: 'Server database wiped successfully' });
  } catch (err: any) {
    console.error('[POST /api/demo/clear]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/demo/conflict', (req, res) => {
  try {
    const { recordId } = req.body || {};
    const serverRecord = injectConflictRecord(recordId);

    const clientPayload = {
      id: serverRecord.id,
      victimName: serverRecord.victimName,
      triageLevel: 'delayed',
      triage_category: 'delayed',
      location: 'Meppadi Junction • Relief Post 1',
      statusNotes: 'Inspector Rajesh Nair (NDRF QRT): Conscious, compound fracture on right leg splinted and dressed. Vitals steady.',
      responderId: 'Inspector Rajesh Nair (NDRF QRT)',
      deviceId: 'Handset-Field-01',
      version: 1,
      updatedAt: new Date(Date.now() - 60000).toISOString(),
    };

    broadcast({
      type: 'SYNC_CONFLICT',
      conflict: { serverRecord, clientPayload },
      serverTimestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Conflict injected successfully between Field Unit 1 and Ambulance Unit 4',
      conflict: { serverRecord, clientPayload },
    });
  } catch (err: any) {
    console.error('[POST /api/demo/conflict]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Frontend Serving: Vite dev middlewares or static production ────────────

const isProduction = process.env.NODE_ENV === 'production';

async function setupFrontend() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }
}

async function start() {
  try {
    await initDB();
    await setupFrontend();

    server.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════════════╗');
      console.log('║  🚨  ResqSync Emergency Triage Server                ║');
      console.log(`║  HTTP & WS listening on http://0.0.0.0:${PORT}          ║`);
      console.log('╚══════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (err) {
    console.error('[ResqSync] Fatal startup error:', err);
    process.exit(1);
  }
}

start();
