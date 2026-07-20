import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { transform } from './transformers'

describe('json-toml', () => {
  it('converts a nested object to TOML', () => {
    const toml = transform('json-toml', '{"package":{"name":"devtoys"}}')
    assert.match(toml, /\[package\]/)
    assert.match(toml, /name = "devtoys"/)
  })

  it('parses TOML back into JSON', () => {
    const json = transform('json-toml', 'x = 1\n[t]\ny = "z"', true)
    assert.deepEqual(JSON.parse(json), { x: 1, t: { y: 'z' } })
  })

  it('rejects a top-level array, which TOML cannot represent', () => {
    assert.throws(() => transform('json-toml', '[1, 2]'), /top level/)
  })
})

describe('json-xml', () => {
  it('writes attributes using the @ prefix', () => {
    const xml = transform('json-xml', '{"root":{"@id":"1","n":"v"}}')
    assert.match(xml, /<root id="1">/)
    assert.match(xml, /<n>v<\/n>/)
  })

  it('round-trips an XML document', () => {
    const json = transform('json-xml', '<root id="1"><n>v</n></root>', true)
    assert.deepEqual(JSON.parse(json), { root: { '@id': '1', n: 'v' } })
  })
})

describe('transform', () => {
  it('returns an empty string for empty input regardless of tool', () => {
    assert.equal(transform('json-toml', ''), '')
    assert.equal(transform('json-xml', '', true), '')
  })
})
