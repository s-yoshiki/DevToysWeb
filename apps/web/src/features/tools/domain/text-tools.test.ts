import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  defaultListOptions,
  escapeString,
  escapeTargets,
  formatList,
  unescapeString,
} from './text-tools'

const sample = 'He said "hi"\tok\nC:\\tmp'

describe('escapeString', () => {
  it('round-trips every target', () => {
    for (const target of escapeTargets)
      assert.equal(unescapeString(escapeString(sample, target), target), sample, target)
  })

  it('emits a JSON body without the surrounding quotes', () => {
    assert.equal(escapeString('a"b', 'json'), 'a\\"b')
  })

  it('doubles single quotes for SQL', () => {
    assert.equal(escapeString("O'Brien", 'sql'), "O''Brien")
  })

  it('escapes regex metacharacters so the result matches literally', () => {
    const escaped = escapeString('a.b*c', 'regex')
    assert.ok(new RegExp(`^${escaped}$`).test('a.b*c'))
    assert.ok(!new RegExp(`^${escaped}$`).test('axbxc'))
  })

  it('produces a safely quoted shell word', () => {
    assert.equal(escapeString("it's", 'shell'), `'it'\\''s'`)
  })

  it('only quotes CSV cells that need it', () => {
    assert.equal(escapeString('plain', 'csv'), 'plain')
    assert.equal(escapeString('a,b', 'csv'), '"a,b"')
  })
})

describe('formatList', () => {
  it('trims and drops blank lines by default', () => {
    assert.equal(formatList('  a  \n\n b ', defaultListOptions), 'a\nb')
  })

  it('removes duplicates while preserving first occurrence', () => {
    assert.equal(formatList('b\na\nb', { ...defaultListOptions, unique: true }), 'b\na')
  })

  it('sorts numerically in natural mode', () => {
    assert.equal(
      formatList('item 10\nitem 2', { ...defaultListOptions, sort: 'natural' }),
      'item 2\nitem 10',
    )
  })

  it('wraps each line and joins with the chosen separator', () => {
    assert.equal(
      formatList('a\nb', { ...defaultListOptions, prefix: "'", suffix: "'", separator: ', ' }),
      "'a', 'b'",
    )
  })

  it('right-aligns line numbers to the widest index', () => {
    const value = Array.from({ length: 10 }, (_, index) => `x${index}`).join('\n')
    const lines = formatList(value, { ...defaultListOptions, numbered: true }).split('\n')
    assert.equal(lines[0], ' 1. x0')
    assert.equal(lines[9], '10. x9')
  })
})
