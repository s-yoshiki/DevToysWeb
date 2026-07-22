import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { cardFields, openGraphFields, resolveAgainst, sharePreview } from './ogp'

describe('openGraphFields', () => {
  it('flags missing required tags and leaves optional ones neutral', () => {
    const fields = openGraphFields({ 'og:title': 'Hello' })
    const byKey = Object.fromEntries(fields.map((field) => [field.key, field]))
    assert.equal(byKey['og:title'].status, 'ok')
    assert.equal(byKey['og:image'].status, 'missing')
    assert.equal(byKey['og:type'].status, 'optional')
  })
})

describe('cardFields', () => {
  it('treats the card type as the only required X tag', () => {
    const required = cardFields({}).filter((field) => field.required)
    assert.deepEqual(
      required.map((field) => field.key),
      ['twitter:card'],
    )
  })
})

describe('sharePreview', () => {
  it('prefers X tags, then Open Graph, then the document', () => {
    assert.equal(sharePreview({ title: 'Doc', 'og:title': 'OG' }).title, 'OG')
    assert.equal(sharePreview({ 'og:title': 'OG', 'twitter:title': 'X' }).title, 'X')
    assert.equal(sharePreview({ title: 'Doc' }).title, 'Doc')
  })

  it('falls back from og:url to the canonical link', () => {
    assert.equal(sharePreview({ canonical: 'https://example.com/' }).url, 'https://example.com/')
  })
})

describe('resolveAgainst', () => {
  it('absolutises a relative image path', () => {
    assert.equal(
      resolveAgainst('/og.png', 'https://example.com/blog/post'),
      'https://example.com/og.png',
    )
  })

  it('returns null for missing or unparseable values', () => {
    assert.equal(resolveAgainst(null, 'https://example.com'), null)
    assert.equal(resolveAgainst('/x', 'not a url'), null)
  })
})
