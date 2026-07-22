'use client'

import { useEffect } from 'react'

/**
 * Both flags are inlined at build time, so a production export drops this branch
 * — and the dynamic import with it — leaving no MSW code in the shipped bundle.
 */
const enabled =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKS === 'enabled'

/**
 * Starts the mock service worker so the server-backed tools (site diagnostics,
 * WHOIS, OGP, SEO, JWT) can be exercised without `apps/api`. Children always
 * render: the worker registers during hydration, well before a tool is run.
 */
export const ApiMockProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!enabled) return
    void import('./browser').then(({ startWorker }) => startWorker())
  }, [])

  return children
}
