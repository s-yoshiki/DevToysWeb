import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { contrastRatio, parseColor, toHex, toHslString, toOklchString, toRgbString } from './color'

describe('parseColor', () => {
  it('expands short hex notation', () => {
    assert.deepEqual(parseColor('#0af'), { r: 0, g: 170, b: 255, a: 1 })
  })

  it('reads the alpha channel from 8-digit hex', () => {
    assert.equal(parseColor('#ff000080').a, 128 / 255)
  })

  it('accepts rgb() with comma or space separators', () => {
    assert.equal(toHex(parseColor('rgb(59, 130, 246)')), '#3b82f6')
    assert.equal(toHex(parseColor('rgb(59 130 246)')), '#3b82f6')
  })

  it('round-trips through hsl() within the rounding the notation implies', () => {
    const source = parseColor('#3b82f6')
    const restored = parseColor(toHslString(source))
    for (const channel of ['r', 'g', 'b'] as const)
      assert.ok(
        Math.abs(source[channel] - restored[channel]) <= 1,
        `${channel}: ${source[channel]} vs ${restored[channel]}`,
      )
  })

  it('rejects unsupported input', () => {
    assert.throws(() => parseColor('rebeccapurple'))
    assert.throws(() => parseColor('#12345'))
    assert.throws(() => parseColor(''))
  })
})

describe('colour formatting', () => {
  it('omits the alpha suffix for opaque colours', () => {
    assert.equal(toHex(parseColor('#3b82f6')), '#3b82f6')
    assert.equal(toRgbString(parseColor('#3b82f6')), 'rgb(59, 130, 246)')
  })

  it('switches to the alpha-aware notation when translucent', () => {
    assert.match(toRgbString(parseColor('rgba(0, 0, 0, 0.5)')), /^rgba\(0, 0, 0, 0\.5\)$/)
  })

  it('reports pure white as full OKLCH lightness with no chroma', () => {
    assert.match(toOklchString(parseColor('#ffffff')), /^oklch\(100% 0 0\)$/)
  })
})

describe('contrastRatio', () => {
  it('returns the WCAG extremes for black on white', () => {
    assert.equal(contrastRatio(parseColor('#000000'), parseColor('#ffffff')).toFixed(0), '21')
  })

  it('is 1 for identical colours and order independent', () => {
    const a = parseColor('#3b82f6')
    const b = parseColor('#ffffff')
    assert.equal(contrastRatio(a, a), 1)
    assert.equal(contrastRatio(a, b), contrastRatio(b, a))
  })
})
