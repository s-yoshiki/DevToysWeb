/**
 * CloudFront routes `/api` to the Lambda, so a relative base works in
 * production. Resolved per call so tests can point the client at a mock origin.
 */
const apiBase = () => {
  const configured = process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL?.replace(/\/$/, '')
  if (!configured) return '/api'
  return configured.endsWith('/api') ? configured : `${configured}/api`
}

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const callApi = async (path: string, body: unknown) => {
  const payload = JSON.stringify(body)
  const response = await fetch(`${apiBase()}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-amz-content-sha256': await sha256(payload),
    },
    body: payload,
  })
  const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
  if (!response.ok) throw new Error(result.error ?? `HTTP ${response.status}`)
  return result
}

/** Mirrors the fields of `/api/diagnose` that the page-oriented tools render. */
export type SiteReport = {
  target: string
  http: {
    finalUrl: string
    status: number
    durationMs: number
    redirects: string[]
    headers: Record<string, string | string[]>
    securityHeaders: Record<string, string | null>
  }
  page: Record<string, string>
  signals: {
    lang: string | null
    charset: string | null
    h1: string[]
    h2: string[]
    images: { total: number; missingAlt: number }
    links: { total: number; external: number; internal: number }
    textLength: number
  }
}

export const diagnoseSite = (url: string) => callApi('/diagnose', { url })
export const inspectPage = (url: string) => callApi('/diagnose', { url }) as Promise<SiteReport>

export type WhoisReport = {
  domain: string
  servers: string[]
  summary: Record<string, string | null>
  raw: string
}

export const lookupWhois = (domain: string) => callApi('/whois', { domain }) as Promise<WhoisReport>

export type JwtVerifyRequest = {
  token: string
  issuer?: string
  audience?: string
  secret?: string
  jwksUrl?: string
  publicKey?: string
}

export const verifyJwt = (request: JwtVerifyRequest) => callApi('/jwt/verify', request)
