'use client'

import { useMemo, useState } from 'react'
import { contrastRatio, parseColor, type Rgba } from '../../domain/color'

const safeParse = (value: string) => {
  try {
    return { color: parseColor(value), error: '' }
  } catch (reason) {
    return { color: null, error: reason instanceof Error ? reason.message : 'Invalid colour' }
  }
}

export const useColor = () => {
  const [input, setInput] = useState('#3b82f6')
  const [background, setBackground] = useState('#ffffff')

  const parsed = useMemo(() => safeParse(input), [input])
  const parsedBackground = useMemo(() => safeParse(background).color, [background])

  const color: Rgba | null = parsed.color
  const ratio = color && parsedBackground ? contrastRatio(color, parsedBackground) : null

  return {
    input,
    setInput,
    background,
    setBackground,
    color,
    error: parsed.error,
    backgroundColor: parsedBackground,
    ratio,
    clear: () => setInput(''),
  }
}
