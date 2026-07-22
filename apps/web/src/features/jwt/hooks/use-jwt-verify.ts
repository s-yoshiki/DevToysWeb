'use client'

import { useState } from 'react'
import { verifyJwt } from '@/features/tools/api/diagnostics-client'
import { useApiRequest } from '@/features/tools/hooks/use-api-request'

export const keyModes = ['jwks', 'publicKey', 'secret'] as const
export type KeyMode = (typeof keyModes)[number]

export const useJwtVerify = () => {
  const [token, setToken] = useState('')
  const [mode, setMode] = useState<KeyMode>('jwks')
  const [key, setKey] = useState('')
  const [issuer, setIssuer] = useState('')
  const [audience, setAudience] = useState('')
  const request = useApiRequest(verifyJwt, 'JWT verification failed')

  /** Switching the key material invalidates whatever was typed for the old one. */
  const changeMode = (next: KeyMode) => {
    setMode(next)
    setKey('')
  }

  const run = () =>
    void request.run({
      token,
      issuer: issuer || undefined,
      audience: audience || undefined,
      [mode]: key,
    })

  const clear = () => {
    setToken('')
    setKey('')
    setIssuer('')
    setAudience('')
    request.reset()
  }

  return {
    token,
    setToken,
    mode,
    changeMode,
    key,
    setKey,
    issuer,
    setIssuer,
    audience,
    setAudience,
    ...request,
    run,
    clear,
    canSubmit: Boolean(token.trim() && key.trim()),
  }
}
