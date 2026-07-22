'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import type { ToolDefinition } from '@/features/tools/domain/catalog'
import { generate, transform } from '@/features/tools/domain/transformers'
import { formatNames, reversibleSlugs, sampleInputs } from '../functions/constants'

export type ConverterOptions = { count: number; length: number }

const defaultOptions: ConverterOptions = { count: 5, length: 20 }

/** `hash` is catalogued as a generator but behaves like a one-way conversion. */
const isGeneratorTool = (tool: ToolDefinition) => tool.mode === 'generate' && tool.slug !== 'hash'

const networkInfo = () =>
  JSON.stringify(
    {
      online: navigator.onLine,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
    },
    null,
    2,
  )

/**
 * Drives the generic input → output workspace: transformation, generator
 * settings, and which format sits on each side of the arrow.
 */
export const useConverter = (tool: ToolDefinition) => {
  const { dictionary } = useLocale()
  const isGenerator = isGeneratorTool(tool)

  const [input, setInput] = useState(sampleInputs[tool.slug] ?? '')
  const [output, setOutput] = useState(() => (isGenerator ? generate(tool.slug, 5, 20) : ''))
  const [reverse, setReverse] = useState(false)
  const [error, setError] = useState('')
  const [options, setOptions] = useState<ConverterOptions>(defaultOptions)

  const run = useCallback(() => {
    try {
      setError('')
      setOutput(
        isGenerator
          ? generate(tool.slug, options.count, options.length)
          : transform(tool.slug, input, reverse),
      )
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Invalid input')
      setOutput('')
    }
  }, [input, isGenerator, options, reverse, tool.slug])

  useEffect(() => {
    if (tool.mode !== 'generate' && input) run()
  }, [run, tool.mode, input])

  useEffect(() => {
    if (tool.slug === 'network-info') setOutput(networkInfo())
  }, [tool.slug])

  const formats = useMemo<[string, string]>(
    () => formatNames[tool.slug] ?? [dictionary.input, dictionary.output],
    [dictionary.input, dictionary.output, tool.slug],
  )

  /** Moving the result back into the input makes the round trip verifiable. */
  const changeDirection = (nextReverse: boolean) => {
    if (nextReverse === reverse) return
    if (output) setInput(output)
    setReverse(nextReverse)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const updateOptions = (patch: Partial<ConverterOptions>) =>
    setOptions((previous) => ({ ...previous, ...patch }))

  return {
    input,
    setInput,
    output,
    error,
    reverse,
    options,
    updateOptions,
    run,
    clear,
    isGenerator,
    supportsReverse: !isGenerator && reversibleSlugs.includes(tool.slug),
    formats,
    inputFormat: reverse ? formats[1] : formats[0],
    outputFormat: reverse ? formats[0] : formats[1],
    changeDirection,
  }
}

export type Converter = ReturnType<typeof useConverter>
