import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildGoogleSearchQuery,
  buildGoogleSearchUrl,
  emptyGoogleSearchCondition,
  type GoogleSearchCondition,
} from './google-search'

const condition = (overrides: Partial<GoogleSearchCondition>): GoogleSearchCondition => ({
  ...emptyGoogleSearchCondition,
  ...overrides,
})

describe('buildGoogleSearchQuery', () => {
  it('returns an empty query for the empty condition', () => {
    assert.equal(buildGoogleSearchQuery(emptyGoogleSearchCondition), '')
  })

  it('combines word operators in form order', () => {
    assert.equal(
      buildGoogleSearchQuery(
        condition({
          allWords: 'static export',
          exactPhrase: 'app router',
          anyWords: 'next remix',
          noneWords: 'ads -sponsored',
        }),
      ),
      'static export "app router" (next OR remix) -ads -sponsored',
    )
  })

  it('applies placement operators per term', () => {
    assert.equal(
      buildGoogleSearchQuery(
        condition({ inTitle: 'changelog release', inText: 'migration', inUrl: 'docs' }),
      ),
      '(intitle:changelog OR intitle:release) intext:migration inurl:docs',
    )
  })

  it('reduces sites to bare hosts', () => {
    assert.equal(
      buildGoogleSearchQuery(
        condition({
          allWords: 'cdn',
          sites: 'https://aws.amazon.com/docs, developer.mozilla.org',
          excludeSites: 'pinterest.com',
        }),
      ),
      'cdn (site:aws.amazon.com OR site:developer.mozilla.org) -site:pinterest.com',
    )
  })

  it('adds file type and related operators', () => {
    assert.equal(
      buildGoogleSearchQuery(
        condition({ allWords: 'report', fileType: 'pdf', relatedSite: 'https://github.com' }),
      ),
      'report filetype:pdf related:github.com',
    )
  })

  it('emits open-ended numeric ranges', () => {
    assert.equal(
      buildGoogleSearchQuery(condition({ numberFrom: '100', numberTo: '500' })),
      '100..500',
    )
    assert.equal(buildGoogleSearchQuery(condition({ numberFrom: '100' })), '100..')
    assert.equal(buildGoogleSearchQuery(condition({ numberTo: '500' })), '..500')
    assert.equal(buildGoogleSearchQuery(condition({ numberFrom: 'abc' })), '')
  })

  it('appends after and before dates', () => {
    assert.equal(
      buildGoogleSearchQuery(
        condition({ allWords: 'x', after: '2026-01-01', before: '2026-06-30' }),
      ),
      'x after:2026-01-01 before:2026-06-30',
    )
    assert.equal(buildGoogleSearchQuery(condition({ allWords: 'x', after: '2026/01/01' })), 'x')
  })

  it('keeps language and time range out of the query string', () => {
    assert.equal(
      buildGoogleSearchQuery(condition({ allWords: 'x', language: 'ja', timeRange: 'w' })),
      'x',
    )
  })
})

describe('buildGoogleSearchUrl', () => {
  it('returns an empty string when there is no query', () => {
    assert.equal(buildGoogleSearchUrl(emptyGoogleSearchCondition), '')
  })

  it('encodes the query into a Google search URL', () => {
    assert.equal(
      buildGoogleSearchUrl(condition({ exactPhrase: 'app router', fileType: 'pdf' })),
      'https://www.google.com/search?q=%22app+router%22+filetype%3Apdf',
    )
  })

  it('carries language and recency as URL parameters', () => {
    assert.equal(
      buildGoogleSearchUrl(condition({ allWords: 'x', language: 'ja', timeRange: 'w' })),
      'https://www.google.com/search?q=x&lr=lang_ja&tbs=qdr%3Aw',
    )
  })
})
