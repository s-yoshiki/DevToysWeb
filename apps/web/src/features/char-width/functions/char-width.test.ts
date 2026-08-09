import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  type CharWidthOptions,
  convertCharWidth,
  defaultCharWidthOptions,
  hiraganaToKatakana,
  katakanaToHiragana,
  summarizeCharWidth,
} from './char-width'

const options = (overrides: Partial<CharWidthOptions> = {}): CharWidthOptions => ({
  ...defaultCharWidthOptions,
  ...overrides,
  targets: { ...defaultCharWidthOptions.targets, ...overrides.targets },
})

describe('convertCharWidth to full width', () => {
  const toFull = options({ direction: 'toFullWidth' })

  it('widens alphanumerics and symbols', () => {
    assert.equal(convertCharWidth('Abc-123!', toFull), 'Ａｂｃ－１２３！')
  })

  it('widens the ASCII space into an ideographic space', () => {
    assert.equal(convertCharWidth('a b', toFull), 'ａ　ｂ')
  })

  it('composes half-width katakana with their voiced marks', () => {
    assert.equal(convertCharWidth('ｶﾞｷﾞﾊﾟﾎﾞ', toFull), 'ガギパボ')
    assert.equal(convertCharWidth('ﾃﾞｰﾀ', toFull), 'データ')
  })

  it('leaves classes the caller switched off untouched', () => {
    const alphanumericOnly = options({
      direction: 'toFullWidth',
      targets: { alphanumeric: true, symbol: false, katakana: false, space: false },
    })
    assert.equal(convertCharWidth('A-1 ｱ', alphanumericOnly), 'Ａ-１ ｱ')
  })
})

describe('convertCharWidth to half width', () => {
  const toHalf = options({ direction: 'toHalfWidth' })

  it('narrows alphanumerics, symbols, and the ideographic space', () => {
    assert.equal(convertCharWidth('Ａｂｃ－１２３！', toHalf), 'Abc-123!')
    assert.equal(convertCharWidth('ａ　ｂ', toHalf), 'a b')
  })

  it('decomposes voiced katakana back into a base plus a mark', () => {
    assert.equal(convertCharWidth('ガギパボ', toHalf), 'ｶﾞｷﾞﾊﾟﾎﾞ')
    assert.equal(convertCharWidth('データ', toHalf), 'ﾃﾞｰﾀ')
  })

  it('keeps kanji and hiragana as they are', () => {
    assert.equal(convertCharWidth('日本語のてすと', toHalf), '日本語のてすと')
  })

  it('round-trips a mixed string', () => {
    const original = 'Test-1 データ！'
    const full = convertCharWidth(original, options({ direction: 'toFullWidth' }))
    assert.equal(convertCharWidth(full, toHalf), 'Test-1 ﾃﾞｰﾀ!')
  })
})

describe('kana conversion', () => {
  it('converts hiragana to katakana and back', () => {
    assert.equal(hiraganaToKatakana('ひらがな'), 'ヒラガナ')
    assert.equal(katakanaToHiragana('カタカナ'), 'かたかな')
  })

  it('handles the vu character in both directions', () => {
    assert.equal(hiraganaToKatakana('ゔ'), 'ヴ')
    assert.equal(katakanaToHiragana('ヴ'), 'ゔ')
  })

  it('leaves the prolonged sound mark alone', () => {
    assert.equal(katakanaToHiragana('コーヒー'), 'こーひー')
  })

  it('applies after the width conversion', () => {
    const result = convertCharWidth(
      'ｺｰﾋｰ',
      options({ direction: 'toFullWidth', kana: 'toHiragana' }),
    )
    assert.equal(result, 'こーひー')
  })
})

describe('summarizeCharWidth', () => {
  it('reports how many positions differ', () => {
    assert.deepEqual(summarizeCharWidth('abc', 'ａｂc'), {
      inputLength: 3,
      outputLength: 3,
      changed: 2,
    })
  })

  it('counts length growth from decomposed voiced marks', () => {
    assert.deepEqual(summarizeCharWidth('ガ', 'ｶﾞ'), {
      inputLength: 1,
      outputLength: 2,
      changed: 2,
    })
  })

  it('reports no change for identical text', () => {
    assert.equal(summarizeCharWidth('日本語', '日本語').changed, 0)
  })
})
