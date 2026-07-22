'use client'

import { useMemo, useState } from 'react'
import {
  buildBasicAuthHeader,
  parseBasicAuthHeader,
} from '@/features/basic-auth/functions/basic-auth'

export type BasicAuthMode = 'encode' | 'decode'

export const useBasicAuth = () => {
  const [mode, setMode] = useState<BasicAuthMode>('encode')
  const [username, setUsername] = useState('devtoys')
  const [password, setPassword] = useState('secret')
  const [header, setHeader] = useState('Basic ZGV2dG95czpzZWNyZXQ=')

  const output = useMemo(() => {
    try {
      return mode === 'encode'
        ? buildBasicAuthHeader(username, password)
        : JSON.stringify(parseBasicAuthHeader(header), null, 2)
    } catch (reason) {
      return reason instanceof Error ? reason.message : 'Invalid Basic auth header'
    }
  }, [header, mode, password, username])

  const clear = () => {
    setUsername('')
    setPassword('')
    setHeader('')
  }

  return {
    mode,
    setMode,
    username,
    setUsername,
    password,
    setPassword,
    header,
    setHeader,
    output,
    clear,
  }
}
