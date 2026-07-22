'use client'

import { useMemo, useState } from 'react'
import { generateLorem, type LoremLanguage, type LoremUnit } from '../../domain/lorem'

export const useLorem = () => {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs')
  const [count, setCount] = useState(3)
  const [language, setLanguage] = useState<LoremLanguage>('la')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [seed, setSeed] = useState(0)

  const output = useMemo(
    // `seed` is unused on purpose: bumping it is what re-rolls the random text.
    () => (seed >= 0 ? generateLorem({ unit, count, language, startWithLorem }) : ''),
    [unit, count, language, startWithLorem, seed],
  )

  return {
    unit,
    setUnit,
    count,
    setCount,
    language,
    setLanguage,
    startWithLorem,
    setStartWithLorem,
    output,
    regenerate: () => setSeed((value) => value + 1),
    clear: () => setCount(3),
  }
}
