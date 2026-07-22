import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isHeicHeader } from './heic'

/** Builds the first bytes of an ISO base media file with the given brands. */
const header = (major: string, compatible: string[] = []) => {
  const text = `\0\0\0ftyp${major}\0\0\0\0${compatible.join('')}`
  return Uint8Array.from(text, (char) => char.charCodeAt(0))
}

describe('isHeicHeader', () => {
  it('accepts the HEVC still image brands', () => {
    assert.ok(isHeicHeader(header('heic')))
    assert.ok(isHeicHeader(header('heix')))
    assert.ok(isHeicHeader(header('hevc')))
  })

  it('accepts a generic container that lists a HEVC brand', () => {
    assert.ok(isHeicHeader(header('mif1', ['mif1', 'heic'])))
  })

  it('rejects AVIF, which shares the container but not the codec', () => {
    assert.ok(!isHeicHeader(header('avif', ['mif1', 'miaf'])))
    assert.ok(!isHeicHeader(header('mif1', ['mif1', 'avif'])))
  })

  it('rejects other formats and truncated input', () => {
    assert.ok(!isHeicHeader(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0])))
    assert.ok(!isHeicHeader(header('heic').subarray(0, 8)))
    assert.ok(!isHeicHeader(new Uint8Array(0)))
  })
})
