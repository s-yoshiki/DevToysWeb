import { HttpResponse, http } from 'msw'
import { diagnoseFixture, jwtVerifyFixture, whoisFixture } from './fixtures'

/**
 * Handlers for every `apps/api` route the browser calls. Paths start with `*`
 * so they match both the relative `/api` base used behind CloudFront and an
 * absolute `NEXT_PUBLIC_DIAGNOSTICS_API_URL`.
 */

const failed = (fallback: string) => (reason: unknown) =>
  HttpResponse.json({ error: reason instanceof Error ? reason.message : fallback }, { status: 400 })

const body = async <Payload>(request: Request) => {
  try {
    return (await request.json()) as Payload
  } catch {
    throw new Error('A JSON body is required')
  }
}

export const handlers = [
  http.get('*/api/health', () => HttpResponse.json({ status: 'ok' })),

  http.post('*/api/diagnose', async ({ request }) => {
    try {
      const payload = await body<{ url?: unknown }>(request)
      if (typeof payload.url !== 'string' || !payload.url || payload.url.length > 2048)
        return HttpResponse.json({ error: 'A valid URL is required' }, { status: 400 })
      return HttpResponse.json(diagnoseFixture(payload.url))
    } catch (reason) {
      return failed('Diagnostics failed')(reason)
    }
  }),

  http.post('*/api/whois', async ({ request }) => {
    try {
      const payload = await body<{ domain?: unknown }>(request)
      if (typeof payload.domain !== 'string' || !payload.domain || payload.domain.length > 253)
        return HttpResponse.json({ error: 'A valid domain is required' }, { status: 400 })
      return HttpResponse.json(whoisFixture(payload.domain))
    } catch (reason) {
      return failed('WHOIS lookup failed')(reason)
    }
  }),

  http.post('*/api/jwt/verify', async ({ request }) => {
    try {
      const payload = await body<Parameters<typeof jwtVerifyFixture>[0]>(request)
      if (typeof payload.token !== 'string' || !payload.token || payload.token.length > 32_000)
        return HttpResponse.json({ error: 'A valid JWT is required' }, { status: 400 })
      // Only the fields the Lambda reads are forwarded, so a client sending the
      // wrong key field fails here exactly as it would in production.
      return HttpResponse.json(
        jwtVerifyFixture({
          token: payload.token,
          secret: payload.secret,
          publicKey: payload.publicKey,
          jwksUrl: payload.jwksUrl,
          issuer: payload.issuer,
          audience: payload.audience,
        }),
      )
    } catch (reason) {
      return failed('JWT verification failed')(reason)
    }
  }),
]
