import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  filterKaomoji,
  getKaomojiCodePoints,
  getKaomojiHtml,
  getKaomojiUnicodeEscape,
  kaomojiCatalog,
  kaomojiCategories,
} from './kaomoji'
import {
  buildKaomoji,
  defaultKaomojiParts,
  kaomojiArms,
  kaomojiBrackets,
  kaomojiDecorations,
  kaomojiEyes,
  kaomojiMouths,
  randomKaomojiParts,
} from './kaomoji-parts'

describe('kaomojiCatalog', () => {
  it('holds no duplicate kaomoji', () => {
    const seen = new Set(kaomojiCatalog.map((item) => item.kaomoji))
    assert.equal(seen.size, kaomojiCatalog.length)
  })

  it('gives every entry both locales and a listed category', () => {
    const categories = new Set(kaomojiCategories)
    for (const item of kaomojiCatalog) {
      assert.ok(item.name.ja.length > 0, `${item.kaomoji} has no Japanese name`)
      assert.ok(item.name.en.length > 0, `${item.kaomoji} has no English name`)
      assert.ok(categories.has(item.category), `${item.kaomoji} has an unlisted category`)
    }
  })

  it('fills every category with entries', () => {
    for (const category of kaomojiCategories) {
      if (category === 'all') continue
      assert.ok(
        kaomojiCatalog.some((item) => item.category === category),
        `${category} is empty`,
      )
    }
  })
})

describe('filterKaomoji', () => {
  it('matches Japanese and English names', () => {
    assert.equal(filterKaomoji(kaomojiCatalog, '土下座', 'all')[0]?.kaomoji, 'orz')
    assert.equal(filterKaomoji(kaomojiCatalog, 'table flip', 'all')[0]?.kaomoji, '(╯°□°）╯︵ ┻━┻')
  })

  it('matches the kaomoji characters themselves', () => {
    assert.equal(filterKaomoji(kaomojiCatalog, '(T_T)', 'all')[0]?.name.en, 'sobbing')
  })

  it('ignores whether the query is hiragana, katakana, or half-width', () => {
    const hiragana = filterKaomoji(kaomojiCatalog, 'ねこ', 'all')
    assert.ok(hiragana.length > 0)
    assert.deepEqual(filterKaomoji(kaomojiCatalog, 'ネコ', 'all'), hiragana)
    assert.deepEqual(filterKaomoji(kaomojiCatalog, 'ﾈｺ', 'all'), hiragana)
  })

  it('ignores full-width and letter case in latin queries', () => {
    const plain = filterKaomoji(kaomojiCatalog, 'cat', 'all')
    assert.ok(plain.length > 0)
    assert.deepEqual(filterKaomoji(kaomojiCatalog, 'CAT', 'all'), plain)
    assert.deepEqual(filterKaomoji(kaomojiCatalog, 'ｃａｔ', 'all'), plain)
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

describe('buildKaomoji', () => {
  it('nests parts outward from the face', () => {
    assert.equal(
      buildKaomoji({
        brackets: 'round',
        eyes: 'caret',
        mouth: 'under',
        arms: 'raise',
        decoration: 'none',
      }),
      'ヽ(^_^)ﾉ',
    )
  })

  it('omits parts set to none', () => {
    assert.equal(buildKaomoji(defaultKaomojiParts), '(^_^)')
    assert.equal(buildKaomoji({ ...defaultKaomojiParts, brackets: 'none', mouth: 'none' }), '^^')
  })

  it('wraps the whole face in the decoration', () => {
    assert.equal(buildKaomoji({ ...defaultKaomojiParts, decoration: 'star' }), '☆(^_^)☆')
  })

  it('falls back to the first option for an unknown part id', () => {
    assert.equal(buildKaomoji({ ...defaultKaomojiParts, eyes: 'nope' }), '(^_^)')
  })
})

describe('randomKaomojiParts', () => {
  it('picks the first option of every table when random returns zero', () => {
    const parts = randomKaomojiParts(() => 0)
    assert.deepEqual(parts, {
      brackets: kaomojiBrackets[0].id,
      eyes: kaomojiEyes[0].id,
      mouth: kaomojiMouths[0].id,
      arms: kaomojiArms[0].id,
      decoration: kaomojiDecorations[0].id,
    })
  })

  it('always produces a selection that builds', () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const parts = randomKaomojiParts(() => seed / 20)
      assert.equal(typeof buildKaomoji(parts), 'string')
    }
  })
})
