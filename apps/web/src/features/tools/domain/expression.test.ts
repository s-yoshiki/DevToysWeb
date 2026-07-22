import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { evaluateExpression, formatResult } from './expression'

const close = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} !== ${expected}`)

describe('evaluateExpression', () => {
  it('applies the usual precedence and associativity', () => {
    assert.equal(evaluateExpression('1 + 2 * 3'), 7)
    assert.equal(evaluateExpression('(1 + 2) * 3'), 9)
    assert.equal(evaluateExpression('2 ^ 3 ^ 2'), 512)
    assert.equal(evaluateExpression('-2 ^ 2'), -4)
    assert.equal(evaluateExpression('10 % 4'), 2)
  })

  it('reads implicit multiplication', () => {
    assert.equal(evaluateExpression('3(4 + 1)'), 15)
    close(evaluateExpression('2pi'), Math.PI * 2)
    assert.equal(evaluateExpression('2sqrt(9)'), 6)
  })

  it('accepts keypad glyphs and exponent notation', () => {
    assert.equal(evaluateExpression('6 × 7'), 42)
    assert.equal(evaluateExpression('84 ÷ 2'), 42)
    assert.equal(evaluateExpression('1.5e3'), 1500)
    close(evaluateExpression('2 × π'), Math.PI * 2)
  })

  it('keeps e as Euler constant when no exponent digits follow', () => {
    close(evaluateExpression('e'), Math.E)
    close(evaluateExpression('2e'), Math.E * 2)
  })

  it('switches trigonometry between degrees and radians', () => {
    close(evaluateExpression('sin(90)', 'deg'), 1)
    close(evaluateExpression('sin(pi / 2)', 'rad'), 1)
    close(evaluateExpression('asin(1)', 'deg'), 90)
  })

  it('supports postfix factorial and multi-argument functions', () => {
    assert.equal(evaluateExpression('5!'), 120)
    assert.equal(evaluateExpression('max(3, 9, 4)'), 9)
    assert.equal(evaluateExpression('logb(8, 2)'), 3)
  })

  it('rejects malformed input instead of guessing', () => {
    assert.throws(() => evaluateExpression('1 +'), /Unexpected end/)
    assert.throws(() => evaluateExpression('(1 + 2'), /Expected "\)"/)
    assert.throws(() => evaluateExpression('sin()'), /takes 1 argument/)
    assert.throws(() => evaluateExpression('foo(2)'), /Unknown name/)
    assert.throws(() => evaluateExpression('2 @ 3'), /Unexpected character/)
    assert.throws(() => evaluateExpression(''), /Enter an expression/)
  })

  it('refuses results that are not usable numbers', () => {
    assert.throws(() => evaluateExpression('1 / 0'), /not finite/)
    assert.throws(() => evaluateExpression('sqrt(-1)'), /not a number/)
  })
})

describe('formatResult', () => {
  it('hides binary floating point noise', () => {
    assert.equal(formatResult(0.1 + 0.2), '0.3')
    assert.equal(formatResult(1 / 3), '0.333333333333')
  })

  it('keeps integers whole and leaves the extremes exponential', () => {
    assert.equal(formatResult(42), '42')
    assert.equal(formatResult(1e20), '100000000000000000000')
    assert.equal(formatResult(1e21), '1e+21')
    assert.equal(formatResult(1e-12), '1e-12')
  })
})
