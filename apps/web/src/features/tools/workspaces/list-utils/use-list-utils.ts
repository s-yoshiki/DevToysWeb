'use client'

import { useMemo, useState } from 'react'
import { defaultListOptions, formatList, type ListOptions } from '../../domain/text-tools'

const sampleList = `banana
apple
Cherry
apple

item 10
item 2`

export const useListUtils = () => {
  const [input, setInput] = useState(sampleList)
  const [options, setOptions] = useState<ListOptions>(defaultListOptions)

  const update = (patch: Partial<ListOptions>) =>
    setOptions((previous) => ({ ...previous, ...patch }))

  const output = useMemo(() => formatList(input, options), [input, options])

  return {
    input,
    setInput,
    options,
    update,
    output,
    lineCount: output ? output.split(options.separator).length : 0,
    clear: () => setInput(''),
  }
}
