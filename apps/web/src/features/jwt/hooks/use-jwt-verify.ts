'use client'

import { useState } from 'react'
import { type JwtVerifyRequest, verifyJwt } from '@/features/tools/api/diagnostics-client'
import { useApiRequest } from '@/features/tools/hooks/use-api-request'

export const keyModes = ['jwks', 'publicKey', 'secret'] as const
export type KeyMode = (typeof keyModes)[number]

/** The API names the JWKS field `jwksUrl`; the UI mode stays `jwks`. */
const requestField: Record<KeyMode, keyof JwtVerifyRequest> = {
  jwks: 'jwksUrl',
  publicKey: 'publicKey',
  secret: 'secret',
}

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
      [requestField[mode]]: key,
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
