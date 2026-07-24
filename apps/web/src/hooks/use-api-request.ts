'use client'

import { useState } from 'react'

/**
 * Runs a one-shot API call and exposes the JSON result, failure text, and
 * in-flight flag that the server-backed workspaces all render the same way.
 */
export const useApiRequest = <Request>(
  send: (request: Request) => Promise<unknown>,
  fallbackMessage: string,
) => {
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async (request: Request) => {
    setLoading(true)
    setError('')
    try {
      setOutput(JSON.stringify(await send(request), null, 2))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : fallbackMessage)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setOutput('')
    setError('')
  }

  return { output, error, loading, run, reset }
}
