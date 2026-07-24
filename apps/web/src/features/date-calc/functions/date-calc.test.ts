import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { addDuration, dateDifference, isoWeekNumber } from './date-calc'

describe('dateDifference', () => {
  it('breaks a span into calendar years, months and days', () => {
    const diff = dateDifference(new Date(2020, 0, 15), new Date(2023, 3, 20))
    assert.equal(diff.years, 3)
    assert.equal(diff.months, 3)
    assert.equal(diff.days, 5)
    assert.equal(diff.direction, 1)
  })

  it('borrows across month boundaries', () => {
    const diff = dateDifference(new Date(2023, 0, 31), new Date(2023, 2, 1))
    assert.equal(diff.years, 0)
    assert.equal(diff.months, 1)
    assert.equal(diff.days, 1)
  })

  it('reports direction for a past target', () => {
    const diff = dateDifference(new Date(2023, 5, 1), new Date(2023, 4, 1))
    assert.equal(diff.direction, -1)
    assert.equal(diff.months, 1)
  })

  it('counts total and business days', () => {
    // Mon 2024-01-01 → Mon 2024-01-08 is 7 days, 5 of them weekdays.
    const diff = dateDifference(new Date(2024, 0, 1), new Date(2024, 0, 8))
    assert.equal(diff.totalDays, 7)
    assert.equal(diff.businessDays, 5)
  })
})

describe('addDuration', () => {
  it('adds a calendar duration', () => {
    const result = addDuration(
      new Date(2024, 0, 31),
      { years: 1, months: 1, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
      1,
    )
    // 2024-01-31 + 1y1m normalises through March.
    assert.equal(result.getFullYear(), 2025)
    assert.equal(result.getMonth(), 2)
  })

  it('subtracts when the sign is negative', () => {
    const result = addDuration(
      new Date(2024, 5, 15),
      { years: 0, months: 0, weeks: 1, days: 0, hours: 0, minutes: 0, seconds: 0 },
      -1,
    )
    assert.equal(result.getDate(), 8)
  })
})

describe('isoWeekNumber', () => {
  it('places 2024-01-01 (a Monday) in week 1', () => {
    assert.equal(isoWeekNumber(new Date(2024, 0, 1)), 1)
  })
})
