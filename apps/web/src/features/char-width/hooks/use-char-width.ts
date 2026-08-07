'use client'

import { useMemo, useState } from 'react'
import {
  type CharWidthOptions,
  convertCharWidth,
  defaultCharWidthOptions,
  type KanaConversion,
  summarizeCharWidth,
  type WidthDirection,
  type WidthTarget,
} from '../functions/char-width'

const SAMPLE = 'Ｗｅｂ開発　ＤｅｖＴｏｙｓ　１２３！\nﾊﾝｶｸ ｶﾀｶﾅ ﾃﾞｰﾀ ﾎﾞﾀﾝ'

export const useCharWidth = () => {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<CharWidthOptions>(defaultCharWidthOptions)

  const output = useMemo(() => convertCharWidth(input, options), [input, options])
  const stats = useMemo(() => summarizeCharWidth(input, output), [input, output])

  const setDirection = (direction: WidthDirection) =>
    setOptions((current) => ({ ...current, direction }))

  const setKana = (kana: KanaConversion) => setOptions((current) => ({ ...current, kana }))

  const toggleTarget = (target: WidthTarget, checked: boolean) =>
    setOptions((current) => ({ ...current, targets: { ...current.targets, [target]: checked } }))

  const loadSample = () => setInput(SAMPLE)

  const clear = () => {
    setInput('')
    setOptions(defaultCharWidthOptions)
  }

  return {
    input,
    setInput,
    options,
    setDirection,
    setKana,
    toggleTarget,
    output,
    stats,
    loadSample,
    clear,
  }
}
