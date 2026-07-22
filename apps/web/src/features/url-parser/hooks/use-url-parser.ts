'use client'

import { useMemo, useState } from 'react'

const describeUrl = (value: string) => {
  const url = new URL(value)
  return {
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    query: [...url.searchParams.entries()].map(([name, value]) => ({ name, value })),
    hash: url.hash,
    origin: url.origin,
  }
}

export const useUrlParser = () => {
  const [input, setInput] = useState('https://example.com:8080/path/to/page?q=devtoys&q=web#result')

  const result = useMemo(() => {
    if (!input) return { output: '', error: '' }
    try {
      return { output: JSON.stringify(describeUrl(input), null, 2), error: '' }
    } catch (reason) {
      return { output: '', error: reason instanceof Error ? reason.message : 'Invalid URL' }
    }
  }, [input])

  return {
    input,
    setInput,
    error: result.error,
    output: result.error || result.output,
    clear: () => setInput(''),
  }
}
