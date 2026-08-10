'use client'

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

/**
 * Roving tabindex over the tile grid: one stop in the tab order, arrow keys to
 * move within it. Vertical moves are resolved from the rendered geometry rather
 * than a column count, so they stay correct across breakpoints and past the
 * double-width cells that wide kaomoji occupy.
 */
export const useKaomojiGrid = (count: number) => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const tiles = useRef<(HTMLButtonElement | null)[]>([])

  // Filtering can shrink the grid out from under the current position.
  useEffect(() => {
    if (focusedIndex > 0 && focusedIndex >= count) setFocusedIndex(0)
  }, [count, focusedIndex])

  const register = useCallback(
    (index: number) => (element: HTMLButtonElement | null) => {
      tiles.current[index] = element
    },
    [],
  )

  const focusAt = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(count - 1, index))
      setFocusedIndex(next)
      tiles.current[next]?.focus()
    },
    [count],
  )

  const focusVertically = useCallback(
    (from: number, direction: 1 | -1) => {
      const origin = tiles.current[from]?.getBoundingClientRect()
      if (!origin) return
      const originX = origin.left + origin.width / 2
      let best: { index: number; dx: number; dy: number } | null = null
      for (let index = 0; index < count; index += 1) {
        const rect = tiles.current[index]?.getBoundingClientRect()
        if (!rect) continue
        // Rows are whole steps away; anything on the same line has dy ~0.
        const dy = (rect.top - origin.top) * direction
        if (dy <= 1) continue
        const dx = Math.abs(rect.left + rect.width / 2 - originX)
        if (!best || dy < best.dy || (dy === best.dy && dx < best.dx)) best = { index, dx, dy }
      }
      if (best) focusAt(best.index)
    },
    [count, focusAt],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      /*
       * Read the origin from the DOM rather than from state: key repeat can
       * outpace React's commit, and a stale index would send every repeat back
       * to the same starting tile.
       */
      const active = tiles.current.indexOf(document.activeElement as HTMLButtonElement)
      const from = active >= 0 ? active : focusedIndex

      const moves: Record<string, () => void> = {
        ArrowRight: () => focusAt(from + 1),
        ArrowLeft: () => focusAt(from - 1),
        ArrowDown: () => focusVertically(from, 1),
        ArrowUp: () => focusVertically(from, -1),
        Home: () => focusAt(0),
        End: () => focusAt(count - 1),
      }
      const move = moves[event.key]
      if (!move) return
      event.preventDefault()
      move()
    },
    [count, focusAt, focusVertically, focusedIndex],
  )

  return { focusedIndex, setFocusedIndex, register, onKeyDown }
}
