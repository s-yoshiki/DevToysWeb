import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { test } from 'node:test'
import { decodeCertificate } from './certificate.js'

/** Generated per run so the fixture can never quietly expire. */
const selfSigned = execFileSync(
  'openssl',
  [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-keyout',
    '/dev/null',
    '-nodes',
    '-days',
    '30',
    '-subj',
    '/CN=devtoys.test/O=DevToys',
    '-addext',
    'subjectAltName=DNS:devtoys.test,DNS:www.devtoys.test',
  ],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
).match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/)?.[0] as string

test('decodes subject, issuer and validity from PEM', () => {
  const { count, certificates } = decodeCertificate(selfSigned)
  assert.equal(count, 1)
  const [certificate] = certificates
  assert.equal(certificate.subject.CN, 'devtoys.test')
  assert.equal(certificate.subject.O, 'DevToys')
  assert.equal(certificate.selfSigned, true)
  assert.equal(certificate.expired, false)
  assert.equal(certificate.notYetValid, false)
  assert.ok(certificate.daysRemaining > 25 && certificate.daysRemaining <= 30)
  assert.equal(certificate.keyType, 'rsa')
  assert.equal(certificate.keySize, 2048)
})

test('lists every subject alternative name', () => {
  const [certificate] = decodeCertificate(selfSigned).certificates
  assert.deepEqual(certificate.subjectAltName, ['DNS:devtoys.test', 'DNS:www.devtoys.test'])
})

test('accepts a bare Base64 body without PEM armour', () => {
  const body = selfSigned.replace(/-----(BEGIN|END) CERTIFICATE-----/g, '').replace(/\s+/g, '')
  const [certificate] = decodeCertificate(body).certificates
  assert.equal(certificate.subject.CN, 'devtoys.test')
})

test('decodes every certificate in a bundle', () => {
  assert.equal(decodeCertificate(`${selfSigned}\n${selfSigned}`).count, 2)
})

test('rejects input that is not a certificate', () => {
  assert.throws(() => decodeCertificate('hello world'), /neither PEM nor/)
  assert.throws(() => decodeCertificate(''), /No certificate found/)
  assert.throws(
    () => decodeCertificate('-----BEGIN CERTIFICATE-----\nQUJD\n-----END CERTIFICATE-----'),
    /could not be parsed/,
  )
})
