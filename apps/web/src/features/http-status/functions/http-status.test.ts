import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { filterHttpStatuses, findHttpStatus, httpStatuses, statusClassOf } from './http-status'

describe('httpStatuses', () => {
  it('lists codes in ascending order without duplicates', () => {
    const codes = httpStatuses.map((status) => status.code)
    assert.deepEqual(
      codes,
      [...codes].sort((a, b) => a - b),
    )
    assert.equal(new Set(codes).size, codes.length)
  })

  it('covers the codes every API ends up needing', () => {
    for (const code of [200, 201, 204, 301, 304, 400, 401, 403, 404, 409, 422, 429, 500, 503]) {
      assert.ok(findHttpStatus(code), `missing ${code}`)
    }
  })

  it('carries a bilingual summary and a defining document for every entry', () => {
    for (const status of httpStatuses) {
      assert.ok(status.summary.ja.length > 0, `${status.code} has no Japanese summary`)
      assert.ok(status.summary.en.length > 0, `${status.code} has no English summary`)
      assert.match(status.reference, /^RFC \d+ §/, `${status.code} has no reference`)
    }
  })
})

describe('statusClassOf', () => {
  it('groups by the leading digit', () => {
    assert.equal(statusClassOf(100), '1xx')
    assert.equal(statusClassOf(204), '2xx')
    assert.equal(statusClassOf(451), '4xx')
    assert.equal(statusClassOf(511), '5xx')
  })
})

describe('filterHttpStatuses', () => {
  it('matches by code, reason phrase, and description', () => {
    assert.equal(filterHttpStatuses(httpStatuses, '418', 'all')[0]?.phrase, "I'm a Teapot")
    assert.equal(filterHttpStatuses(httpStatuses, 'teapot', 'all')[0]?.code, 418)
    assert.equal(filterHttpStatuses(httpStatuses, 'レート制限', 'all')[0]?.code, 429)
  })

  it('matches by the defining document', () => {
    assert.ok(filterHttpStatuses(httpStatuses, 'RFC 4918', 'all').length > 0)
  })

  it('combines a query with a class filter', () => {
    assert.deepEqual(filterHttpStatuses(httpStatuses, 'teapot', '5xx'), [])
    assert.ok(
      filterHttpStatuses(httpStatuses, '', '3xx').every(
        (status) => status.code >= 300 && status.code < 400,
      ),
    )
  })

  it('returns everything for an empty query and class', () => {
    assert.equal(filterHttpStatuses(httpStatuses, '  ', 'all').length, httpStatuses.length)
  })
})
