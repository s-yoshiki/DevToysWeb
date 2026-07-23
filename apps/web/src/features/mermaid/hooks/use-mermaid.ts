'use client'

import { useTheme } from 'next-themes'
import { useEffect, useId, useState } from 'react'

const sample = `flowchart LR
  A[Write Mermaid] --> B{Valid syntax?}
  B -->|Yes| C[Preview diagram]
  B -->|No| D[Show error]
  D --> A`

/** Renders Mermaid source in the browser while keeping the static export server-free. */
export const useMermaid = () => {
  const [input, setInput] = useState(sample)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const { resolvedTheme } = useTheme()
  const id = `mermaid-${useId().replaceAll(':', '')}`

  useEffect(() => {
    let cancelled = false

    const timeout = window.setTimeout(async () => {
      if (!input.trim()) {
        setSvg('')
        setError('')
        return
      }

      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        })
        const result = await mermaid.render(id, input)

        if (!cancelled) {
          setSvg(result.svg)
          setError('')
        }
      } catch (cause) {
        document.getElementById(id)?.remove()
        document.getElementById(`d${id}`)?.remove()

        if (!cancelled) {
          setSvg('')
          setError(cause instanceof Error ? cause.message : String(cause))
        }
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [id, input, resolvedTheme])

  return {
    input,
    setInput,
    svg,
    error,
    clear: () => setInput(''),
  }
}
