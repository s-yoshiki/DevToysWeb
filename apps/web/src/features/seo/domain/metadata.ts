import type { Metadata } from 'next'
import type { ToolDefinition } from '@/features/tools/domain/catalog'
import { getDictionary, type Locale } from '@/i18n/dictionaries'
import { alternatesFor, ogImage, ogLocales, siteName } from './site'

const baseKeywords: Record<Locale, string[]> = {
  ja: ['開発者ツール', 'オンラインツール', 'Webツール', '無料', 'ブラウザ完結', 'DevToys'],
  en: ['developer tools', 'online tools', 'web tools', 'free', 'browser based', 'DevToys'],
}

/**
 * Meta descriptions must stand alone in a search result, so the catalog's short
 * UI copy is expanded with the value proposition shared by every tool.
 */
export const toolDescription = (tool: ToolDefinition, locale: Locale) => {
  const { title, description } = tool
  return locale === 'ja'
    ? `${description.ja}。${title.ja}をブラウザだけで実行できる無料の開発者向けツールです。インストール不要で、入力したデータは端末の外に出ません。`
    : `${description.en}. A free developer tool that runs entirely in your browser — no install, and your input never leaves your device.`
}

const toolKeywords = (tool: ToolDefinition, locale: Locale) => [
  tool.title[locale],
  ...tool.pathSlug.split('-'),
  ...baseKeywords[locale],
]

type PageMetaInput = {
  locale: Locale
  path?: string
  title: string
  description: string
  keywords: string[]
  /** Omitted on the home pages, where the title already carries the site name. */
  absoluteTitle?: boolean
}

const buildMetadata = ({
  locale,
  path = '',
  title,
  description,
  keywords,
  absoluteTitle = false,
}: PageMetaInput): Metadata => {
  const alternates = alternatesFor(locale, path)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates,
    openGraph: {
      type: 'website',
      siteName,
      locale: ogLocales[locale],
      url: alternates.canonical,
      title,
      description,
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export const homeMetadata = (locale: Locale): Metadata => {
  const { tagline, heroDescription } = getDictionary(locale)
  const title = `${siteName} · ${tagline}`

  return buildMetadata({
    locale,
    title,
    description: heroDescription,
    keywords: baseKeywords[locale],
    absoluteTitle: true,
  })
}

export const toolMetadata = (tool: ToolDefinition, locale: Locale): Metadata =>
  buildMetadata({
    locale,
    path: `${tool.category}/${tool.pathSlug}`,
    title: tool.title[locale],
    description: toolDescription(tool, locale),
    keywords: toolKeywords(tool, locale),
  })
