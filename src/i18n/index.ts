import { useCallback } from 'react'
import { create } from 'zustand'
import type { Language } from '../types'
import { bm, en, type TranslationKey } from './translations'

export type { TranslationKey }
export { bm, en }

const STORAGE_KEY = 'syntra:language'

function readStoredLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'en' || raw === 'bm') return raw
  } catch {
    /* private mode */
  }
  return 'bm'
}

function applyDocumentLanguage(lang: Language) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang === 'bm' ? 'ms' : 'en'
  }
}

interface LanguageState {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  lang: readStoredLanguage(),
  setLang: (lang) => {
    set({ lang })
    applyDocumentLanguage(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
  },
  toggleLang: () => {
    get().setLang(get().lang === 'bm' ? 'en' : 'bm')
  },
}))

applyDocumentLanguage(useLanguageStore.getState().lang)

export function translate(
  lang: Language,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const dictionary = lang === 'en' ? en : bm
  let value: string = dictionary[key]
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement))
    }
  }
  return value
}

export type Translate = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string

export function useI18n(): {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: Translate
} {
  const lang = useLanguageStore((state) => state.lang)
  const setLang = useLanguageStore((state) => state.setLang)
  const toggleLang = useLanguageStore((state) => state.toggleLang)

  const t = useCallback<Translate>(
    (key, vars) => translate(lang, key, vars),
    [lang],
  )

  return { lang, setLang, toggleLang, t }
}
