'use client'

import { useMemo, useState } from 'react'
import {
  type EmojiCategory,
  type EmojiEntry,
  emojiCatalog,
  filterEmojis,
  generateEmojis,
} from '../functions/emoji'

export type EmojiMode = 'list' | 'generate'

const initialGenerated = emojiCatalog.slice(0, 5)

export const useEmoji = () => {
  const [mode, setMode] = useState<EmojiMode>('list')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EmojiCategory | 'all'>('all')
  const [count, setCount] = useState(8)
  const [selected, setSelected] = useState<EmojiEntry>(emojiCatalog[0])
  const [generated, setGenerated] = useState<readonly EmojiEntry[]>(initialGenerated)

  const results = useMemo(() => filterEmojis(emojiCatalog, query, category), [category, query])
  const generatedOutput = generated.map((item) => item.emoji).join('')
  const generatedTiles = useMemo(() => {
    const occurrences = new Map<string, number>()
    return generated.map((item) => {
      const base = `${item.category}-${item.emoji}`
      const occurrence = occurrences.get(base) ?? 0
      occurrences.set(base, occurrence + 1)
      return { item, key: `${base}-${occurrence}` }
    })
  }, [generated])

  const generate = () => {
    const source =
      category === 'all' ? emojiCatalog : emojiCatalog.filter((item) => item.category === category)
    setGenerated(generateEmojis(source, count))
  }

  const clear = () => {
    setMode('list')
    setQuery('')
    setCategory('all')
    setCount(8)
    setSelected(emojiCatalog[0])
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
    total: emojiCatalog.length,
  }
}
