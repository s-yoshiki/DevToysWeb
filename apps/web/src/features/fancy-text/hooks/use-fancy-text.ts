'use client'

import { useMemo, useState } from 'react'
import { renderFancyStyles } from '../functions/fancy-text'

const PLACEHOLDER = 'DevToys 2026'

export const useFancyText = () => {
  const [input, setInput] = useState('')

  // Previewing a placeholder keeps every style legible before the user types.
  const preview = input || PLACEHOLDER
  const results = useMemo(() => renderFancyStyles(preview), [preview])
  const allOutput = results.map((result) => result.output).join('\n')

  const clear = () => setInput('')

  return {
    input,
    setInput,
    placeholder: PLACEHOLDER,
    isPlaceholder: !input,
    results,
    allOutput,
    clear,
  }
}
