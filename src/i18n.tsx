import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स' },

  // Home Page
  'home.welcome': { en: 'Welcome to StudyAI Planner', hi: 'StudyAI Planner में आपका स्वागत है' },
  'home.subtitle': { en: 'Your intelligent companion for academic success', hi: 'शैक्षणिक सफलता के लिए आपका बुद्धिमान साथी' },

  // Features
  'feature.study_planner': { en: 'Smart Study Planner', hi: 'स्मार्ट स्टडी प्लानर' },
  'feature.resources': { en: 'Educational Resources', hi: 'शैक्षिक संसाधन' },
  'feature.ai_tutor': { en: 'AI Tutor', hi: 'एआई ट्यूटर' },
  'feature.notes': { en: 'Notes', hi: 'नोट्स' },
  'feature.groups': { en: 'Group Study', hi: 'ग्रुप स्टडी' },
  'feature.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
  'feature.achievements': { en: 'Achievements', hi: 'उपलब्धियाँ' },
  'feature.ai_recommendations': { en: 'AI Recommendations', hi: 'एआई सिफारिशें' },

  // Common
  'common.save': { en: 'Save', hi: 'सेव करें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.edit': { en: 'Edit', hi: 'संपादित करें' },
  'common.delete': { en: 'Delete', hi: 'हटाएं' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.error': { en: 'An error occurred', hi: 'एक त्रुटि हुई' }
};

type Language = 'en' | 'hi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('studyai-language');
    if (saved && ['en', 'hi'].includes(saved)) {
      setLanguageState(saved as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('studyai-language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};