'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  filterKaomoji,
  type KaomojiCategory,
  type KaomojiEntry,
  kaomojiCatalog,
} from '../functions/kaomoji'
import {
  buildKaomoji,
  defaultKaomojiParts,
  type KaomojiPartSelection,
  randomKaomojiParts,
} from '../functions/kaomoji-parts'

export type KaomojiMode = 'list' | 'build'

/** Matches the copy-button feedback so both affordances feel the same. */
const COPIED_RESET_DELAY = 1200

export const useKaomoji = () => {
  const [mode, setMode] = useState<KaomojiMode>('list')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<KaomojiCategory | 'all'>('all')
  const [selected, setSelected] = useState<KaomojiEntry>(kaomojiCatalog[0])
  const [parts, setParts] = useState<KaomojiPartSelection>(defaultKaomojiParts)
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  // Matching the query alone lets the chips report how many entries each
  // category would still offer, the way a faceted filter should.
  const queryMatches = useMemo(() => filterKaomoji(kaomojiCatalog, query, 'all'), [query])

  const results = useMemo(
    () =>
      category === 'all' ? queryMatches : queryMatches.filter((item) => item.category === category),
    [category, queryMatches],
  )

  const counts = useMemo(() => {
    const totals = new Map<KaomojiCategory | 'all', number>([['all', queryMatches.length]])
    for (const item of queryMatches) totals.set(item.category, (totals.get(item.category) ?? 0) + 1)
    return totals
  }, [queryMatches])

  /** Catalog order is category order, so grouping keeps the familiar sequence. */
  const groups = useMemo(() => {
    const buckets = new Map<KaomojiCategory, KaomojiEntry[]>()
    for (const item of results) {
      const bucket = buckets.get(item.category)
      if (bucket) bucket.push(item)
      else buckets.set(item.category, [item])
    }
    let offset = 0
    return [...buckets.entries()].map(([groupCategory, entries]) => {
      const group = { category: groupCategory, entries, offset }
      offset += entries.length
      return group
    })
  }, [results])

  const built = useMemo(() => buildKaomoji(parts), [parts])

  /** Selecting and copying are one gesture: the grid exists to be copied from. */
  const pick = useCallback(async (item: KaomojiEntry) => {
    setSelected(item)
    await navigator.clipboard.writeText(item.kaomoji)
    setCopiedValue(item.kaomoji)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopiedValue(null), COPIED_RESET_DELAY)
  }, [])

  const setPart = <Key extends keyof KaomojiPartSelection>(
    key: Key,
    value: KaomojiPartSelection[Key],
  ) => setParts((current) => ({ ...current, [key]: value }))

  const randomize = () => setParts(randomKaomojiParts())

  const clear = () => {
    setMode('list')
    setQuery('')
    setCategory('all')
    setSelected(kaomojiCatalog[0])
    setParts(defaultKaomojiParts)
    setCopiedValue(null)
  }

  return {
    mode,
    setMode,
    query,
    setQuery,
    category,
    setCategory,
    selected,
    pick,
    copiedValue,
    results,
    counts,
    groups,
    parts,
    setPart,
    randomize,
    built,
    clear,
    total: kaomojiCatalog.length,
  }
}
