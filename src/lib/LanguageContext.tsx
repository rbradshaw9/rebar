'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Lang = 'en' | 'es';
type Translations = typeof en;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: en,
  setLang: () => {},
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('rebar-lang') as Lang | null;
    if (stored === 'es') setLangState('es');
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('rebar-lang', l);
  };

  const toggle = () => setLang(lang === 'en' ? 'es' : 'en');

  const t = lang === 'es' ? (es as Translations) : en;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
