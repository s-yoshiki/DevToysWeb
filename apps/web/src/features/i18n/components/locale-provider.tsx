'use client'

import { createContext, useContext } from 'react'
import type { Dictionary, Locale } from '../domain/dictionaries'

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
  return <LocaleContext.Provider value={{ locale, dictionary }}>{children}</LocaleContext.Provider>
}

export const useLocale = () => {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside LocaleProvider')
  return value
}
