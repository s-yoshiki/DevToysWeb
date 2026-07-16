import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { test } from 'node:test'
import { verifyJwt } from './jwt.js'
import { normalizeUrl, resolvePublic } from './network.js'

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url')

test('normalizes a bare domain to HTTPS', () => {
  assert.equal(normalizeUrl('example.com/path').toString(), 'https://example.com/path')
})

test('rejects local and private targets', async () => {
  await assert.rejects(resolvePublic('localhost'), /Local hostnames/)
  await assert.rejects(resolvePublic('127.0.0.1'), /private or reserved/)
  await assert.rejects(resolvePublic('169.254.169.254'), /private or reserved/)
  await assert.rejects(resolvePublic('::ffff:127.0.0.1'), /private or reserved/)
})

test('verifies HS256 signatures and detects tampering', async () => {
  const secret = 'test-secret'
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({ sub: 'devtoys', exp: Math.floor(Date.now() / 1000) + 60 })
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  const token = `${header}.${payload}.${signature}`
  assert.equal((await verifyJwt({ token, secret })).valid, true)

  const tampered = `${header}.${encode({ sub: 'attacker' })}.${signature}`
  const result = await verifyJwt({ token: tampered, secret })
  assert.equal(result.valid, false)
  assert.deepEqual(result.errors, ['Invalid signature'])
})
