import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { type FieldKey, formatRows, generateRows } from './test-data'

describe('generateRows', () => {
  it('is reproducible for a given seed', () => {
    const a = generateRows(['id', 'fullName', 'email'], 5, 'ja', 42)
    const b = generateRows(['id', 'fullName', 'email'], 5, 'ja', 42)
    assert.deepEqual(a, b)
  })

  it('honours the requested field set and row count', () => {
    const rows = generateRows(['id', 'email'], 3, 'en', 7)
    assert.equal(rows.length, 3)
    for (const row of rows) {
      assert.deepEqual(Object.keys(row), ['id', 'email'])
      assert.match(String(row.email), /@/)
    }
    assert.equal(rows[0].id, 1)
  })
})

describe('formatRows', () => {
  const rows = generateRows(['id', 'fullName'], 2, 'ja', 1)

  it('emits valid JSON', () => {
    const parsed = JSON.parse(formatRows(rows, ['id', 'fullName'], 'json'))
    assert.equal(parsed.length, 2)
  })

  it('emits a CSV header plus one line per row', () => {
    const csv = formatRows(rows, ['id', 'fullName'], 'csv').split('\n')
    assert.equal(csv[0], 'id,fullName')
    assert.equal(csv.length, 3)
  })

  it('escapes SQL string values', () => {
    const keys = ['id', 'note'] as unknown as FieldKey[]
    const sql = formatRows([{ id: 1, note: "O'Brien" }], keys, 'sql')
    assert.match(sql, /'O''Brien'/)
  })
})
