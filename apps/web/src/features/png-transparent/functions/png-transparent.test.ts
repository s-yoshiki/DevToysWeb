import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { colorDistance, knockOutColor, parseHexColor, toHexColor } from './png-transparent'

const white = { r: 255, g: 255, b: 255 }
const black = { r: 0, g: 0, b: 0 }

const buffer = (...colors: number[][]) =>
  new Uint8ClampedArray(colors.flatMap(([r, g, b, a = 255]) => [r, g, b, a]))

describe('parseHexColor', () => {
  it('accepts long and short hex, with or without a hash', () => {
    assert.deepEqual(parseHexColor('#ff8800'), { r: 255, g: 136, b: 0 })
    assert.deepEqual(parseHexColor('f80'), { r: 255, g: 136, b: 0 })
  })

  it('rejects anything else', () => {
    assert.equal(parseHexColor('#ggg'), null)
    assert.equal(parseHexColor('rgb(0,0,0)'), null)
  })
})

describe('toHexColor', () => {
  it('zero-pads each channel', () => {
    assert.equal(toHexColor({ r: 0, g: 8, b: 255 }), '#0008ff')
  })
})

describe('colorDistance', () => {
  it('is zero for identical colours and largest across the diagonal', () => {
    assert.equal(colorDistance(white, white), 0)
    assert.ok(colorDistance(white, black) > 441)
  })
})

describe('knockOutColor', () => {
  it('clears only exact matches at zero tolerance', () => {
    const pixels = buffer([255, 255, 255], [254, 255, 255], [0, 0, 0])
    const cleared = knockOutColor(pixels, white, { tolerance: 0, soften: false })
    assert.equal(cleared, 1)
    assert.equal(pixels[3], 0)
    assert.equal(pixels[7], 255)
    assert.equal(pixels[11], 255)
  })

  it('widens the match as tolerance grows', () => {
    const pixels = buffer([255, 255, 255], [240, 240, 240], [0, 0, 0])
    const cleared = knockOutColor(pixels, white, { tolerance: 10, soften: false })
    assert.equal(cleared, 2)
    assert.equal(pixels[11], 255)
  })

  it('ramps alpha instead of cutting when softening', () => {
    const pixels = buffer([250, 250, 250])
    knockOutColor(pixels, white, { tolerance: 20, soften: true })
    assert.ok(pixels[3] > 0 && pixels[3] < 255)
  })

  it('leaves already transparent pixels alone', () => {
    const pixels = buffer([255, 255, 255, 0])
    assert.equal(knockOutColor(pixels, white, { tolerance: 100, soften: false }), 0)
  })
})
