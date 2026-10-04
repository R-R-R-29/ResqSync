import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, SUPPORTED_LANGUAGES } from './translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  languages: SUPPORTED_LANGUAGES,
});

const STORAGE_KEY = 'resqsync_active_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return 'en';
  });

  const setLanguage = useCallback((langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Update HTML lang attribute on document
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Translate a key into the active language with English fallback
   */
  const t = useCallback(
    (key, fallback = '') => {
      const activeDict = translations[language] || translations.en;
      if (activeDict && activeDict[key] !== undefined) {
        return activeDict[key];
      }
      if (translations.en && translations.en[key] !== undefined) {
        return translations.en[key];
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
