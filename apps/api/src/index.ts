import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { diagnose } from './diagnostics.js'
import { verifyJwt } from './jwt.js'

const app = new Hono()

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

app.notFound((context) => context.json({ message: 'Not Found' }, 404))

export const handler = handle(app)
