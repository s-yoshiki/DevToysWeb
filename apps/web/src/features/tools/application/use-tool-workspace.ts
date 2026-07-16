'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import { generate, transform } from '../domain/transformers'

const sampleInputs: Record<string, string> = {
  'yaml-json': `name: DevToys
features:
  - fast
  - private
enabled: true`,
  'json-csv': `[
  { "name": "Alice", "role": "Developer", "active": true },
  { "name": "Bob", "role": "Designer", "active": false }
]`,
  'number-base': '255',
  'date-time': '2026-07-16T12:00:00+09:00',
  base64: 'Hello, DevToys! こんにちは',
  url: 'https://example.com/search?q=DevToys&lang=ja',
  html: '<section class="hero">DevToys & Web</section>',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldlRveXMgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  'json-format': '{"name":"DevToys","version":1,"features":["format","convert"]}',
  'sql-format':
    'SELECT users.id, users.name FROM users WHERE users.active = true ORDER BY users.name;',
  'xml-format':
    '<project><name>DevToys</name><features><feature>format</feature><feature>convert</feature></features></project>',
  hash: 'Hello, DevToys!',
}

export const useToolWorkspace = (tool: ToolDefinition) => {
  const [input, setInput] = useState(sampleInputs[tool.slug] ?? '')
  const [output, setOutput] = useState(() =>
    tool.mode === 'generate' && tool.slug !== 'hash' ? generate(tool.slug, 5, 20) : '',
  )
  const [reverse, setReverse] = useState(false)
  const [error, setError] = useState('')
  const [options, setOptions] = useState({ from: 10, to: 16, count: 5, length: 20 })

  const run = useCallback(() => {
    try {
      setError('')
      setOutput(
        tool.mode === 'generate' && tool.slug !== 'hash'
          ? generate(tool.slug, options.count, options.length)
          : transform(tool.slug, input, reverse, options),
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Invalid input')
      setOutput('')
    }
  }, [input, options, reverse, tool])

  useEffect(() => {
    if (tool.mode !== 'generate' && input) run()
  }, [run, tool.mode, input])

  useEffect(() => {
    if (tool.slug !== 'network-info') return
    setOutput(
      JSON.stringify(
        {
          online: navigator.onLine,
          language: navigator.language,
          platform: navigator.platform,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userAgent: navigator.userAgent,
        },
        null,
        2,
      ),
    )
  }, [tool.slug])

  return {
    input,
    setInput,
    output,
    setOutput,
    reverse,
    setReverse,
    error,
    options,
    setOptions,
    run,
  }
}
