'use client'

import { useCallback, useEffect, useState } from 'react'
import { findTool, type ToolDefinition } from '../domain/catalog'

const storageKey = 'devtoys:recent-tools'
const limit = 8
/** Lets every mounted subscriber refresh without a full page navigation. */
const changed = 'devtoys:recent-tools-changed'

const readSlugs = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === 'string') : []
  } catch {
    return []
  }
}

export const recordToolVisit = (slug: string) => {
  if (typeof window === 'undefined') return
  const next = [slug, ...readSlugs().filter((entry) => entry !== slug)].slice(0, limit)
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next))
    window.dispatchEvent(new Event(changed))
  } catch {
    // Private browsing modes can reject writes; recents are best-effort.
  }
}

export const clearRecentTools = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event(changed))
}

/**
 * Reads on mount only, so the server-rendered markup of the static export stays
 * identical for every visitor and hydration never mismatches.
 */
export const useRecentTools = (): ToolDefinition[] => {
  const [slugs, setSlugs] = useState<string[]>([])
  const sync = useCallback(() => setSlugs(readSlugs()), [])

  useEffect(() => {
    sync()
    window.addEventListener(changed, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(changed, sync)
      window.removeEventListener('storage', sync)
    }
  }, [sync])

  return slugs.map(findTool).filter((tool): tool is ToolDefinition => Boolean(tool))
}
