'use client'

import { useMemo, useState } from 'react'
import { analyzeText, convertCases } from '../../domain/text-case'

export const useTextAnalyzer = () => {
  const [input, setInput] = useState('hello DevToys web toolkit')

  const stats = useMemo(() => analyzeText(input), [input])
  const conversions = useMemo(() => convertCases(input), [input])

  return { input, setInput, stats, conversions, clear: () => setInput('') }
}
