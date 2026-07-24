import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isDaytime, withoutDuplicates, zoneCity, zoneRegion } from './world-clock'

describe('zoneCity', () => {
  it('reads the locality from an IANA id', () => {
    assert.equal(zoneCity('Asia/Tokyo'), 'Tokyo')
    assert.equal(zoneCity('America/New_York'), 'New York')
    assert.equal(zoneCity('America/Argentina/Buenos_Aires'), 'Buenos Aires')
  })

  it('falls back to the whole id when there is no region', () => {
    assert.equal(zoneCity('UTC'), 'UTC')
  })
})

describe('zoneRegion', () => {
  it('reads the leading region', () => {
    assert.equal(zoneRegion('America/New_York'), 'America')
    assert.equal(zoneRegion('UTC'), '')
  })
})

describe('isDaytime', () => {
  it('reads day and night from the local hour', () => {
    // 03:00 UTC — night in London, midday in Tokyo (12:00).
    const instant = new Date('2026-07-22T03:00:00Z')
    assert.equal(isDaytime(instant, 'Europe/London'), false)
    assert.equal(isDaytime(instant, 'Asia/Tokyo'), true)
  })
})

describe('withoutDuplicates', () => {
  it('keeps the first occurrence of each zone', () => {
    assert.deepEqual(withoutDuplicates(['UTC', 'Asia/Tokyo', 'UTC']), ['UTC', 'Asia/Tokyo'])
  })
})
