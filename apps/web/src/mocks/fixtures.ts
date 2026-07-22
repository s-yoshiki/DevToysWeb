import type { SiteReport, WhoisReport } from '@/features/tools/api/diagnostics-client'

/**
 * Canned payloads shaped like the real `apps/api` responses, so the browser
 * worker and the Node test server can both answer without a Lambda.
 *
 * The fixtures are derived from the request rather than hard-coded per URL: the
 * checkers are only interesting when a healthy page, a sloppy page and a
 * rejected target can all be reached from the same input field.
 */

export type Settled<Value> = { value: Value } | { error: string }

/** `/api/diagnose` returns more than {@link SiteReport}; the diagnostics
 * workspace prints the DNS and TLS sections verbatim, so mocks carry them. */
export type DiagnoseResponse = SiteReport & {
  dns: Record<string, Settled<unknown>>
  tls: Settled<Record<string, unknown>>
}

/** Mirrors `normalizeUrl` in `apps/api/src/network.ts`, including its messages. */
export const normalizeUrl = (input: string) => {
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`)
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('Only HTTP and HTTPS URLs are supported')
  if (url.username || url.password) throw new Error('URLs containing credentials are not supported')
  if (url.port && !['80', '443'].includes(url.port))
    throw new Error('Only ports 80 and 443 are supported')
  return url
}

const privateHostname =
  /^(?:localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.)/

/** Mirrors the SSRF guard so the blocked-target error can be exercised offline. */
export const assertPublicHostname = (hostname: string) => {
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local'))
    throw new Error('Local hostnames are not allowed')
  if (privateHostname.test(hostname))
    throw new Error('The hostname resolves to a private or reserved address')
  return hostname
}

/**
 * Scenario hostnames. Anything else gets the healthy fixture, so an arbitrary
 * URL still produces a sensible report while these reproduce the edge cases.
 */
export const scenarioHosts = {
  /** Meta tags and headings missing, so every checker reports warnings. */
  sloppy: 'sloppy.example.com',
  /** The upstream request fails, so the workspaces show their error banner. */
  unreachable: 'unreachable.example.com',
  /** Answers 404 with a redirect chain in front of it. */
  redirected: 'redirected.example.com',
} as const

const healthyPage = (url: URL): SiteReport['page'] => ({
  title: `${url.hostname} — a perfectly reasonable page title`,
  description:
    'A meta description long enough to be useful in a search result listing, but not so long that it gets truncated.',
  canonical: url.toString(),
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  'og:type': 'website',
  'og:site_name': url.hostname,
  'og:title': `${url.hostname} — a perfectly reasonable page title`,
  'og:description': 'What this page is about, in one sentence that fits a social card.',
  'og:url': url.toString(),
  'og:image': `${url.origin}/og.png`,
  'twitter:card': 'summary_large_image',
  'twitter:site': '@devtoys',
})

const sloppyPage = (url: URL): SiteReport['page'] => ({
  title: 'Home',
  canonical: `${url.origin}/index.html?utm_source=newsletter`,
})

const healthySignals = (): SiteReport['signals'] => ({
  lang: 'ja',
  charset: 'utf-8',
  h1: ['The one heading'],
  h2: ['Overview', 'Pricing', 'FAQ'],
  images: { total: 8, missingAlt: 0 },
  links: { total: 42, external: 6, internal: 36 },
  textLength: 4210,
})

const sloppySignals = (): SiteReport['signals'] => ({
  lang: null,
  charset: null,
  h1: ['Welcome', 'Welcome again'],
  h2: [],
  images: { total: 12, missingAlt: 7 },
  links: { total: 3, external: 3, internal: 0 },
  textLength: 180,
})

const responseHeaders = (secure: boolean): SiteReport['http']['headers'] => ({
  'content-type': 'text/html; charset=utf-8',
  server: 'mock-origin',
  'cache-control': 'public, max-age=300',
  ...(secure
    ? {
        'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
        'content-security-policy': "default-src 'self'",
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'geolocation=(), microphone=()',
      }
    : {}),
})

const securityHeaders = (headers: SiteReport['http']['headers']) =>
  Object.fromEntries(
    [
      'strict-transport-security',
      'content-security-policy',
      'x-content-type-options',
      'x-frame-options',
      'referrer-policy',
      'permissions-policy',
    ].map((key) => [key, (Array.isArray(headers[key]) ? headers[key][0] : headers[key]) ?? null]),
  )

const dnsFixture = (hostname: string): DiagnoseResponse['dns'] => ({
  a: { value: ['93.184.216.34'] },
  aaaa: { value: ['2606:2800:220:1:248:1893:25c8:1946'] },
  cname: { error: `queryCname ENODATA ${hostname}` },
  mx: { value: [{ exchange: `mail.${hostname}`, priority: 10 }] },
  txt: { value: [['v=spf1 -all']] },
  ns: { value: [`ns1.${hostname}`, `ns2.${hostname}`] },
})

const tlsFixture = (url: URL): DiagnoseResponse['tls'] =>
  url.protocol === 'https:'
    ? {
        value: {
          protocol: 'TLSv1.3',
          cipher: 'TLS_AES_128_GCM_SHA256',
          subject: { CN: url.hostname },
          issuer: { O: 'Mock CA', CN: 'Mock CA R3' },
          validFrom: 'Jan  1 00:00:00 2026 GMT',
          validTo: 'Apr  1 23:59:59 2026 GMT',
          daysRemaining: 70,
          subjectAltNames: [`DNS:${url.hostname}`, `DNS:www.${url.hostname}`],
        },
      }
    : { error: 'TLS inspection requires an HTTPS URL' }

/** Throws the same `Error` messages the Lambda would for rejected targets. */
export const diagnoseFixture = (input: string): DiagnoseResponse => {
  const url = normalizeUrl(input)
  assertPublicHostname(url.hostname)
  if (url.hostname === scenarioHosts.unreachable)
    throw new Error('The hostname has no A or AAAA record')

  const sloppy = url.hostname === scenarioHosts.sloppy
  const redirected = url.hostname === scenarioHosts.redirected
  const headers = responseHeaders(url.protocol === 'https:' && !sloppy)
  const finalUrl = redirected ? `${url.origin}/moved/` : url.toString()

  return {
    target: url.toString(),
    dns: dnsFixture(url.hostname),
    http: {
      finalUrl,
      status: redirected ? 404 : 200,
      durationMs: sloppy ? 1840 : 132,
      redirects: redirected ? [url.toString(), `${url.origin}/moved/`] : [],
      headers,
      securityHeaders: securityHeaders(headers),
    },
    tls: tlsFixture(url),
    page: sloppy ? sloppyPage(url) : healthyPage(url),
    signals: sloppy ? sloppySignals() : healthySignals(),
  }
}

const hostnamePattern = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

/** Mirrors `assertQueryableHostname` in `apps/api/src/lookup.ts`. */
export const assertQueryableHostname = (input: string) => {
  const value = input.trim().toLowerCase().replace(/\.$/, '')
  if (!hostnamePattern.test(value)) throw new Error('Enter a valid public domain name')
  if (value === 'localhost' || value.endsWith('.localhost') || value.endsWith('.local'))
    throw new Error('Local hostnames are not allowed')
  return value
}

const whoisText = (domain: string) => `Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.mock-registrar.test
Registrar: Mock Registrar, Inc.
Creation Date: 1995-08-14T04:00:00Z
Updated Date: 2026-01-09T07:21:44Z
Registry Expiry Date: 2027-08-13T04:00:00Z
Domain Status: clientTransferProhibited
Name Server: NS1.${domain.toUpperCase()}
Name Server: NS2.${domain.toUpperCase()}
DNSSEC: signedDelegation
>>> Last update of whois database: 2026-07-22T03:00:00Z <<<
`

export const whoisFixture = (input: string): WhoisReport => {
  const domain = assertQueryableHostname(input)
  if (domain === scenarioHosts.unreachable) throw new Error('WHOIS request timed out')
  const raw = whoisText(domain)
  return {
    domain,
    servers: ['whois.iana.org', 'whois.verisign-grs.com', 'whois.mock-registrar.test'],
    summary: {
      registrar: 'Mock Registrar, Inc.',
      createdAt: '1995-08-14T04:00:00Z',
      updatedAt: '2026-01-09T07:21:44Z',
      expiresAt: '2027-08-13T04:00:00Z',
      status: 'clientTransferProhibited',
    },
    raw,
  }
}

const base64UrlToJson = (segment: string) => {
  const padded = segment
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>
}

const supportedAlgorithms = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
]

export type JwtVerifyResponse = {
  valid: boolean
  signatureValid: boolean
  header: Record<string, unknown>
  payload: Record<string, unknown>
  errors: string[]
}

/**
 * Decodes the token for real and replays the Lambda's claim checks; only the
 * signature is faked, since the mock holds no key material. A key containing
 * `invalid` produces a signature failure so that branch stays reachable.
 */
export const jwtVerifyFixture = (input: {
  token: string
  secret?: string
  publicKey?: string
  jwksUrl?: string
  issuer?: string
  audience?: string
}): JwtVerifyResponse => {
  const parts = input.token.trim().split('.')
  if (parts.length !== 3) throw new Error('JWT must contain three parts')
  const header = base64UrlToJson(parts[0])
  const payload = base64UrlToJson(parts[1])
  const algorithm = typeof header.alg === 'string' ? header.alg : ''
  if (!algorithm || algorithm === 'none' || !supportedAlgorithms.includes(algorithm))
    throw new Error('Unsupported or unsafe JWT algorithm')

  const key = input.secret ?? input.publicKey ?? input.jwksUrl
  if (algorithm.startsWith('HS')) {
    if (!input.secret) throw new Error('A secret is required for HMAC tokens')
  } else if (!input.publicKey && !input.jwksUrl) {
    throw new Error('A public key or JWKS URL is required')
  }

  const now = Math.floor(Date.now() / 1000)
  const signatureValid = Boolean(key) && !key?.includes('invalid')
  const errors: string[] = []
  if (!signatureValid) errors.push('Invalid signature')
  if (typeof payload.exp === 'number' && payload.exp <= now) errors.push('Token has expired')
  if (typeof payload.nbf === 'number' && payload.nbf > now) errors.push('Token is not active yet')
  if (input.issuer && payload.iss !== input.issuer) errors.push('Issuer does not match')
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
  if (input.audience && !audiences.includes(input.audience)) errors.push('Audience does not match')

  return { valid: errors.length === 0, signatureValid, header, payload, errors }
}
