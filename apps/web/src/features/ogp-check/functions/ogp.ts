export type OgpFieldStatus = 'ok' | 'missing' | 'optional'

export type OgpField = {
  key: string
  value: string | null
  required: boolean
  status: OgpFieldStatus
}

const openGraphKeys = [
  { key: 'og:title', required: true },
  { key: 'og:description', required: true },
  { key: 'og:image', required: true },
  { key: 'og:url', required: true },
  { key: 'og:type', required: false },
  { key: 'og:site_name', required: false },
  { key: 'og:locale', required: false },
  { key: 'og:image:alt', required: false },
]

const cardKeys = [
  { key: 'twitter:card', required: true },
  { key: 'twitter:title', required: false },
  { key: 'twitter:description', required: false },
  { key: 'twitter:image', required: false },
  { key: 'twitter:site', required: false },
  { key: 'twitter:creator', required: false },
]

const toFields = (page: Record<string, string>, keys: typeof openGraphKeys): OgpField[] =>
  keys.map(({ key, required }) => {
    const value = page[key] ?? null
    return {
      key,
      value,
      required,
      status: value ? 'ok' : required ? 'missing' : 'optional',
    }
  })

export const openGraphFields = (page: Record<string, string>) => toFields(page, openGraphKeys)
export const cardFields = (page: Record<string, string>) => toFields(page, cardKeys)

/**
 * What a social scraper would actually show, with the documented fallbacks:
 * X Cards fall back to Open Graph, and Open Graph falls back to the document.
 */
export const sharePreview = (page: Record<string, string>) => ({
  title: page['twitter:title'] ?? page['og:title'] ?? page.title ?? null,
  description: page['twitter:description'] ?? page['og:description'] ?? page.description ?? null,
  image: page['twitter:image'] ?? page['og:image'] ?? null,
  siteName: page['og:site_name'] ?? null,
  url: page['og:url'] ?? page.canonical ?? null,
  card: page['twitter:card'] ?? null,
})

/** Absolute form of a possibly relative metadata URL, or null when unusable. */
export const resolveAgainst = (value: string | null, base: string) => {
  if (!value) return null
  try {
    return new URL(value, base).toString()
  } catch {
    return null
  }
}
