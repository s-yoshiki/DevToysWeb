import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { decodeCertificate } from './certificate.js'
import { diagnose } from './diagnostics.js'
import { verifyJwt } from './jwt.js'
import { isRecordType, lookupDns, lookupWhois } from './lookup.js'

const app = new Hono()

const failed = (fallback: string) => (reason: unknown) => {
  console.error(reason)
  return { error: reason instanceof Error ? reason.message : fallback } as const
}

app.get('/api/health', (context) => context.json({ status: 'ok' }))

app.post('/api/diagnose', async (context) => {
  try {
    const body = await context.req.json<{ url?: unknown }>()
    if (typeof body.url !== 'string' || !body.url || body.url.length > 2048)
      return context.json({ error: 'A valid URL is required' }, 400)
    return context.json(await diagnose(body.url))
  } catch (reason) {
    console.error(reason)
    return context.json(
      { error: reason instanceof Error ? reason.message : 'Diagnostics failed' },
      400,
    )
  }
})

app.post('/api/jwt/verify', async (context) => {
  try {
    const body = await context.req.json()
    if (typeof body.token !== 'string' || !body.token || body.token.length > 32_000)
      return context.json({ error: 'A valid JWT is required' }, 400)
    return context.json(await verifyJwt(body))
  } catch (reason) {
    console.error(reason)
    return context.json(
      { error: reason instanceof Error ? reason.message : 'JWT verification failed' },
      400,
    )
  }
})

app.post('/api/dns', async (context) => {
  try {
    const body = await context.req.json<{ hostname?: unknown; types?: unknown }>()
    if (typeof body.hostname !== 'string' || !body.hostname || body.hostname.length > 253)
      return context.json({ error: 'A valid hostname is required' }, 400)
    const types = Array.isArray(body.types) ? body.types.filter(isRecordType) : undefined
    return context.json(await lookupDns(body.hostname, types))
  } catch (reason) {
    return context.json(failed('DNS lookup failed')(reason), 400)
  }
})

app.post('/api/whois', async (context) => {
  try {
    const body = await context.req.json<{ domain?: unknown }>()
    if (typeof body.domain !== 'string' || !body.domain || body.domain.length > 253)
      return context.json({ error: 'A valid domain is required' }, 400)
    return context.json(await lookupWhois(body.domain))
  } catch (reason) {
    return context.json(failed('WHOIS lookup failed')(reason), 400)
  }
})

app.post('/api/certificate', async (context) => {
  try {
    const body = await context.req.json<{ pem?: unknown }>()
    if (typeof body.pem !== 'string' || !body.pem || body.pem.length > 200_000)
      return context.json({ error: 'A PEM or Base64 certificate is required' }, 400)
    return context.json(decodeCertificate(body.pem))
  } catch (reason) {
    return context.json(failed('Certificate decoding failed')(reason), 400)
  }
})

app.notFound((context) => context.json({ message: 'Not Found' }, 404))

export const handler = handle(app)
