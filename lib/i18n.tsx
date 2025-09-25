'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { en } from './dictionaries/en';
import { id } from './dictionaries/id';
import { ru } from './dictionaries/ru';

export type Lang = 'ru' | 'en' | 'id';

type TranslationVars = Record<string, unknown>;

type Translator = {
  (key: string, vars?: TranslationVars): string;
  (namespace: string, key: string, vars?: TranslationVars): string;
};

type I18nCtx = {
  lang: Lang;
  t: Translator;
  setLang: (l: Lang) => void; // ← гарантированно есть
};

const DEFAULT_LANG: Lang = 'ru';

const DICTIONARIES: Record<Lang, Record<string, string>> = {
  en,
  id,
  ru,
};

function composeKey(namespace: string, key: string) {
  const normalizedKey = key.replace(/_/g, '.');
  return `${namespace}.${normalizedKey}`;
}

function applyVars(template: string, vars?: TranslationVars) {
  if (!vars) return template;

  return template.replace(/\{\{(.*?)\}\}/g, (_, rawKey) => {
    const trimmedKey = String(rawKey).trim();
    const value = vars[trimmedKey];
    return value === undefined || value === null ? '' : String(value);
  });
}

function translate(lang: Lang, key: string, vars?: TranslationVars) {
  const dictionary = DICTIONARIES[lang] ?? DICTIONARIES[DEFAULT_LANG];
  const fallbackDictionary = DICTIONARIES[DEFAULT_LANG];
  const template = dictionary[key] ?? fallbackDictionary[key] ?? key;

  return applyVars(template, vars);
}

// Дефолт: русский, заглушка t, setLang-нооп (чтобы не падало до маунта)
const Ctx = createContext<I18nCtx>({
  lang: DEFAULT_LANG,
  t: (key: string) => key,
  setLang: () => {},
});

export function I18nProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // берём язык из localStorage при маунте (если есть)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved) setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {}
  }, []);

  const t: Translator = useMemo(() => {
    const translateWithLang = (key: string, vars?: TranslationVars) =>
      translate(lang, key, vars);

    const translator: Translator = (namespaceOrKey: string, maybeKeyOrVars?: unknown, maybeVars?: TranslationVars) => {
      if (typeof maybeKeyOrVars === 'string') {
        const fullKey = composeKey(namespaceOrKey, maybeKeyOrVars);
        return translateWithLang(fullKey, maybeVars);
      }

      return translateWithLang(namespaceOrKey, maybeKeyOrVars as TranslationVars | undefined);
    };

    return translator;
  }, [lang]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, setLang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
