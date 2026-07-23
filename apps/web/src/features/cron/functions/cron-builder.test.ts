import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  readCronFieldSpec,
  readCronTokens,
  replaceCronToken,
  setCronSeconds,
  writeCronFieldSpec,
} from './cron-builder'

describe('readCronFieldSpec', () => {
  it('recognises the modes the controls can express', () => {
    assert.equal(readCronFieldSpec('minute', '*').mode, 'every')
    assert.equal(readCronFieldSpec('dayOfMonth', '?').mode, 'blank')
    assert.equal(readCronFieldSpec('minute', '30').mode, 'specific')
    assert.equal(readCronFieldSpec('minute', '0,15,30').mode, 'list')
    assert.equal(readCronFieldSpec('hour', '9-17').mode, 'range')
    assert.equal(readCronFieldSpec('minute', '*/15').mode, 'step')
    assert.equal(readCronFieldSpec('minute', '10-59/15').mode, 'step')
  })

  it('keeps the raw token for syntax outside the controls', () => {
    const spec = readCronFieldSpec('dayOfWeek', '5L')
    assert.equal(spec.mode, 'advanced')
    assert.equal(spec.raw, '5L')
    assert.equal(readCronFieldSpec('minute', '0-30/5').mode, 'advanced')
  })

  it('round-trips every mode back to the same token', () => {
    for (const token of ['*', '30', '0,15,30', '*/15', '10-59/15', '5L']) {
      const name = token === '5L' ? 'dayOfWeek' : 'minute'
      assert.equal(writeCronFieldSpec(name, readCronFieldSpec(name, token)), token)
    }
    assert.equal(writeCronFieldSpec('hour', readCronFieldSpec('hour', '9-17')), '9-17')
  })
})

describe('writeCronFieldSpec', () => {
  it('falls back to the low end of the field when a box is empty', () => {
    const blank = { mode: 'specific' as const, value: '', from: '', to: '', step: '', raw: '' }
    assert.equal(writeCronFieldSpec('minute', blank), '0')
    assert.equal(writeCronFieldSpec('dayOfMonth', blank), '1')
    assert.equal(writeCronFieldSpec('month', { ...blank, mode: 'range' }), '1-12')
    assert.equal(writeCronFieldSpec('hour', { ...blank, mode: 'step' }), '*/1')
  })
})

describe('token editing', () => {
  it('replaces one field and leaves the rest alone', () => {
    assert.equal(replaceCronToken('0 9 * * *', 'hour', '12'), '0 12 * * *')
    assert.equal(replaceCronToken('30 0 9 * * *', 'second', '15'), '15 0 9 * * *')
  })

  it('restarts from a wildcard when the expression is not editable', () => {
    assert.equal(readCronTokens('@daily').tokens.join(' '), '* * * * *')
    assert.equal(replaceCronToken('nonsense', 'minute', '5'), '5 * * * *')
  })

  it('adds and drops the seconds field', () => {
    assert.equal(setCronSeconds('0 9 * * *', true), '0 0 9 * * *')
    assert.equal(setCronSeconds('30 0 9 * * *', false), '0 9 * * *')
    assert.equal(setCronSeconds('0 9 * * *', false), '0 9 * * *')
  })
})
