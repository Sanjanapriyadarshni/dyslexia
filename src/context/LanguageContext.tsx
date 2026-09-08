import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTranslation } from '../i18n';
import { DEFAULT_LANGUAGE, getLanguageConfig, SUPPORTED_LANGUAGES } from '../i18n/languages';
import type { LanguageCode, LanguageConfig } from '../types';
import { soundEngine, speakText } from '../hooks/useSound';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  languageConfig: LanguageConfig;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  languages: LanguageConfig[];
  playLanguageAudio: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'akshai_selected_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
    }
    return DEFAULT_LANGUAGE.code;
  });

  const languageConfig = getLanguageConfig(currentLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = languageConfig.direction;
    }
  }, [currentLanguage, languageConfig]);

  const setLanguage = (code: LanguageCode) => {
    setCurrentLanguageState(code);
    soundEngine.playPop();
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(currentLanguage, key, params);
  };

  const playLanguageAudio = (code: LanguageCode) => {
    const target = getLanguageConfig(code);
    speakText(target.sampleGreeting, code);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageConfig,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        playLanguageAudio,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
