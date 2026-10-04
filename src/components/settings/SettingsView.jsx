import React, { useState } from 'react';
import {
  Globe,
  HardDrive,
  BookOpen,
  Trash2,
  CheckCircle,
  Languages,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';
import { clearLocalData } from '../../db/indexedDB';
import { useTranslation } from '../../i18n/LanguageContext';

export function SettingsView({
  emergencyMode = false,
  setEmergencyMode,
  pendingCount = 0,
  recordsCount = 0,
  isOnline = true,
  onResetData,
}) {
  const { language, setLanguage, t, languages } = useTranslation();
  const [clearing, setClearing] = useState(false);
  const [deviceId] = useState(() => localStorage.getItem('resqsync_device_id') || 'DEV-FIELD-01');

  const LANGUAGE_NOTES = {
    en: 'Primary operational language for central command',
    ml: 'കേരള സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി & വയനാട് പ്രാദേശിക ഭാഷ',
    hi: 'राष्ट्रीय आपदा प्रबंधन बल (NDRF) मानक कमान',
    ta: 'தமிழ்நாடு பேரிடர் மீட்புப் படை & பிராந்திய ஒருங்கிணைப்பு',
    bn: 'পূর্বাঞ্চলীয় ফিল্ড কোঅর্ডিনেশন ও মেডিকেল স্টাফ',
    mr: 'पश्चिम विभाग आपत्कालीन प्रतिसाद मानक',
  };

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
            {t('appLanguage', 'Application Language & Indic Scripts')}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          {t('selectLanguageDesc', 'Select primary language for triage labels, map sector notes, and tactical manifests. Offline-capable Indic scripts.')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-2xl border text-left transition-all min-h-[72px] shadow-soft ${
                  isSelected
                    ? 'border-coral bg-coral-light/70 text-ink ring-2 ring-coral font-bold'
                    : 'border-outline hover:border-coral/50 text-ink bg-white hover:bg-surface-secondary'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-bold">{lang.native}</span>
                  </div>
                  {isSelected && (
                    <span className="text-coral text-xs font-black px-2 py-0.5 rounded-full bg-white border border-coral/30">
                      ✓ ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs text-coral-dark font-medium">{lang.name}</div>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug line-clamp-2">
                  {LANGUAGE_NOTES[lang.code] || lang.name}
                </p>
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
            {t('deviceStorage', 'Field Storage & Terminal Diagnostics')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Local Casualties Cached</span>
            <span className="text-xl font-black text-ink font-mono">{recordsCount} records</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Pending Outbox Sync</span>
            <span className="text-xl font-black text-[#E5A33D] font-mono">{pendingCount} mutations</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary border border-outline">
            <span className="text-ink-muted block mb-1">Terminal Device UUID</span>
            <span className="text-xs font-mono font-bold text-ink truncate block mt-1" title={deviceId}>
              {deviceId.slice(0, 16)}...
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-xs text-ink-muted leading-relaxed">
            {t('deviceStorageDesc', 'All casualty entries are preserved locally on this device in IndexedDB.')}
          </p>

          <UX4GButton
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleWipeStorage}
            disabled={clearing}
            className="shrink-0"
          >
            {clearing ? 'Resetting...' : t('purgeLocalData', 'Reset Local Database')}
          </UX4GButton>
        </div>
      </section>

    </div>
  );
}

export default SettingsView;
