import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  emojiCatalog,
  filterEmojis,
  generateEmojis,
  getEmojiCodePoints,
  getEmojiHtml,
} from './emoji'

describe('filterEmojis', () => {
  it('matches Japanese and English names', () => {
    assert.equal(filterEmojis(emojiCatalog, '犬', 'all')[0]?.emoji, '🐶')
    assert.equal(filterEmojis(emojiCatalog, 'rocket', 'all')[0]?.emoji, '🚀')
  })

  it('combines a search query with a category filter', () => {
    assert.ok(
      filterEmojis(emojiCatalog, 'heart', 'symbols').every((item) => item.category === 'symbols'),
    )
    assert.deepEqual(filterEmojis(emojiCatalog, 'rocket', 'food'), [])
  })
})

describe('emoji output helpers', () => {
  it('returns code points for variation selectors and emoji characters', () => {
    assert.equal(getEmojiCodePoints('❤️'), 'U+2764 U+FE0F')
  })

  it('returns copyable hexadecimal HTML entities', () => {
    assert.equal(getEmojiHtml('😀'), '&#x1f600;')
    assert.equal(getEmojiHtml('❤️'), '&#x2764;&#xfe0f;')
  })
})

describe('generateEmojis', () => {
  it('clamps the count and can be made deterministic', () => {
    const values = generateEmojis(emojiCatalog.slice(0, 2), 40, () => 0)
    assert.equal(values.length, 30)
    assert.ok(values.every((item) => item.emoji === '😀'))
  })
})
