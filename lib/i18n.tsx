'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FALLBACK_LANG,
  LANG_STORAGE_KEY,
  dictionaries,
  normalizeLang,
  type Lang,
  type Namespace,
} from './locale';

type TranslateVars = Record<string, string | number>;

type TranslateFn = (ns: string, key: string, vars?: TranslateVars) => string;

type I18nCtx = {
  lang: Lang;
  t: TranslateFn;
  setLang: (lang: Lang) => void;
};

const STORAGE_KEY = LANG_STORAGE_KEY;

const Ctx = createContext<I18nCtx>({
  lang: FALLBACK_LANG,
  t: (_ns, key) => key,
  setLang: () => {},
});

let runtimeLang: Lang = FALLBACK_LANG;

type InitialResolution = {
  lang: Lang;
  fromStorage: boolean;
};

function applyVars(template: string, vars?: TranslateVars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, token) =>
    Object.prototype.hasOwnProperty.call(vars, token) ? String(vars[token]) : match,
  );
}

function resolveTemplate(lang: Lang, ns: string, key: string) {
  const namespace = dictionaries[lang]?.[ns as Namespace];
  return namespace?.[key];
}

function translateWith(lang: Lang, ns: string, key: string, vars?: TranslateVars) {
  const template =
    resolveTemplate(lang, ns, key) ??
    (lang !== FALLBACK_LANG ? resolveTemplate(FALLBACK_LANG, ns, key) : undefined) ??
    key;
  return applyVars(template, vars);
}

function readLangFromStorage(): Lang | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeLang(raw);
  } catch {
    return null;
  }
}

function detectBrowserLang(): Lang | null {
  if (typeof navigator === 'undefined') return null;
  const candidates: Array<string | undefined> = Array.isArray(navigator.languages)
    ? navigator.languages
    : [navigator.language];

  for (const raw of candidates) {
    if (!raw) continue;
    const normalized = normalizeLang(raw);
    if (normalized) return normalized;
    const base = raw.split?.('-')?.[0];
    const short = base && base !== raw ? normalizeLang(base) : null;
    if (short) return short;
  }
  return null;
}

function resolveInitialLang(initialLang: Lang): InitialResolution {
  if (typeof window === 'undefined') {
    return { lang: initialLang, fromStorage: false };
  }
  const stored = readLangFromStorage();
  if (stored) {
    return { lang: stored, fromStorage: true };
  }
  const browser = detectBrowserLang();
  if (browser) {
    return { lang: browser, fromStorage: false };
  }
  return { lang: initialLang, fromStorage: false };
}

function persistLang(lang: Lang) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}

function updateRuntimeLang(lang: Lang) {
  runtimeLang = lang;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('i18n:changed', { detail: lang }));
  }
}

export function I18nProvider({
  children,
  initialLang = FALLBACK_LANG,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const initialRef = useRef<InitialResolution>();
  if (!initialRef.current) {
    initialRef.current = resolveInitialLang(initialLang);
    runtimeLang = initialRef.current.lang;
  }

  const [lang, setLangState] = useState<Lang>(initialRef.current.lang);
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    updateRuntimeLang(langRef.current);
    if (!initialRef.current?.fromStorage) {
      persistLang(langRef.current);
      initialRef.current = { lang: langRef.current, fromStorage: true };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = normalizeLang(event.newValue);
      if (next && next !== langRef.current) {
        langRef.current = next;
        updateRuntimeLang(next);
        setLangState(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState((prev) => {
      if (prev === next) return prev;
      langRef.current = next;
      persistLang(next);
      updateRuntimeLang(next);
      return next;
    });
  }, []);

  const translate = useCallback<TranslateFn>(
    (ns, key, vars) => translateWith(langRef.current, ns, key, vars),
    [],
  );

  const value = useMemo<I18nCtx>(
    () => ({ lang, setLang, t: translate }),
    [lang, setLang, translate],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

export function t(ns: string, key: string, vars?: TranslateVars) {
  return translateWith(runtimeLang, ns, key, vars);
}
