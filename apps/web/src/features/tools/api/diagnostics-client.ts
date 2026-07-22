const configuredApiBase = process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL?.replace(/\/$/, '')

/** CloudFront routes `/api` to the Lambda, so a relative base works in production. */
const apiBase = configuredApiBase
  ? configuredApiBase.endsWith('/api')
    ? configuredApiBase
    : `${configuredApiBase}/api`
  : '/api'

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const callApi = async (path: string, body: unknown) => {
  const payload = JSON.stringify(body)
  const response = await fetch(`${apiBase}${path}`, {
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

export const diagnoseSite = (url: string) => callApi('/diagnose', { url })

export type JwtVerifyRequest = {
  token: string
  issuer?: string
  audience?: string
  secret?: string
  jwks?: string
  publicKey?: string
}

export const verifyJwt = (request: JwtVerifyRequest) => callApi('/jwt/verify', request)
