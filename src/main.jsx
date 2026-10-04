import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register Service Worker for offline-first capabilities
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[ResqSync PWA] New version available, reloading for disaster updates...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[ResqSync PWA] App cached & ready to work offline in field operations!');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
