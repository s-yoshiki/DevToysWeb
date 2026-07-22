'use client'

import { useMemo, useState } from 'react'
import { type CurlTarget, curlToCode, parseCurl } from '@/features/curl/functions/curl'

const sample =
  "curl -X POST 'https://api.example.com/users' -H 'Content-Type: application/json' -H 'Authorization: Bearer token' -d '{\"name\":\"DevToys\"}'"

export const useCurlConverter = () => {
  const [input, setInput] = useState(sample)
  const [target, setTarget] = useState<CurlTarget>('javascript')

  const result = useMemo(() => {
    try {
      return { value: curlToCode(parseCurl(input), target), error: false }
    } catch (reason) {
      return { value: reason instanceof Error ? reason.message : 'Invalid cURL', error: true }
    }
  }, [input, target])

  return { input, setInput, target, setTarget, ...result, clear: () => setInput('') }
}
