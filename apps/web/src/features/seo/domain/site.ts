import type { Locale } from '@/features/i18n/domain/dictionaries'
import { locales } from '@/features/i18n/domain/dictionaries'

// Production origin served by CloudFront. Keep in sync with `hostedZoneName`
// in scripts/infra/bin/infra.ts.
export const siteUrl = 'https://devtoys.ex-foundry.com'
export const siteName = 'DevToys'

export const ogLocales: Record<Locale, string> = { ja: 'ja_JP', en: 'en_US' }

// A pre-rendered file rather than a `next/og` route: the static export writes
// image routes without a file extension, and `aws s3 sync` would then serve
// them as binary/octet-stream, which social scrapers reject.
export const ogImage = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: `${siteName} — a focused toolkit for everyday development`,
}

/** Absolute URL for a site-relative path, normalised to `trailingSlash: true`. */
export const absoluteUrl = (path: string) => {
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`
  return `${siteUrl}${normalized}`
}

/**
 * Canonical plus `hreflang` alternates for one page. `path` is the locale-less
 * remainder, e.g. `''` for a locale home or `converters/json-csv-converter`.
 */
export const alternatesFor = (locale: Locale, path = '') => {
  const suffix = path ? `/${path}` : ''
  const languages = Object.fromEntries(
    locales.map((other) => [other, absoluteUrl(`${other}${suffix}`)]),
  ) as Record<Locale, string>

  return {
    canonical: absoluteUrl(`${locale}${suffix}`),
    languages: { ...languages, 'x-default': absoluteUrl(`ja${suffix}`) },
  }
}
