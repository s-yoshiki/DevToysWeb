import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildXSearchQuery,
  buildXSearchUrl,
  emptyXSearchCondition,
  type XSearchCondition,
} from './x-search'

const condition = (overrides: Partial<XSearchCondition>): XSearchCondition => ({
  ...emptyXSearchCondition,
  ...overrides,
})

describe('buildXSearchQuery', () => {
  it('returns an empty query for the empty condition', () => {
    assert.equal(buildXSearchQuery(emptyXSearchCondition), '')
  })

  it('combines word operators in form order', () => {
    assert.equal(
      buildXSearchQuery(
        condition({
          allWords: 'devtools release',
          exactPhrase: 'happy hour',
          anyWords: 'cats dogs',
          noneWords: 'spam ads',
        }),
      ),
      'devtools release "happy hour" (cats OR dogs) -spam -ads',
    )
  })

  it('wraps OR groups only when there are multiple terms', () => {
    assert.equal(buildXSearchQuery(condition({ anyWords: 'cats' })), 'cats')
    assert.equal(buildXSearchQuery(condition({ hashtags: 'ai' })), '#ai')
  })

  it('normalises hashtag, mention and account prefixes', () => {
    assert.equal(
      buildXSearchQuery(
        condition({
          hashtags: '#ai typescript',
          fromAccounts: '@nasa, esa',
          toAccounts: '@github',
          mentionAccounts: 'sfgov @nyc',
        }),
      ),
      '(#ai OR #typescript) (from:nasa OR from:esa) to:github (@sfgov OR @nyc)',
    )
  })

  it('strips double quotes inside an exact phrase', () => {
    assert.equal(buildXSearchQuery(condition({ exactPhrase: 'say "hi"' })), '"say hi"')
  })

  it('emits reply and link filters for only and exclude modes', () => {
    assert.equal(
      buildXSearchQuery(condition({ allWords: 'news', replies: 'only', links: 'exclude' })),
      'news filter:replies -filter:links',
    )
  })

  it('accepts only positive integers for engagement thresholds', () => {
    assert.equal(
      buildXSearchQuery(
        condition({ allWords: 'x', minReplies: '10', minFaves: '0', minRetweets: 'abc' }),
      ),
      'x min_replies:10',
    )
  })

  it('appends since and until dates', () => {
    assert.equal(
      buildXSearchQuery(condition({ allWords: 'x', since: '2026-01-01', until: '2026-01-31' })),
      'x since:2026-01-01 until:2026-01-31',
    )
  })

  it('adds a language operator', () => {
    assert.equal(buildXSearchQuery(condition({ allWords: 'x', language: 'ja' })), 'x lang:ja')
  })
})

describe('buildXSearchUrl', () => {
  it('returns an empty string when there is no query', () => {
    assert.equal(buildXSearchUrl(emptyXSearchCondition), '')
  })

  it('encodes the query into an x.com search URL', () => {
    assert.equal(
      buildXSearchUrl(condition({ exactPhrase: 'happy hour', language: 'ja' })),
      'https://x.com/search?q=%22happy+hour%22+lang%3Aja&src=typed_query',
    )
  })

  it('appends the result tab except for top', () => {
    assert.equal(
      buildXSearchUrl(condition({ allWords: 'x' }), 'live'),
      'https://x.com/search?q=x&src=typed_query&f=live',
    )
    assert.equal(buildXSearchUrl(condition({ allWords: 'x' }), 'top').includes('&f='), false)
  })
})
