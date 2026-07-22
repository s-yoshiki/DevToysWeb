import type { SiteReport } from '@/features/tools/api/diagnostics-client'
import type { Locale } from '@/i18n/dictionaries'

export type CheckLevel = 'pass' | 'warn' | 'fail'

export type SeoCheck = {
  id: string
  group: 'basics' | 'content' | 'social' | 'technical'
  label: Record<Locale, string>
  level: CheckLevel
  detail: string
}

/** Recommended title length in characters, beyond which search results truncate. */
export const titleRange = { min: 10, max: 60 }
export const descriptionRange = { min: 50, max: 160 }

const check = (
  id: string,
  group: SeoCheck['group'],
  ja: string,
  en: string,
  level: CheckLevel,
  detail: string,
): SeoCheck => ({ id, group, label: { ja, en }, level, detail })

const lengthLevel = (value: string, { min, max }: { min: number; max: number }): CheckLevel =>
  value.length >= min && value.length <= max ? 'pass' : 'warn'

/**
 * The on-page checks that can be answered from a single fetch. Everything here
 * is derived from the diagnose response — no extra requests, no crawling.
 */
export const auditSeo = (report: SiteReport): SeoCheck[] => {
  const { page, signals, http } = report
  const title = page.title ?? ''
  const description = page.description ?? ''
  const robots = page.robots ?? ''
  const noindex = /noindex/i.test(robots)
  const finalUrl = http.finalUrl || report.target
  const secure = finalUrl.startsWith('https://')

  return [
    check(
      'title',
      'basics',
      'タイトル',
      'Title',
      title ? lengthLevel(title, titleRange) : 'fail',
      title
        ? `${title.length} ${title.length === 1 ? 'character' : 'characters'} — ${title}`
        : 'No <title> element',
    ),
    check(
      'description',
      'basics',
      'メタディスクリプション',
      'Meta description',
      description ? lengthLevel(description, descriptionRange) : 'fail',
      description ? `${description.length} characters — ${description}` : 'No meta description',
    ),
    check(
      'canonical',
      'basics',
      'canonical',
      'Canonical URL',
      page.canonical ? 'pass' : 'warn',
      page.canonical ?? 'No rel="canonical" link',
    ),
    check(
      'robots',
      'basics',
      'インデックス許可',
      'Indexable',
      noindex ? 'fail' : 'pass',
      robots || 'No robots meta tag (indexable by default)',
    ),
    check(
      'h1',
      'content',
      'H1見出し',
      'H1 heading',
      signals.h1.length === 1 ? 'pass' : signals.h1.length === 0 ? 'fail' : 'warn',
      signals.h1.length ? `${signals.h1.length} found — ${signals.h1[0]}` : 'No H1 on the page',
    ),
    check(
      'h2',
      'content',
      'H2見出し',
      'H2 headings',
      signals.h2.length ? 'pass' : 'warn',
      signals.h2.length ? `${signals.h2.length} found` : 'No H2 headings',
    ),
    check(
      'image-alt',
      'content',
      '画像のalt属性',
      'Image alt text',
      signals.images.missingAlt === 0 ? 'pass' : 'warn',
      `${signals.images.missingAlt} of ${signals.images.total} images have no alt attribute`,
    ),
    check(
      'text-volume',
      'content',
      '本文の分量',
      'Content volume',
      signals.textLength >= 600 ? 'pass' : 'warn',
      `About ${signals.textLength} characters of text`,
    ),
    check(
      'og',
      'social',
      'OGPタグ',
      'Open Graph tags',
      page['og:title'] && page['og:image'] ? 'pass' : 'warn',
      page['og:title'] ? 'og:title present' : 'og:title is missing',
    ),
    check(
      'twitter',
      'social',
      'X Card',
      'X Card',
      page['twitter:card'] ? 'pass' : 'warn',
      page['twitter:card'] ?? 'No twitter:card tag',
    ),
    check(
      'lang',
      'technical',
      'lang属性',
      'Language attribute',
      signals.lang ? 'pass' : 'warn',
      signals.lang ?? 'The <html> element has no lang attribute',
    ),
    check(
      'viewport',
      'technical',
      'viewport',
      'Viewport',
      page.viewport ? 'pass' : 'fail',
      page.viewport ?? 'No viewport meta tag',
    ),
    check(
      'https',
      'technical',
      'HTTPS',
      'HTTPS',
      secure ? 'pass' : 'fail',
      secure ? finalUrl : `Served over plain HTTP — ${finalUrl}`,
    ),
    check(
      'status',
      'technical',
      'ステータスコード',
      'Status code',
      http.status >= 200 && http.status < 300 ? 'pass' : 'fail',
      `HTTP ${http.status}${http.redirects.length ? ` after ${http.redirects.length} redirect(s)` : ''}`,
    ),
    check(
      'hsts',
      'technical',
      'HSTS',
      'HSTS',
      http.securityHeaders['strict-transport-security'] ? 'pass' : 'warn',
      http.securityHeaders['strict-transport-security'] ?? 'No Strict-Transport-Security header',
    ),
  ]
}

export const scoreOf = (checks: SeoCheck[]) => {
  if (!checks.length) return 0
  const points = checks.reduce(
    (total, item) => total + (item.level === 'pass' ? 1 : item.level === 'warn' ? 0.5 : 0),
    0,
  )
  return Math.round((points / checks.length) * 100)
}

export const countByLevel = (checks: SeoCheck[]) => ({
  pass: checks.filter((item) => item.level === 'pass').length,
  warn: checks.filter((item) => item.level === 'warn').length,
  fail: checks.filter((item) => item.level === 'fail').length,
})
