import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { applyFancyStyle, fancyStyles, renderFancyStyles } from './fancy-text'

describe('applyFancyStyle', () => {
  it('maps the contiguous mathematical alphanumeric blocks', () => {
    assert.equal(applyFancyStyle('Ab1', 'bold'), '𝐀𝐛𝟏')
    assert.equal(applyFancyStyle('Ab1', 'monospace'), '𝙰𝚋𝟷')
    assert.equal(applyFancyStyle('Ab1', 'sansSerif'), '𝖠𝖻𝟣')
  })

  it('substitutes the letterlike symbols the blocks leave reserved', () => {
    assert.equal(applyFancyStyle('Hi', 'script'), 'ℋ𝒾')
    assert.equal(applyFancyStyle('Rz', 'fraktur'), 'ℜ𝔷')
    assert.equal(applyFancyStyle('Zq', 'doubleStruck'), 'ℤ𝕢')
    assert.equal(applyFancyStyle('h', 'italic'), 'ℎ')
  })

  it('handles the circled zero that sits outside the number sequence', () => {
    assert.equal(applyFancyStyle('0123', 'circled'), '⓪①②③')
    assert.equal(applyFancyStyle('Az', 'circled'), 'Ⓐⓩ')
  })

  it('folds case where the target block only has one', () => {
    assert.equal(applyFancyStyle('ab', 'squared'), '🄰🄱')
    assert.equal(applyFancyStyle('AB', 'smallCaps'), 'ᴀʙ')
  })

  it('reverses the character order for upside-down text', () => {
    assert.equal(applyFancyStyle('abc', 'upsideDown'), 'ɔqɐ')
    assert.equal(applyFancyStyle('ab', 'reversed'), 'ba')
  })

  it('appends combining marks without dropping the base characters', () => {
    const struck = applyFancyStyle('ab', 'strikethrough')
    assert.equal(struck.normalize('NFC').replace(/[̀-ͯ]/g, ''), 'ab')
    assert.equal(Array.from(struck).length, 4)
  })

  it('widens to full width', () => {
    assert.equal(applyFancyStyle('A1', 'fullWidth'), 'Ａ１')
  })

  it('leaves characters outside the supported ranges untouched', () => {
    assert.equal(applyFancyStyle('日本 a', 'bold'), '日本 𝐚')
  })

  it('returns the input unchanged for an unknown style', () => {
    assert.equal(applyFancyStyle('abc', 'nope' as never), 'abc')
  })
})

describe('renderFancyStyles', () => {
  it('returns one result per registered style', () => {
    const results = renderFancyStyles('Devtoys 2026')
    assert.equal(results.length, fancyStyles.length)
    assert.ok(results.every((result) => result.output.length > 0))
  })

  it('produces no unpaired surrogates or reserved code points', () => {
    for (const { output, id } of renderFancyStyles('abcxyzABCXYZ0189')) {
      assert.ok(
        !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(output),
        `${id} has a lone high surrogate`,
      )
      assert.ok(!/[�]/.test(output), `${id} produced a replacement character`)
    }
  })
})
