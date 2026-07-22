import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { bitLength, formatInBase, groupDigits, parseInBase, twosComplement } from './number-base'

describe('parseInBase', () => {
  it('reads the common bases', () => {
    assert.equal(parseInBase('255', 10), 255n)
    assert.equal(parseInBase('ff', 16), 255n)
    assert.equal(parseInBase('11111111', 2), 255n)
    assert.equal(parseInBase('zz', 36), 1295n)
  })

  it('keeps precision far beyond Number.MAX_SAFE_INTEGER', () => {
    assert.equal(parseInBase('FFFFFFFFFFFFFFFF', 16), 18446744073709551615n)
  })

  it('ignores separators and honours a sign', () => {
    assert.equal(parseInBase('1111_0000', 2), 240n)
    assert.equal(parseInBase('1,234', 10), 1234n)
    assert.equal(parseInBase('-1f', 16), -31n)
  })

  it('accepts a prefix only when it matches the base', () => {
    assert.equal(parseInBase('0xff', 16), 255n)
    assert.equal(parseInBase('0b1010', 2), 10n)
    assert.throws(() => parseInBase('0xff', 10), /does not match base 10/)
  })

  it('rejects digits outside the base and empty input', () => {
    assert.throws(() => parseInBase('2', 2), /not a valid digit in base 2/)
    assert.throws(() => parseInBase('  ', 10), /Enter a number/)
    assert.throws(() => parseInBase('10', 64), /between 2 and 36/)
  })
})

describe('formatInBase', () => {
  it('writes upper case digits', () => {
    assert.equal(formatInBase(255n, 16), 'FF')
    assert.equal(formatInBase(-255n, 2), '-11111111')
  })
})

describe('groupDigits', () => {
  it('groups from the right and keeps the sign outside', () => {
    assert.equal(groupDigits('11110000', 4), '1111 0000')
    assert.equal(groupDigits('1234567', 3), '1 234 567')
    assert.equal(groupDigits('-FF00', 2), '-FF 00')
  })
})

describe('bitLength', () => {
  it('measures the magnitude', () => {
    assert.equal(bitLength(0n), 0)
    assert.equal(bitLength(255n), 8)
    assert.equal(bitLength(-256n), 9)
  })
})

describe('twosComplement', () => {
  it('wraps negatives into the requested width', () => {
    assert.equal(twosComplement(-1n, 8), 255n)
    assert.equal(twosComplement(-128n, 8), 128n)
    assert.equal(twosComplement(127n, 8), 127n)
  })

  it('reports values that do not fit', () => {
    assert.equal(twosComplement(-129n, 8), null)
    assert.equal(twosComplement(256n, 8), null)
    assert.equal(twosComplement(255n, 8), 255n)
  })
})
