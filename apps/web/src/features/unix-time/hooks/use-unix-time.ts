'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseInstant } from '../functions/unix-time'

export const useUnixTime = () => {
  const [input, setInput] = useState('')
  // Ticks once a second so the "now" reference and relative time stay fresh.
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const parsed = useMemo(() => parseInstant(input), [input])
  const showingNow = input.trim() === ''
  const date = parsed?.date ?? new Date()

  const setNow = () => setInput(String(Math.floor(Date.now() / 1000)))
  const clear = () => setInput('')

  return {
    input,
    setInput,
    parsed,
    date,
    showingNow,
    invalid: input.trim() !== '' && parsed === null,
    setNow,
    clear,
  }
}
