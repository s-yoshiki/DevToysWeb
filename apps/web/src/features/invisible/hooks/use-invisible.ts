'use client'

import { useMemo, useState } from 'react'
import {
  filterInvisibleCharacters,
  type InvisibleCategory,
  inspectInvisibleText,
  invisibleCharacters,
  removeInvisibleCharacters,
  visualizeInvisibleText,
} from '../functions/invisible'

const SAMPLE = 'user:\u200BDevToys\u00A0web\n\u2066https://example.com\u2069\uFEFF'

export type InvisibleMode = 'inspect' | 'catalog'

export const useInvisible = () => {
  const [mode, setMode] = useState<InvisibleMode>('inspect')
  const [input, setInput] = useState(SAMPLE)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<InvisibleCategory | 'all'>('all')

  const occurrences = useMemo(() => inspectInvisibleText(input), [input])
  const visualized = useMemo(() => visualizeInvisibleText(input), [input])
  const cleaned = useMemo(() => removeInvisibleCharacters(input), [input])
  const catalogResults = useMemo(
    () => filterInvisibleCharacters(query, category),
    [category, query],
  )

  const clear = () => {
    setMode('inspect')
    setInput('')
    setQuery('')
    setCategory('all')
  }

  return {
    mode,
    setMode,
    input,
    setInput,
    query,
    setQuery,
    category,
    setCategory,
    occurrences,
    visualized,
    cleaned,
    catalogResults,
    total: invisibleCharacters.length,
    loadSample: () => setInput(SAMPLE),
    removeDetected: () => setInput(cleaned),
    clear,
  }
}
