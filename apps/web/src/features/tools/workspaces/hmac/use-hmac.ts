'use client'

import { useEffect, useState } from 'react'
import { type HmacAlgorithm, signHmac } from '../../domain/hmac'

export const useHmac = () => {
  const [message, setMessage] = useState('Hello, DevToys!')
  const [secret, setSecret] = useState('development-secret')
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256')
  const [output, setOutput] = useState('')

  useEffect(() => {
    let cancelled = false
    signHmac(message, secret, algorithm)
      .then((signature) => {
        if (!cancelled) setOutput(JSON.stringify(signature, null, 2))
      })
      .catch((reason: unknown) => {
        if (!cancelled)
          setOutput(reason instanceof Error ? reason.message : 'HMAC generation failed')
      })
    return () => {
      cancelled = true
    }
  }, [algorithm, message, secret])

  return {
    message,
    setMessage,
    secret,
    setSecret,
    algorithm,
    setAlgorithm,
    output,
    clear: () => setMessage(''),
  }
}
