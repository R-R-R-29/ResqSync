import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  Globe,
  Sliders,
  Shield,
  Activity,
  Plus,
  Zap,
} from 'lucide-react';
import { UX4GButton } from '../common/UX4GButton';

export function Header({
  emergencyMode = false,
  setEmergencyMode,
  activeLanguage = 'en',
  setLanguage,
  onOpenIntake,
  pendingCount = 0,
  conflictCount = 0,
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Emergency Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-aid-primary flex items-center justify-center text-white shadow-aid-raised shrink-0">
              <Radio className="w-5 h-5 animate-pulse" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  ResqSync
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-aid-light text-aid-primary border border-aid-border dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
                  UX4G · AidConnect
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Disaster Response & Tactical Triage Coordinator
              </p>
            </div>
          </div>

          {/* Right Action Tools: Emergency Mode Toggle + Language + Quick Intake */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Emergency Mode Switch (Glove-Friendly / High Stress Mode) */}
            <button
              id="emergency-mode-toggle"
              onClick={() => setEmergencyMode((v) => !v)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition min-h-[42px] ${
                emergencyMode
                  ? 'bg-aid-primary text-white border-red-700 shadow-emergency-glow ring-2 ring-red-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="Toggle Large Touch Targets & High Contrast for Field Operations"
              aria-pressed={emergencyMode}
            >
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Emergency Mode:</span>
              <span>{emergencyMode ? 'ON (56px)' : 'OFF'}</span>
            </button>

            {/* Language Switcher Dropdown (UX4G Multilingual) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-bold min-h-[42px] text-slate-700"
                aria-label="Select Language"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span className="uppercase">{activeLanguage}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    UX4G Indic Languages
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                        activeLanguage === l.code ? 'text-aid-primary font-bold bg-aid-light dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>{l.name}</span>
                      {activeLanguage === l.code && <span className="text-aid-primary">✓</span>}
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
                className="shadow-aid-raised shrink-0"
              >
                <span className="hidden sm:inline">Rapid Intake</span>
                <span className="sm:hidden">Intake</span>
              </UX4GButton>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
