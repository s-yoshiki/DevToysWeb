import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  emojiCatalog,
  filterEmojis,
  formatEmojiList,
  generateEmojis,
  getEmojiCodePoints,
  getEmojiHtml,
  getEmojiHtmlDecimal,
  isZwjSequence,
} from './emoji'

describe('filterEmojis', () => {
  it('matches Japanese and English names', () => {
    assert.equal(filterEmojis(emojiCatalog, 'イヌの顔', 'all')[0]?.emoji, '🐶')
    assert.equal(filterEmojis(emojiCatalog, 'rocket', 'all')[0]?.emoji, '🚀')
  })

  it('matches Unicode code points and HTML entities', () => {
    assert.equal(filterEmojis(emojiCatalog, 'U+1F600', 'all')[0]?.emoji, '😀')
    assert.equal(filterEmojis(emojiCatalog, '&#128512;', 'all')[0]?.emoji, '😀')
  })

  it('combines a search query with a category filter', () => {
    assert.ok(
      filterEmojis(emojiCatalog, 'rocket', 'travel').every((item) => item.category === 'travel'),
    )
    assert.deepEqual(filterEmojis(emojiCatalog, 'rocket', 'food'), [])
  })

  it('finds ZWJ sequences by keyword across categories', () => {
    const sequences = filterEmojis(emojiCatalog, 'ZWJ', 'all')
    assert.ok(sequences.length > 0)
    assert.ok(sequences.every((item) => isZwjSequence(item.emoji)))
    assert.equal(filterEmojis(emojiCatalog, 'woman technologist', 'all')[0]?.emoji, '👩‍💻')
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

  it('returns copyable decimal HTML entities', () => {
    assert.equal(getEmojiHtmlDecimal('😀'), '&#128512;')
    assert.equal(getEmojiHtmlDecimal('👩‍💻'), '&#128105;&#8205;&#128187;')
  })

  it('keeps the zero-width joiner in code point and HTML output', () => {
    assert.equal(isZwjSequence('👩‍💻'), true)
    assert.equal(getEmojiCodePoints('👩‍💻'), 'U+1F469 U+200D U+1F4BB')
    assert.equal(getEmojiHtml('👩‍💻'), '&#x1f469;&#x200d;&#x1f4bb;')
  })
})

describe('formatEmojiList', () => {
  it('formats each entry as a tab-separated row of emoji, name, Unicode, and HTML', () => {
    const rows = formatEmojiList(emojiCatalog.slice(0, 2), 'en').split('\n')
    assert.equal(rows.length, 2)
    assert.equal(rows[0], '😀\tgrinning face\tU+1F600\t&#x1f600;')
    assert.equal(rows[1], '😃\tgrinning face with big eyes\tU+1F603\t&#x1f603;')
  })

  it('picks the requested locale for the name column', () => {
    const [row] = formatEmojiList(emojiCatalog.slice(0, 1), 'ja').split('\n')
    assert.equal(row, '😀\tにっこり笑う\tU+1F600\t&#x1f600;')
  })
})

describe('generateEmojis', () => {
  it('clamps the count and can be made deterministic', () => {
    const values = generateEmojis(emojiCatalog.slice(0, 2), 40, () => 0)
    assert.equal(values.length, 30)
    assert.ok(values.every((item) => item.emoji === '😀'))
  })
})
