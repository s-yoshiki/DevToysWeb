'use client'

import { useMemo, useState } from 'react'

export type RegexGroup = { name: string; value: string | undefined }
export type RegexMatch = { key: string; match: string; index: number; groups: RegexGroup[] }

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
      const matches: RegexMatch[] = [...input.matchAll(expression)].map((match, i) => ({
        key: `${i}-${match.index}`,
        match: match[0],
        index: match.index ?? 0,
        groups: match.groups
          ? Object.entries(match.groups).map(([name, value]) => ({ name, value }))
          : match.slice(1).map((value, i) => ({ name: String(i + 1), value })),
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
