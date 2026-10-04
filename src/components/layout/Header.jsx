import React, { useState } from 'react';
import {
  Radio,
  Globe,
  Activity,
  Plus,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useTranslation } from '../../i18n/LanguageContext';

export function Header({
  emergencyMode = false,
  setEmergencyMode,
  onOpenIntake,
  pendingCount = 0,
  conflictCount = 0,
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t, languages } = useTranslation();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E6E1DD] shadow-soft transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Emergency Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-coral flex items-center justify-center text-white shadow-aid-raised shrink-0">
              <Radio className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-black text-ink tracking-tight">
                  {t('brandName', 'ResqSync')}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-coral-light text-coral border border-coral-light">
                  {t('sectorDesk', 'NDRF Sector Desk')}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted font-medium hidden sm:block">
                {t('headerSub', 'Offline Field Triage & Casualty Coordinator • Wayanad')}
              </p>
            </div>
          </div>

          {/* Right Action Tools: Emergency Mode Toggle + Language + Quick Intake */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* PWA Install Button (auto-hides when installed) */}
            <PWAInstallButton className="hidden lg:flex" />

            {/* Emergency Mode Switch (Glove-Friendly / High Stress Mode) */}
            <button
              id="emergency-mode-toggle"
              onClick={() => setEmergencyMode((v) => !v)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition min-h-[42px] ${
                emergencyMode
                  ? 'bg-coral text-white border-coral-dark shadow-emergency-glow ring-2 ring-coral-light'
                  : 'bg-surface-secondary hover:bg-[#EAE6E2] text-ink border-outline'
              }`}
              title="Toggle Large Touch Targets & High Contrast for Field Operations"
              aria-pressed={emergencyMode}
            >
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{t('emergencyMode', 'Emergency Mode')}:</span>
              <span>{emergencyMode ? t('emergencyModeOn', 'ON (56px)') : t('emergencyModeOff', 'OFF')}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface-secondary hover:bg-[#EAE6E2] border border-outline text-xs font-bold min-h-[42px] text-ink transition"
                aria-label="Select Language"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-coral shrink-0" aria-hidden="true" />
                <span className="font-bold">{currentLang.native}</span>
                <span className="text-[10px] text-ink-muted font-mono uppercase">({currentLang.code})</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-outline rounded-2xl shadow-soft-md py-1.5 z-50 animate-in fade-in">
                  <div className="px-3.5 py-2 text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-[#F3F1EF] flex items-center justify-between">
                    <span>{t('appLanguage', 'Indic Languages')}</span>
                    <span className="text-[9px] text-coral font-bold font-mono">6 ACTIVE</span>
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-medium hover:bg-surface-secondary flex items-center justify-between transition ${
                        language === l.code ? 'text-coral font-bold bg-coral-light/60' : 'text-ink'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{l.flag}</span>
                        <div>
                          <div className="font-bold">{l.native}</div>
                          <div className="text-[10px] text-ink-muted">{l.name}</div>
                        </div>
                      </div>
                      {language === l.code && <span className="text-coral font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Intake Button */}
            {onOpenIntake && (
              <UX4GButton
                variant="primary"
                size={emergencyMode ? 'lg' : 'sm'}
                icon={Plus}
                onClick={onOpenIntake}
                emergencyMode={emergencyMode}
                className="shadow-sm shrink-0"
              >
                <span className="hidden sm:inline">{t('rapidIntake', 'Rapid Intake')}</span>
                <span className="sm:hidden">{t('rapidIntake', 'Intake')}</span>
              </UX4GButton>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
