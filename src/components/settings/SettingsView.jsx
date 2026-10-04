import React, { useState } from 'react';
import {
  Settings,
  Globe,
  HardDrive,
  Cpu,
  BookOpen,
  CheckCircle2,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Activity,
  Heart,
  Wind,
  Brain,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';
import { clearLocalData } from '../../db/indexedDB';

export function SettingsView({
  activeLanguage = 'en',
  setLanguage,
  emergencyMode = false,
  setEmergencyMode,
  pendingCount = 0,
  recordsCount = 0,
  isOnline = true,
  onResetData,
}) {
  const [clearing, setClearing] = useState(false);
  const [deviceId] = useState(() => localStorage.getItem('resqsync_device_id') || 'DEV-ALPHA-01');

  const LANGUAGES = [
    { code: 'en', name: 'English (Default)', note: 'Primary operational language' },
    { code: 'hi', name: 'हिन्दी (Hindi)', note: 'राष्ट्रीय आपदा प्रबंधन मानक' },
    { code: 'bn', name: 'বাংলা (Bengali)', note: 'পূর্বাঞ্চলীয় ফিল্ড কোঅর্ডিনেশন' },
    { code: 'mr', name: 'मराठी (Marathi)', note: 'आपत्कालीन प्रतिसाद मानक' },
    { code: 'ta', name: 'தமிழ் (Tamil)', note: 'பேரிடர் மீட்பு வழிகாட்டி' },
  ];

  const handleWipeStorage = async () => {
    if (!window.confirm('Wipe local IndexedDB and outbox queue?')) return;
    setClearing(true);
    try {
      await clearLocalData();
      if (onResetData) onResetData();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      
      {/* ── 1. Multilingual Support (UX4G Standard) ── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Globe className="w-5 h-5 text-aid-primary" aria-hidden="true" />
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            UX4G Indic Language Standards
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Government of India digital service guidelines require all mission-critical disaster interfaces to support non-clipping Indic script rendering.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-xl border text-left transition-all min-h-[52px] ${
                  isSelected
                    ? 'border-aid-primary bg-aid-light dark:bg-slate-800 text-aid-primary ring-2 ring-aid-primary/20 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">{lang.name}</span>
                  {isSelected && <span className="text-aid-primary text-xs font-black">✓ ACTIVE</span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{lang.note}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2. Device Identity & Offline Storage Inspector ── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <HardDrive className="w-5 h-5 text-aid-primary" aria-hidden="true" />
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            Local Storage & Field Terminal Diagnostics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Local Casualties Cached</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{recordsCount} records</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Pending Outbox Queue</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{pendingCount} mutations</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block mb-1">Terminal Device UUID</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono truncate block">{deviceId}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Engine: IndexedDB (ResqSyncDB v1) + Workbox PWA Service Worker
          </span>

          <UX4GButton
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleWipeStorage}
            disabled={clearing}
          >
            {clearing ? 'Wiping...' : 'Clear Local Cache'}
          </UX4GButton>
        </div>
      </section>

      {/* ── 3. START Emergency Triage Standard (Medical Cheat Sheet) ── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-5 h-5 text-aid-primary" aria-hidden="true" />
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            Simple Triage & Rapid Treatment (START) Reference Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40">
            <span className="font-black text-red-700 dark:text-red-300 block mb-1">🔴 IMMEDIATE</span>
            <p className="text-slate-700 dark:text-slate-300">
              Respiration &gt; 30/min, radial pulse absent, or unable to follow commands. Immediate evacuation.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40">
            <span className="font-black text-amber-700 dark:text-amber-300 block mb-1">🟡 DELAYED</span>
            <p className="text-slate-700 dark:text-slate-300">
              Respiration &lt; 30/min, radial pulse present, follows simple commands. Serious, non-immediate.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40">
            <span className="font-black text-emerald-700 dark:text-emerald-300 block mb-1">🟢 MINOR</span>
            <p className="text-slate-700 dark:text-slate-300">
              Walking wounded. Able to follow directions to designated triage collection point.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <span className="font-black text-slate-800 dark:text-slate-200 block mb-1">⬛ EXPECTANT</span>
            <p className="text-slate-700 dark:text-slate-300">
              Apneic after airway positioning, pulseless. Palliative care or deceased identification.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default SettingsView;
