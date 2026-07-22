import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/**
 * Serves `/api/*` from the fixtures during `pnpm dev:mock`. Everything else —
 * Next.js assets, HMR — keeps going to the dev server.
 */
export const startWorker = () =>
  worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' },
    onUnhandledRequest: 'bypass',
    quiet: false,
  })
