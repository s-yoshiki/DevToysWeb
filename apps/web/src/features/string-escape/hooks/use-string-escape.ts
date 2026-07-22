'use client'

import { useMemo, useState } from 'react'
import { type EscapeTarget, escapeString, unescapeString } from '@/features/tools/domain/text-tools'

export const useStringEscape = () => {
  const [target, setTarget] = useState<EscapeTarget>('json')
  const [reverse, setReverse] = useState(false)
  const [input, setInput] = useState('He said "hello"\tand left.\nPath: C:\\tmp')

  const result = useMemo(() => {
    if (!input) return { output: '', error: '' }
    try {
      return {
        output: reverse ? unescapeString(input, target) : escapeString(input, target),
        error: '',
      }
    } catch (reason) {
      return { output: '', error: reason instanceof Error ? reason.message : 'Invalid input' }
    }
  }, [input, reverse, target])

  return {
    target,
    setTarget,
    reverse,
    setReverse,
    input,
    setInput,
    ...result,
    clear: () => setInput(''),
  }
}
