# ResqSync 🚨

**Tactical Offline-First Disaster Response & Triage Coordination Platform**

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Progressive Web App (PWA)** tooling for zero-latency field triage and seamless synchronization with central incident command posts.

---

## ⚡ Key Highlights

- **React 19 + Vite**: High-performance frontend with instant HMR and optimistic state handling.
- **PWA & Service Worker Pre-caching**: Guaranteed offline readiness under catastrophic connectivity loss via `vite-plugin-pwa` and Workbox.
- **High-Contrast Emergency Theme**: Specialized design tailored for low-visibility, high-stress field conditions based on the START disaster triage standard.
- **Offline Storage (`idb`)**: Local-first IndexedDB storage with an automated mutation sync queue.
- **Real-Time Link (`ws` + Express)**: Automatic dual-channel communication (WebSockets + REST fallback) with SQLite WAL backend.

---

## 🎨 Emergency High-Contrast Color Palette

The interface implements high-contrast triage classification colors:

| Category | Token | Hex Color | Clinical Context |
| :--- | :--- | :--- | :--- |
| **Dark Slate (Base)** | `resq-dark` | `#0f172a` | High-contrast dark background for eye strain reduction |
| **Immediate Triage** | `resq-immediate` | `#ef4444` | Red Tag — Critical, life-threatening, immediate intervention |
| **Delayed Triage** | `resq-delayed` | `#f59e0b` | Yellow Tag — Serious, transport required, non-immediate |
| **Minor Triage** | `resq-minor` | `#10b981` | Green Tag — Walking wounded, minor localized trauma |
| **Expectant Triage** | `resq-expectant` | `#334155` | Black Tag — Deceased or non-survivable injuries |

---

## 📂 Project Structure

```text
ResqSync/
├── public/
│   ├── favicon.svg
│   └── icons/
├── server/
│   ├── database.js          # SQLite WAL schema & prepared statements (better-sqlite3)
│   └── server.js            # Express REST API & WebSocket broadcast gateway
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Real-time network & sync status header
│   │   ├── TriageStats.jsx      # High-contrast 4-tier triage matrix
│   │   ├── TriageCard.jsx       # Vitals & trauma assessment card
│   │   └── TriageFormModal.jsx  # Rapid triage intake form modal
│   ├── db/
│   │   └── indexedDB.js         # Offline IndexedDB repository with idb
│   ├── hooks/
│   │   ├── useNetworkStatus.js  # Online/offline & sync queue monitor hook
│   │   └── useTriage.js         # Reactive triage data & category counters
│   ├── services/
│   │   └── syncService.js       # WebSocket link & batch queue flush engine
│   ├── App.jsx                  # Main Command Dashboard
│   ├── index.css                # Tailwind directives & emergency tokens
│   └── main.jsx                 # Entry point with PWA Service Worker hook
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Quickstart & Setup Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Full Stack (Client + Server concurrently)
```bash
npm run dev
```
- **Client (Vite PWA)**: [http://localhost:5173](http://localhost:5173)
- **Server (Express + WS)**: [http://localhost:3001](http://localhost:3001)
- **WebSocket Gateway**: `ws://localhost:3001/ws`

### 3. Run Components Individually
```bash
# Run backend only (with auto-reload)
npm run server

# Run frontend only
npm run client

# Production Build
npm run build
npm run preview
```
