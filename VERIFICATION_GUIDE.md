# ResqSync — Verification & Hackathon Judging Guide

Welcome to **ResqSync**, an offline-first disaster response and tactical triage coordination Progressive Web App (PWA).

This guide provides step-by-step instructions to verify the zero-network resiliency, outbox queuing, automatic synchronization, and multi-device 3-way conflict resolution.

---

## 🛠 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Concurrently launches both the Express backend server (`:3001`) and the Vite React PWA client (`:5173`). |
| `npm run server` | Starts only the Express + WebSocket SQLite backend on `http://localhost:3001`. |
| `npm run client` | Starts the Vite development server on `http://localhost:5173`. |
| `npm run build` | Compiles the production PWA bundle and generates the Workbox service worker (`dist/sw.js`). |
| `npm run preview` | Serves the production PWA bundle locally for lighthouse audits and standalone testing. |

---

## 📱 PWA Configuration Summary

- **App Name**: `ResqSync Triage Coordinator`
- **Short Name**: `ResqSync`
- **Theme & Splash Color**: `#0f172a` (Tactical Emergency Slate)
- **Service Worker Engine**: Workbox with `registerType: 'autoUpdate'`, precaching application shell and caching `/api` routes with `NetworkFirst` fallback strategy.
- **Icons**: `192x192` and `512x512` high-contrast emergency beacon assets configured in `public/icons/` and `manifest.webmanifest`.

---

## 🧪 5-Step Hackathon Verification Walkthrough

You can test all scenarios using the **Judge Sandbox Controls** toolbar docked at the bottom of the screen.

### 1. Offline PWA Launch
1. Open the application in Google Chrome or Microsoft Edge at `http://localhost:5173`.
2. Notice the browser address bar prompt allows installing **ResqSync Triage Coordinator** as a standalone desktop/mobile app.
3. Open Developer Tools (`F12`), switch to the **Application** tab:
   - Under **Manifest**: Verify Name (`ResqSync Triage Coordinator`), Theme Color (`#0f172a`), and Icons.
   - Under **Service Workers**: Verify `sw.js` is active and running.
   - Under **Storage → IndexedDB**: Inspect `ResqSyncDB` containing the `records` and `outbox_queue` object stores.
4. Reload the page while simulating offline in DevTools Network tab — the application shell loads instantly from cache.

---

### 2. Offline Field CRUD Operations
1. In the bottom **Judge Sandbox Controls** toolbar, click:
   - 🔘 **`Toggle Simulated Offline`**
2. Notice:
   - The top banner flashes: `Field Disconnected: Zero-network mode active. All patient intake and triage edits are saved to IndexedDB outbox.`
   - The navbar status badge switches to: 🟠 **`Offline (0 Queued)`**.
3. In the **Rapid Victim Intake** form:
   - Enter Victim Name: `Elena Vance` (or click `Generate ID`).
   - Enter Location: `Sector 4 - Subway Tunnel B`.
   - Enter Clinical Notes: `Airway compromised, rapid respiration 36/m, weak carotid pulse.`
   - Select Triage Level: 🔴 **RED** (`Immediate Triage`).
   - Click **`Commit Victim Record`**.
4. The record immediately appears in the dashboard grid with:
   - High-contrast red emergency accent border.
   - Animated status badge: ⚡ **`QUEUED OFFLINE`**.
5. Test Inline Edit:
   - Click **`Edit`** on Elena Vance's card.
   - Update notes: `Intubated in field, bleeding stabilized.`
   - Click **`Save`**.
   - Notice the edit is committed to IndexedDB locally without network errors!
6. Test Soft-Delete:
   - Record a test victim, then click the trash icon and confirm.
   - Notice the soft-deletion is stamped locally and recorded in the outbox as a `DELETE` mutation.

---

### 3. Outbox Queuing Inspection
1. While still offline, view the outbox counter:
   - The top alert strip and toolbar show `N Queued in Outbox`.
2. Open DevTools → **Application** → **IndexedDB** → **`ResqSyncDB`** → **`outbox_queue`**:
   - Each mutation is logged chronologically with `action` (`CREATE`, `UPDATE`, or `DELETE`), `deviceId`, `timestamp`, and full patient payload.
   - `status` is marked as `'PENDING'`.

---

### 4. Automatic Re-Sync on Reconnect
1. In the bottom toolbar, click:
   - 🔘 **`Resume Live Sync (Go Online)`**
2. Observe the automatic transition:
   - The status badge transitions to 🟡 **`Syncing (N Pending)`** with an animated spinner.
   - The outbox items are batched and dispatched to `POST /api/sync`.
   - Server validates vector clocks and writes to disk-persisted SQLite (`server/resqsync_server.db`).
   - After server ACKs, the card badges flip to 🟢 **`SYNCED`**.
   - Outbox count drops to `0`.
   - The status badge turns 🟢 **`Online (Synced)`**.

---

### 5. Multi-Device 3-Way Conflict Resolution
1. In the bottom **Judge Sandbox Controls** toolbar, click:
   - ⚡ **`Simulate Multi-Device Conflict`**
2. An update from remote field unit **`Device-Tablet-02`** is injected concurrently.
3. The **3-Way Multi-Device Conflict Modal** instantly appears:
   - **Remote Version (`Device-Tablet-02`)**: Displays remote override (e.g. `RED - Immediate: Vital signs deteriorating rapidly. SpO2 84%, tension pneumothorax detected`).
   - **Local Version (`Device-Phone-01`)**: Displays local assessment (e.g. `YELLOW - Delayed: Conscious, stable breathing, splint applied`).
4. Explore Resolution Options:
   - **Option A**: Click **`Accept Remote (Device-Tablet-02)`** to accept the incoming server override.
   - **Option B**: Click **`Keep Local Version (Force Push)`** to increment version and override server.
   - **Option C**: Switch to the **`3-Way Merge Editor`** tab to pick the triage category and synthesize clinical notes from both field responders, then click **`Commit 3-Way Merged Resolution`**.
5. The conflict is resolved, IndexedDB updates, and the card updates to the chosen canonical state!

---

### 6. Resetting Demo State
- In the bottom toolbar, click 🧹 **`Clear Demo Data`**.
- Both client IndexedDB (`ResqSyncDB`) and server SQLite database (`server/resqsync_server.db`) are wiped clean to restart testing anytime.
