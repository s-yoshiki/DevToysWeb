import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatClock, formatPrecise, splitDuration, toMilliseconds } from './duration'

describe('splitDuration', () => {
  it('breaks milliseconds into clock parts', () => {
    assert.deepEqual(splitDuration(3_723_450), {
      hours: 1,
      minutes: 2,
      seconds: 3,
      centiseconds: 45,
    })
  })

  it('clamps negative input to zero', () => {
    assert.deepEqual(splitDuration(-5), { hours: 0, minutes: 0, seconds: 0, centiseconds: 0 })
  })
})

describe('formatClock', () => {
  it('omits the hour segment below one hour', () => {
    assert.equal(formatClock(65_000), '01:05')
  })

  it('adds the hour segment once it is reached', () => {
    assert.equal(formatClock(3_600_000), '1:00:00')
  })
})

describe('formatPrecise', () => {
  it('appends hundredths', () => {
    assert.equal(formatPrecise(9_870), '00:09.87')
  })
})

describe('toMilliseconds', () => {
  it('sums the supplied fields', () => {
    assert.equal(toMilliseconds({ minutes: 2, seconds: 30 }), 150_000)
  })

  it('never returns a negative duration', () => {
    assert.equal(toMilliseconds({ seconds: -10 }), 0)
  })
})
