'use client'

import { useMemo, useState } from 'react'
import {
  filterKaomoji,
  generateKaomoji,
  type KaomojiCategory,
  type KaomojiEntry,
  kaomojiCatalog,
} from '../functions/kaomoji'

export type KaomojiMode = 'list' | 'generate'

const initialGenerated = kaomojiCatalog.slice(0, 5)

export const useKaomoji = () => {
  const [mode, setMode] = useState<KaomojiMode>('list')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<KaomojiCategory | 'all'>('all')
  const [count, setCount] = useState(8)
  const [selected, setSelected] = useState<KaomojiEntry>(kaomojiCatalog[0])
  const [generated, setGenerated] = useState<readonly KaomojiEntry[]>(initialGenerated)

  const results = useMemo(() => filterKaomoji(kaomojiCatalog, query, category), [category, query])
  // Kaomoji are wide and punctuation-heavy, so one per line stays readable
  // where the emoji tool can concatenate its output directly.
  const generatedOutput = generated.map((item) => item.kaomoji).join('\n')
  const generatedTiles = useMemo(() => {
    const occurrences = new Map<string, number>()
    return generated.map((item) => {
      const base = `${item.category}-${item.kaomoji}`
      const occurrence = occurrences.get(base) ?? 0
      occurrences.set(base, occurrence + 1)
      return { item, key: `${base}-${occurrence}` }
    })
  }, [generated])

  const generate = () => {
    const source =
      category === 'all'
        ? kaomojiCatalog
        : kaomojiCatalog.filter((item) => item.category === category)
    setGenerated(generateKaomoji(source, count))
  }

  const clear = () => {
    setMode('list')
    setQuery('')
    setCategory('all')
    setCount(8)
    setSelected(kaomojiCatalog[0])
    setGenerated(initialGenerated)
  }

  return {
    mode,
    setMode,
    query,
    setQuery,
    category,
    setCategory,
    count,
    setCount,
    selected,
    select: setSelected,
    results,
    generated,
    generatedTiles,
    generatedOutput,
    generate,
    clear,
    total: kaomojiCatalog.length,
  }
}
