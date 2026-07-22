'use client'

import { createContext, useContext, useEffect } from 'react'
import type { Dictionary, Locale } from '@/i18n/dictionaries'

const LocaleContext = createContext<{ locale: Locale; dictionary: Dictionary } | null>(null)

export const LocaleProvider = ({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode
  locale: Locale
  dictionary: Dictionary
}) => {
  // The `<html>` element lives in the root layout, which has no locale segment,
  // so the served markup always says `ja`. Correct it for assistive technology
  // and browser translation once the locale subtree mounts.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>
}

export const useLocale = () => {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside LocaleProvider')
  return value
}
