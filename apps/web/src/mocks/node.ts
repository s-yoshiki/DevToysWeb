import { after, afterEach, before } from 'node:test'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Node-side counterpart of `browser.ts`, used by `*.test.ts` files that exercise
 * the `/api` clients. Relative URLs cannot be fetched outside a browser, so the
 * tests point the client at this absolute base; MSW answers it either way.
 */
export const mockApiBaseUrl = 'https://api.mock.devtoys.test'

export const server = setupServer(...handlers)

/**
 * Installs the mock API for the calling test file. Unhandled requests fail the
 * test rather than escaping to the network.
 */
export const installMockApi = () => {
  before(() => {
    process.env.NEXT_PUBLIC_DIAGNOSTICS_API_URL = mockApiBaseUrl
    server.listen({ onUnhandledRequest: 'error' })
  })
  afterEach(() => server.resetHandlers())
  after(() => server.close())
}
