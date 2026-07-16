import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/api/health', (context) => context.json({ status: 'ok' }))

app.notFound((context) => context.json({ message: 'Not Found' }, 404))

export const handler = handle(app)
