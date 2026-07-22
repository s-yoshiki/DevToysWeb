import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  formatTimeAnnouncement,
  formatWallClock,
  nextSlotAt,
  nextTelephoneSignalAt,
  slotIndex,
} from './time-signal'

const at = (hours: number, minutes: number, seconds = 0) =>
  new Date(2026, 0, 15, hours, minutes, seconds)

describe('slotIndex', () => {
  it('changes exactly on the hour for the hourly interval', () => {
    assert.equal(slotIndex(at(9, 59, 59), 60), slotIndex(at(9, 0), 60))
    assert.notEqual(slotIndex(at(10, 0), 60), slotIndex(at(9, 59, 59), 60))
  })

  it('splits the hour for shorter intervals', () => {
    assert.equal(slotIndex(at(9, 14), 15), slotIndex(at(9, 0), 15))
    assert.notEqual(slotIndex(at(9, 15), 15), slotIndex(at(9, 14), 15))
  })
})

describe('nextSlotAt', () => {
  it('rounds up to the next boundary', () => {
    assert.deepEqual(nextSlotAt(at(9, 22, 30), 15), at(9, 30))
    assert.deepEqual(nextSlotAt(at(9, 0, 1), 60), at(10, 0))
  })

  it('rolls into the next day after the last slot', () => {
    assert.deepEqual(nextSlotAt(at(23, 40), 60), new Date(2026, 0, 16, 0, 0, 0, 0))
  })
})

describe('formatWallClock', () => {
  it('zero-pads every part', () => {
    assert.equal(formatWallClock(at(9, 5, 3)), '09:05:03')
  })
})

describe('nextTelephoneSignalAt', () => {
  it('uses the next 10-second boundary', () => {
    assert.deepEqual(nextTelephoneSignalAt(at(9, 5, 3)), at(9, 5, 10))
    assert.deepEqual(nextTelephoneSignalAt(at(9, 5, 9), 5_000), at(9, 5, 20))
  })
})

describe('formatTimeAnnouncement', () => {
  it('formats Japanese announcements like the 117 service', () => {
    assert.equal(formatTimeAnnouncement(at(9, 5, 10), 'ja'), '午前9時5分10秒をお知らせします')
    assert.equal(formatTimeAnnouncement(at(12, 30, 20), 'ja'), '午後0時30分20秒をお知らせします')
  })

  it('formats an English announcement', () => {
    assert.equal(
      formatTimeAnnouncement(at(21, 5, 10), 'en'),
      'At the tone, the time will be 9 hours, 5 minutes, and 10 seconds P.M.',
    )
  })
})
