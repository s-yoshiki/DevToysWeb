'use client'

import { useLocale } from '@/components/locale-provider'

/**
 * Picks the copy for the active locale. Keeps bilingual literals next to the
 * markup that renders them, which reads better than a dictionary entry for
 * strings that only ever appear in one place.
 */
export const useTranslate = () => {
  const { locale } = useLocale()
  return (ja: string, en: string) => (locale === 'ja' ? ja : en)
}
