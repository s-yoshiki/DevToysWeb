import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { SiteReport } from '@/features/tools/api/diagnostics-client'
import { auditSeo, countByLevel, type SeoCheck, scoreOf } from './seo-audit'

const report = (overrides: Partial<SiteReport> = {}): SiteReport => ({
  target: 'https://example.com/',
  http: {
    finalUrl: 'https://example.com/',
    status: 200,
    durationMs: 120,
    redirects: [],
    headers: {},
    securityHeaders: { 'strict-transport-security': 'max-age=63072000' },
  },
  page: {
    title: 'A perfectly reasonable page title',
    description:
      'A meta description long enough to be useful in a search result listing, but not so long that it gets truncated.',
    canonical: 'https://example.com/',
    viewport: 'width=device-width, initial-scale=1',
    'og:title': 'A perfectly reasonable page title',
    'og:image': 'https://example.com/og.png',
    'twitter:card': 'summary_large_image',
  },
  signals: {
    lang: 'ja',
    charset: 'utf-8',
    h1: ['The one heading'],
    h2: ['Section'],
    images: { total: 4, missingAlt: 0 },
    links: { total: 10, external: 2, internal: 8 },
    textLength: 1200,
  },
  ...overrides,
})

const find = (checks: SeoCheck[], id: string) => {
  const match = checks.find((item) => item.id === id)
  assert.ok(match, `missing check: ${id}`)
  return match
}

describe('auditSeo', () => {
  it('passes every check for a well-formed page', () => {
    const checks = auditSeo(report())
    assert.deepEqual(countByLevel(checks), { pass: checks.length, warn: 0, fail: 0 })
    assert.equal(scoreOf(checks), 100)
  })

  it('fails when the essentials are absent', () => {
    const checks = auditSeo(report({ page: {} }))
    assert.equal(find(checks, 'title').level, 'fail')
    assert.equal(find(checks, 'description').level, 'fail')
    assert.equal(find(checks, 'viewport').level, 'fail')
    assert.equal(find(checks, 'canonical').level, 'warn')
  })

  it('warns on a title outside the recommended length', () => {
    const short = auditSeo(report({ page: { ...report().page, title: 'Hi' } }))
    assert.equal(find(short, 'title').level, 'warn')
  })

  it('treats noindex as a failure', () => {
    const checks = auditSeo(report({ page: { ...report().page, robots: 'noindex, nofollow' } }))
    assert.equal(find(checks, 'robots').level, 'fail')
  })

  it('flags a missing and a duplicated H1 differently', () => {
    const none = auditSeo(report({ signals: { ...report().signals, h1: [] } }))
    const many = auditSeo(report({ signals: { ...report().signals, h1: ['a', 'b'] } }))
    assert.equal(find(none, 'h1').level, 'fail')
    assert.equal(find(many, 'h1').level, 'warn')
  })

  it('reports images without alt text', () => {
    const checks = auditSeo(
      report({ signals: { ...report().signals, images: { total: 4, missingAlt: 3 } } }),
    )
    const alt = find(checks, 'image-alt')
    assert.equal(alt.level, 'warn')
    assert.match(alt.detail, /3 of 4/)
  })

  it('fails plain HTTP and non-2xx responses', () => {
    const checks = auditSeo(
      report({
        target: 'http://example.com/',
        http: { ...report().http, finalUrl: 'http://example.com/', status: 404 },
      }),
    )
    assert.equal(find(checks, 'https').level, 'fail')
    assert.equal(find(checks, 'status').level, 'fail')
  })
})

describe('scoreOf', () => {
  it('gives half credit for warnings', () => {
    const checks = auditSeo(report({ page: {} }))
    assert.ok(scoreOf(checks) > 0 && scoreOf(checks) < 100)
  })

  it('returns zero for an empty audit', () => {
    assert.equal(scoreOf([]), 0)
  })
})
