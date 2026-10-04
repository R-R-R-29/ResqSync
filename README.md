# ResqSync 🚨
### Offline-First Emergency Triage & Disaster Response Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8.svg?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![SQLite WASM](https://img.shields.io/badge/SQLite-sql.js-003B57.svg?logo=sqlite)](https://sql.js.org/)

**ResqSync** is a resilient, zero-data-loss emergency triage and field coordination platform designed to keep first responders, medical volunteers, and disaster command centers synchronized when cellular and electrical grids collapse.

Built specifically for high-stress crisis scenarios—such as flash floods, earthquakes, and landslides (e.g., the 2024 Wayanad disasters)—where conventional cloud-dependent applications fail.

---

## 🌟 Key Features

1. **Zero-Data-Loss Offline Operation**
   - Field paramedics can record casualty admissions, vitals (heart rate, respiration rate, SpO2, blood pressure), and clinical assessments even with 100% disconnected connectivity.
   - All mutations commit instantly to transactional client-side **IndexedDB (`idb`)** storage.

2. **Deterministic Outbox & Background Auto-Sync**
   - Edits made in the field are placed in a persistent Outbox queue.
   - Built-in network reachability detector monitors reconnectivity (Wi-Fi, LTE, or satellite mesh) and automatically flushes queued mutations in chronological order without manual intervention.

3. **3-Way Clinical Conflict Resolution**
   - When multiple field units or base hospital coordinators edit the same patient record concurrently while partitioned, ResqSync detects version collisions.
   - Provides a side-by-side **Clinical Merge Modal** displaying Server version vs. Local field edits, allowing emergency staff to pick, merge, or override fields safely without accidental overwrites.

4. **Interactive GIS Map & Offline Tactical Radar**
   - Integrated Google Maps Platform (`@vis.gl/react-google-maps`) for visual casualty pin plotting, relief camp zones, and emergency corridor status.
   - **Offline Fallback**: When network access is unavailable, automatically switches to a high-contrast tactical radar vector grid with clickable sector zones and hospital navigation coordinates.

5. **START Disaster Triage Protocol**
   - Standardized Simple Triage and Rapid Treatment (START) color tags:
     - 🔴 **Immediate (Red Tag)**: Life-threatening, immediate surgical or resuscitation intervention.
     - 🟡 **Delayed (Yellow Tag)**: Serious injury requiring transport, but stable for immediate delay.
     - 🟢 **Minor (Green Tag)**: Walking wounded, localized dressings and first-aid.
     - ⚫ **Expectant (Black Tag)**: Non-survivable trauma or deceased.

6. **Judge / Demo Sandbox Toolbar**
   - One-click interactive simulation controls docked in the dashboard:
     - 📶 **Simulate Offline**: Cuts network reachability to test the outbox queue.
     - ⚠️ **Simulate Conflict**: Injects a divergent server record to trigger the 3-Way merge modal.
     - ⚡ **Quick Intake**: Auto-populates disaster casualty scenarios for rapid demonstration.
     - 🔄 **Reset Demo Data**: Flushes IndexedDB and restores clean scenario data.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 6 | Rapid rendering, optimistic UI updates, modular hook architecture |
| **Styling** | Tailwind CSS, Lucide Icons | High-contrast emergency UI compliant with low-light field conditions |
| **Offline Cache** | `vite-plugin-pwa`, Workbox | App shell precaching, runtime asset offline caching |
| **Client Database** | IndexedDB via `idb` | ACID client transactions, casualty store & outbox mutation queue |
| **GIS & Mapping** | Google Maps Platform, `@vis.gl/react-google-maps` | Interactive satellite & terrain map, sector overlays, marker clustering |
| **Backend Server** | Node.js, Express 4, TypeScript (`tsx`) | Full-stack server proxy, REST sync endpoint (`/api/sync`) |
| **Server Database** | WebAssembly SQLite (`sql.js`) | In-memory relational storage with file persistence & atomic transactions |
| **Real-Time Push** | WebSockets (`ws`) | Instant bi-directional push broadcast between command and field units |

---

## 📁 Repository Structure

```text
resqsync/
├── public/                  # Favicons, emergency PWA icons, manifest
├── server/
│   ├── database.js          # SQLite WASM schema, atomic mutation logic & conflicts
│   └── testData.js          # Realistic disaster scenario seeds
├── src/
│   ├── components/
│   │   ├── map/
│   │   │   └── FieldSectorMap.jsx # Google Map + Offline Tactical Radar Grid
│   │   ├── ConflictModal.jsx      # 3-Way side-by-side clinical merge tool
│   │   ├── DemoToolbar.jsx        # Judge testing & simulation toolbar
│   │   ├── Header.jsx             # Real-time connectivity & queue counter
│   │   ├── TriageCard.jsx         # Casualty assessment & vitals card
│   │   ├── TriageFormModal.jsx    # Emergency intake form
│   │   └── TriageStats.jsx        # START protocol summary matrix
│   ├── db/
│   │   └── indexedDB.js           # IndexedDB schema, stores & transactions
│   ├── hooks/
│   │   ├── useNetworkStatus.js    # Heartbeat & outbox synchronization hook
│   │   ├── useOnlineStatus.js     # Native online/offline event listener
│   │   └── useTriage.js           # CRUD operations & optimistic state hooks
│   ├── services/
│   │   └── syncService.js         # WebSocket bridge & REST outbox flusher
│   ├── App.jsx                    # Central incident command dashboard
│   ├── index.css                  # Global Tailwind directives & emergency tokens
│   └── main.jsx                   # Entry point with PWA Service Worker registration
├── index.html               # PWA entry point with OpenGraph & emergency meta
├── server.ts                # Express backend + WebSocket gateway + Vite middleware
├── tailwind.config.js       # Custom emergency color palette tokens
├── vite.config.js           # Vite configuration with Workbox PWA manifest
└── package.json             # Scripts & dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/resqsync.git
cd resqsync
npm install
```

### 2. Environment Setup (Optional)
A demo Google Maps API key is pre-configured. To provide your own Google Maps API key:
```bash
cp .env.example .env
# Edit .env and set:
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Testing Offline Capabilities

1. **In-Browser Sandbox (Fastest)**:
   - Click the **"Simulate Offline"** button in the bottom toolbar.
   - The status banner turns amber: `Field Disconnected: Zero-network mode active`.
   - Click **"+ New Intake"**, add a casualty, and click submit. Notice the card appears instantly with an orange `QUEUED OFFLINE` badge.
   - Click **"Resume Online"**; the outbox flushes to the server, and the card transitions to synced state automatically.

2. **Chrome DevTools Throttling**:
   - Open DevTools (`F12`) $\rightarrow$ **Network** tab $\rightarrow$ Set throttling dropdown to **Offline**.
   - Use the app normally; all records save to IndexedDB.
   - Switch back to **No Throttling**; watch the WebSocket reconnect and outbox synchronize.

3. **Install as Mobile PWA**:
   - In Chrome/Safari, tap **"Add to Home Screen"** or **"Install App"**.
   - Launch from your home screen and turn on **Airplane Mode**. The application shell and tactical grid load completely offline.

---

## 📤 Pushing to Your GitHub Repository

To link and push this codebase to your own GitHub account:

```bash
# 1. Initialize git (if not already done)
git init
git branch -m main

# 2. Add your GitHub repository as remote origin
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git

# 3. Stage and commit all files
git add .
git commit -m "feat: complete ResqSync offline-first emergency triage platform"

# 4. Push to main branch
git push -u origin main
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
