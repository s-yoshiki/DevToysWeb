import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  dayShift,
  formatOffset,
  formatWallTime,
  instantToWallTime,
  isValidTimeZone,
  parseWallTime,
  wallTimeToInstant,
  zoneOffsetMinutes,
} from './timezone'

const wall = (value: string) => {
  const parsed = parseWallTime(value)
  assert.ok(parsed, `${value} should parse`)
  return parsed
}

describe('zoneOffsetMinutes', () => {
  it('reads a fixed offset zone', () => {
    assert.equal(zoneOffsetMinutes(new Date('2026-07-22T00:00:00Z'), 'Asia/Tokyo'), 540)
    assert.equal(zoneOffsetMinutes(new Date('2026-01-22T00:00:00Z'), 'Asia/Tokyo'), 540)
    assert.equal(zoneOffsetMinutes(new Date('2026-07-22T00:00:00Z'), 'UTC'), 0)
  })

  it('follows daylight saving time', () => {
    assert.equal(zoneOffsetMinutes(new Date('2026-01-15T12:00:00Z'), 'America/New_York'), -300)
    assert.equal(zoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'America/New_York'), -240)
  })

  it('handles half hour offsets', () => {
    assert.equal(zoneOffsetMinutes(new Date('2026-07-22T00:00:00Z'), 'Asia/Kolkata'), 330)
  })
})

describe('wallTimeToInstant', () => {
  it('turns a local reading into the matching instant', () => {
    assert.equal(
      wallTimeToInstant(wall('2026-07-22T09:00:00'), 'Asia/Tokyo').toISOString(),
      '2026-07-22T00:00:00.000Z',
    )
    assert.equal(
      wallTimeToInstant(wall('2026-07-22T00:00:00'), 'UTC').toISOString(),
      '2026-07-22T00:00:00.000Z',
    )
  })

  it('picks the right side of a daylight saving transition', () => {
    // US DST starts 2026-03-08 02:00 local; readings on either side keep their offset.
    assert.equal(
      wallTimeToInstant(wall('2026-03-08T01:30:00'), 'America/New_York').toISOString(),
      '2026-03-08T06:30:00.000Z',
    )
    assert.equal(
      wallTimeToInstant(wall('2026-03-08T03:30:00'), 'America/New_York').toISOString(),
      '2026-03-08T07:30:00.000Z',
    )
  })

  it('round trips through instantToWallTime', () => {
    for (const zone of ['Asia/Tokyo', 'Europe/Berlin', 'America/Los_Angeles', 'Asia/Kolkata']) {
      const source = wall('2026-11-03T23:45:00')
      const instant = wallTimeToInstant(source, zone)
      assert.deepEqual(instantToWallTime(instant, zone), source)
    }
  })
})

describe('parseWallTime', () => {
  it('accepts the datetime-local shapes and rejects the rest', () => {
    assert.deepEqual(parseWallTime('2026-07-22T09:05'), {
      year: 2026,
      month: 7,
      day: 22,
      hour: 9,
      minute: 5,
      second: 0,
    })
    assert.equal(parseWallTime('2026-13-01T00:00'), null)
    assert.equal(parseWallTime('2026-07-22T25:00'), null)
    assert.equal(parseWallTime('yesterday'), null)
  })

  it('formats back into the same string', () => {
    assert.equal(formatWallTime(wall('2026-07-22T09:05')), '2026-07-22T09:05:00')
  })
})

describe('formatOffset', () => {
  it('writes signed hours and minutes', () => {
    assert.equal(formatOffset(540), 'UTC+09:00')
    assert.equal(formatOffset(-300), 'UTC-05:00')
    assert.equal(formatOffset(330), 'UTC+05:30')
    assert.equal(formatOffset(0), 'UTC+00:00')
  })
})

describe('dayShift', () => {
  it('reports the calendar day difference', () => {
    assert.equal(dayShift(wall('2026-07-22T23:00'), wall('2026-07-23T08:00')), 1)
    assert.equal(dayShift(wall('2026-07-22T09:00'), wall('2026-07-21T20:00')), -1)
    assert.equal(dayShift(wall('2026-07-22T09:00'), wall('2026-07-22T20:00')), 0)
  })
})

describe('isValidTimeZone', () => {
  it('separates real zones from typos', () => {
    assert.ok(isValidTimeZone('Asia/Tokyo'))
    assert.ok(!isValidTimeZone('Asia/Tokyoo'))
  })
})
