'use client'

import { useMemo, useState } from 'react'

export type UrlParts = {
  href: string
  origin: string
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  query: { key: string; name: string; value: string }[]
  segments: { key: string; value: string }[]
}

const describeUrl = (value: string): UrlParts => {
  const url = new URL(value)
  return {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    query: [...url.searchParams.entries()].map(([name, value], index) => ({
      key: `${index}-${name}`,
      name,
      value,
    })),
    segments: url.pathname
      .split('/')
      .filter(Boolean)
      .map((value, index) => ({ key: `${index}-${value}`, value })),
  }
}

export const useUrlParser = () => {
  const [input, setInput] = useState(
    'https://user:pass@example.com:8080/path/to/page?q=devtoys&lang=ja#result',
  )

  const result = useMemo(() => {
    if (!input.trim()) return { parts: null, error: '' }
    try {
      return { parts: describeUrl(input), error: '' }
    } catch (reason) {
      return { parts: null, error: reason instanceof Error ? reason.message : 'Invalid URL' }
    }
  }, [input])

  return {
    input,
    setInput,
    parts: result.parts,
    error: result.error,
    clear: () => setInput(''),
  }
}
