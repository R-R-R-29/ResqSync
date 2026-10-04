import React, { useState } from 'react';
import {
  Globe,
  HardDrive,
  BookOpen,
  Trash2,
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
      
      {/* ── 1. Multilingual Support ── */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-outline shadow-soft space-y-3.5">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-[#F3F1EF]">
          <Globe className="w-5 h-5 text-coral" aria-hidden="true" />
          <h2 className="text-base sm:text-lg font-bold text-ink">
            Multilingual Language Support
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          Standard disaster interfaces support non-clipping multi-script typography for responders across regions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all min-h-[54px] shadow-soft ${
                  isSelected
                    ? 'border-coral bg-coral-light text-coral ring-2 ring-coral-light font-bold'
                    : 'border-outline hover:border-coral/50 text-ink bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{lang.name}</span>
                  {isSelected && <span className="text-coral text-xs font-bold">✓ ACTIVE</span>}
                </div>
                <p className="text-[11px] text-ink-muted mt-0.5">{lang.note}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 2. Device Identity & Offline Storage Inspector ── */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-outline shadow-soft space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-[#F3F1EF]">
          <HardDrive className="w-5 h-5 text-coral" aria-hidden="true" />
          <h2 className="text-base sm:text-lg font-bold text-ink">
            Field Storage & Terminal Diagnostics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Local Casualties Cached</span>
            <span className="text-xl font-black text-ink font-mono">{recordsCount} records</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Pending Outbox Queue</span>
            <span className="text-xl font-black text-[#E5A33D] font-mono">{pendingCount} mutations</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Terminal Device UUID</span>
            <span className="text-xs font-bold text-ink font-mono truncate block">{deviceId}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-ink-muted">
            Engine: IndexedDB (ResqSyncDB v1) + Vector Clock Sync Coordinator
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

      {/* ── 3. START Emergency Triage Standard (Medical Reference) ── */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-outline shadow-soft space-y-3.5">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-[#F3F1EF]">
          <BookOpen className="w-5 h-5 text-coral" aria-hidden="true" />
          <h2 className="text-base sm:text-lg font-bold text-ink">
            Simple Triage & Rapid Treatment (START) Reference Protocol
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-2xl border border-[#FBCBC4] bg-[#FDE3DF]">
            <span className="font-bold text-[#C94336] block mb-1">RED • IMMEDIATE</span>
            <p className="text-ink leading-relaxed">
              Respiration &gt; 30/min, radial pulse absent, or unable to follow commands. Immediate evacuation.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-[#FDE68A] bg-[#FEF3C7]">
            <span className="font-bold text-[#92400E] block mb-1">YELLOW • DELAYED</span>
            <p className="text-ink leading-relaxed">
              Respiration &lt; 30/min, radial pulse present, follows simple commands. Serious, non-immediate.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5]">
            <span className="font-bold text-[#065F46] block mb-1">GREEN • MINOR</span>
            <p className="text-ink leading-relaxed">
              Walking wounded. Able to follow directions to designated triage collection point.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-outline bg-surface-secondary">
            <span className="font-bold text-ink block mb-1">BLACK • EXPECTANT</span>
            <p className="text-ink leading-relaxed">
              Apneic after airway positioning, pulseless. Palliative care or deceased identification.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default SettingsView;
