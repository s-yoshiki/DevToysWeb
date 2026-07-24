import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { generateUuids, namedUuid, ulid, uuidNamespaces } from './uuid'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('generateUuids', () => {
  it('produces valid, distinct v4 values', () => {
    const list = generateUuids('v4', 20)
    assert.equal(list.length, 20)
    for (const value of list) {
      assert.match(value, UUID_RE)
      assert.equal(value[14], '4') // version nibble
      assert.ok('89ab'.includes(value[19])) // variant nibble
    }
    assert.equal(new Set(list).size, 20)
  })

  it('stamps the version nibble for v1 and v7', () => {
    assert.equal(generateUuids('v1', 1)[0][14], '1')
    assert.equal(generateUuids('v7', 1)[0][14], '7')
  })

  it('returns the fixed nil and max UUIDs', () => {
    assert.equal(generateUuids('nil', 1)[0], '00000000-0000-0000-0000-000000000000')
    assert.equal(generateUuids('max', 1)[0], 'ffffffff-ffff-ffff-ffff-ffffffffffff')
  })
})

describe('ulid', () => {
  it('is 26 Crockford Base32 characters and sorts by time', () => {
    const early = ulid(1_000_000_000_000)
    const late = ulid(2_000_000_000_000)
    assert.equal(early.length, 26)
    assert.match(early, /^[0-9A-HJKMNP-TV-Z]{26}$/)
    assert.ok(early < late)
  })
})

describe('namedUuid', () => {
  it('matches the canonical RFC 4122 v5 test vector', () => {
    assert.equal(
      namedUuid('v5', uuidNamespaces.dns, 'python.org'),
      '886313e1-3b8a-5372-9b90-0c9aee199e5d',
    )
  })

  it('is deterministic and stamps v3/v5 version nibbles', () => {
    const v5 = namedUuid('v5', uuidNamespaces.url, 'https://example.com')
    assert.equal(v5, namedUuid('v5', uuidNamespaces.url, 'https://example.com'))
    assert.equal(v5[14], '5')
    assert.equal(namedUuid('v3', uuidNamespaces.url, 'https://example.com')[14], '3')
  })
})
