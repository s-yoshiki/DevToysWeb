import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  filterKaomoji,
  generateKaomoji,
  getKaomojiCodePoints,
  getKaomojiHtml,
  getKaomojiUnicodeEscape,
  kaomojiCatalog,
} from './kaomoji'

describe('filterKaomoji', () => {
  it('matches Japanese and English names', () => {
    assert.equal(filterKaomoji(kaomojiCatalog, '土下座', 'all')[0]?.kaomoji, 'orz')
    assert.equal(filterKaomoji(kaomojiCatalog, 'table flip', 'all')[0]?.kaomoji, '(╯°□°）╯︵ ┻━┻')
  })

  it('matches the kaomoji characters themselves', () => {
    assert.equal(filterKaomoji(kaomojiCatalog, '(T_T)', 'all')[0]?.name.en, 'sobbing')
  })

  it('combines a search query with a category filter', () => {
    assert.ok(filterKaomoji(kaomojiCatalog, 'cat', 'animal').every((i) => i.category === 'animal'))
    assert.deepEqual(filterKaomoji(kaomojiCatalog, 'cat', 'anger'), [])
  })

  it('returns every entry of a category for an empty query', () => {
    const joy = filterKaomoji(kaomojiCatalog, '', 'joy')
    assert.ok(joy.length > 0)
    assert.ok(joy.every((item) => item.category === 'joy'))
  })
})

describe('kaomoji output helpers', () => {
  it('lists code points as whole characters, not surrogate halves', () => {
    assert.equal(getKaomojiCodePoints('(^_^)'), 'U+0028 U+005E U+005F U+005E U+0029')
    assert.equal(getKaomojiCodePoints('ʕ•ᴥ•ʔ'), 'U+0295 U+2022 U+1D25 U+2022 U+0294')
  })

  it('keeps ASCII readable and escapes only non-ASCII in HTML output', () => {
    assert.equal(getKaomojiHtml('(^_^)'), '(^_^)')
    assert.equal(getKaomojiHtml('(・ω・)ノ'), '(&#12539;&#969;&#12539;)&#12494;')
  })

  it('emits UTF-16 escapes usable in a JavaScript or JSON literal', () => {
    assert.equal(getKaomojiUnicodeEscape('(T_T)'), '(T_T)')
    assert.equal(getKaomojiUnicodeEscape('ʕ•ᴥ•ʔ'), '\\u0295\\u2022\\u1D25\\u2022\\u0294')
  })

  it('escapes backslashes and quotes so the literal stays valid', () => {
    assert.equal(getKaomojiUnicodeEscape('\\(^o^)/'), '\\\\(^o^)/')
  })
})

describe('generateKaomoji', () => {
  it('clamps the count and can be made deterministic', () => {
    const values = generateKaomoji(kaomojiCatalog.slice(0, 2), 40, () => 0)
    assert.equal(values.length, 30)
    assert.ok(values.every((item) => item.kaomoji === kaomojiCatalog[0].kaomoji))
  })

  it('falls back to an empty result when the source is empty', () => {
    assert.deepEqual(generateKaomoji([], 5), [])
  })
})
