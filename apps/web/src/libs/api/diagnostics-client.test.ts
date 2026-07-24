import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { HttpResponse, http } from 'msw'
import { auditSeo, countByLevel } from '@/features/seo-check/functions/seo-audit'
import { scenarioHosts } from '@/mocks/fixtures'
import { installMockApi, server } from '@/mocks/node'
import { diagnoseSite, inspectPage, lookupWhois, verifyJwt } from './diagnostics-client'

installMockApi()

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url')

const signedToken = (payload: Record<string, unknown>, alg = 'HS256') =>
  `${encode({ alg, typ: 'JWT' })}.${encode(payload)}.c2lnbmF0dXJl`

test('sends the signed-payload header CloudFront requires', async () => {
  let seen: Request | undefined
  server.use(
    http.post('*/api/whois', async ({ request }) => {
      seen = request.clone()
      return HttpResponse.json({ domain: 'example.com', servers: [], summary: {}, raw: '' })
    }),
  )

  await lookupWhois('example.com')
  assert.ok(seen)
  const body = await seen.text()
  assert.equal(body, JSON.stringify({ domain: 'example.com' }))
  assert.equal(seen.headers.get('content-type'), 'application/json')
  assert.equal(
    seen.headers.get('x-amz-content-sha256'),
    createHash('sha256').update(body).digest('hex'),
  )
})

test('returns a page report for a healthy site', async () => {
  const report = await inspectPage('https://example.com')
  assert.equal(report.http.status, 200)
  assert.equal(report.signals.images.missingAlt, 0)
  assert.equal(report.page['twitter:card'], 'summary_large_image')
  assert.equal(
    report.http.securityHeaders['strict-transport-security'],
    'max-age=63072000; includeSubDomains; preload',
  )
})

test('the sloppy fixture drives the SEO checker into warnings and failures', async () => {
  const healthy = countByLevel(auditSeo(await inspectPage('https://example.com')))
  assert.equal(healthy.fail, 0)

  const sloppy = countByLevel(auditSeo(await inspectPage(`https://${scenarioHosts.sloppy}`)))
  assert.ok(sloppy.fail > 0, 'expected the sloppy fixture to fail some checks')
  assert.ok(sloppy.warn > 0, 'expected the sloppy fixture to warn on some checks')
})

test('diagnostics carries the DNS and TLS sections the workspace prints', async () => {
  const report = (await diagnoseSite('example.com')) as Record<string, unknown>
  assert.equal((report as { target: string }).target, 'https://example.com/')
  assert.ok('dns' in report && 'tls' in report)
})

test('rejects targets the SSRF guard would block', async () => {
  await assert.rejects(inspectPage('http://localhost'), /Local hostnames are not allowed/)
  await assert.rejects(inspectPage('https://10.0.0.1'), /private or reserved address/)
  await assert.rejects(inspectPage('ftp://example.com'), /Only HTTP and HTTPS URLs/)
  await assert.rejects(inspectPage('http://localhost:3000'), /Only ports 80 and 443/)
})

test('surfaces upstream failures as errors, not empty reports', async () => {
  await assert.rejects(inspectPage(`https://${scenarioHosts.unreachable}`), /no A or AAAA record/)
})

test('looks up WHOIS and validates the domain', async () => {
  const report = await lookupWhois('Example.COM.')
  assert.equal(report.domain, 'example.com')
  assert.equal(report.summary.registrar, 'Mock Registrar, Inc.')
  assert.ok(report.raw.includes('Registry Expiry Date'))

  await assert.rejects(lookupWhois('not a domain'), /valid public domain name/)
})

test('verifies a JWT and reports claim failures', async () => {
  const future = Math.floor(Date.now() / 1000) + 3600
  const ok = (await verifyJwt({
    token: signedToken({ sub: 'devtoys', iss: 'https://issuer.test', exp: future }),
    secret: 'test-secret',
    issuer: 'https://issuer.test',
  })) as { valid: boolean; payload: Record<string, unknown> }
  assert.equal(ok.valid, true)
  assert.equal(ok.payload.sub, 'devtoys')

  const expired = (await verifyJwt({
    token: signedToken({ sub: 'devtoys', exp: 1 }),
    secret: 'test-secret',
  })) as { valid: boolean; errors: string[] }
  assert.equal(expired.valid, false)
  assert.deepEqual(expired.errors, ['Token has expired'])

  await assert.rejects(
    verifyJwt({ token: signedToken({}, 'none') }),
    /Unsupported or unsafe JWT algorithm/,
  )
})

test('sends JWKS material under the field name the API reads', async () => {
  const result = (await verifyJwt({
    token: signedToken({ sub: 'devtoys' }, 'RS256'),
    jwksUrl: 'https://issuer.test/.well-known/jwks.json',
  })) as { signatureValid: boolean }
  assert.equal(result.signatureValid, true)
})
