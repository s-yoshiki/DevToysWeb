'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import { generate, transform } from '../domain/transformers'

export const useToolWorkspace = (tool: ToolDefinition) => {
  const [input, setInput] = useState(tool.slug === 'json-format' ? '{"hello":"world"}' : '')
  const [output, setOutput] = useState('')
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
