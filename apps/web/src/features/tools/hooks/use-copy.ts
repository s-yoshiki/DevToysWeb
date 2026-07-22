'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const resetDelay = 1200

/** Copies to the clipboard and flags success long enough to show feedback. */
export const useCopy = () => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(async (value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), resetDelay)
  }, [])

  return { copied, copy }
}
