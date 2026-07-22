'use client'

import { useMemo, useState } from 'react'

type RegexMatch = { match: string; index?: number; groups: unknown }

/** Runs the expression against the sample text on every keystroke. */
export const useRegex = () => {
  const [pattern, setPattern] = useState('(?<word>\\w+)')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('Hello DevToys')

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as RegexMatch[], error: '' }
    try {
      // Matching without `g` would only ever return the first hit.
      const effectiveFlags = flags.includes('g') ? flags : `${flags}g`
      const expression = new RegExp(pattern, effectiveFlags)
      const matches = [...input.matchAll(expression)].map((match) => ({
        match: match[0],
        index: match.index,
        groups: match.groups ?? match.slice(1),
      }))
      return { matches, error: '' }
    } catch (reason) {
      return {
        matches: [] as RegexMatch[],
        error: reason instanceof Error ? reason.message : 'Invalid expression',
      }
    }
  }, [flags, input, pattern])

  const clear = () => {
    setPattern('')
    setFlags('g')
    setInput('')
  }

  return {
    pattern,
    setPattern,
    flags,
    setFlags,
    input,
    setInput,
    matches: result.matches,
    error: result.error,
    output: result.error || JSON.stringify(result.matches, null, 2),
    clear,
  }
}
