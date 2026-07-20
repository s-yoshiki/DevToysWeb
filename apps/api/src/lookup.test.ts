import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertQueryableHostname, isRecordType } from './lookup.js'

test('normalizes a hostname and drops the trailing root dot', () => {
  assert.equal(assertQueryableHostname(' Example.COM. '), 'example.com')
})

test('rejects hostnames that are not public domains', () => {
  for (const value of ['localhost', 'db.local', 'app.localhost', 'no-tld', '10.0.0.1', ''])
    assert.throws(() => assertQueryableHostname(value), Error, value)
})

test('rejects a query smuggling a scheme, path or port', () => {
  for (const value of ['https://example.com', 'example.com/path', 'example.com:443'])
    assert.throws(() => assertQueryableHostname(value), Error, value)
})

test('only accepts known record types', () => {
  assert.ok(isRecordType('caa'))
  assert.ok(!isRecordType('any'))
  assert.ok(!isRecordType(42))
})
