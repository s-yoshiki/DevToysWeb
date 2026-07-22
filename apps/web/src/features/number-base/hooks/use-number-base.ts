'use client'

import { useMemo, useState } from 'react'
import {
  bitLength,
  formatInBase,
  groupDigits,
  parseInBase,
  twosComplement,
} from '../functions/number-base'

/** Digit grouping that matches how each base is usually written. */
const groupSizes: Record<number, number> = { 2: 4, 8: 3, 10: 3, 16: 2 }

export const fixedBases = [2, 8, 10, 16]
const complementWidths = [8, 16, 32, 64]

export type BaseRow = { base: number; label: string; value: string; editing: boolean }

/**
 * One source of truth — the text as typed plus the base it was typed in — with
 * every other base derived from it, so editing any field updates the rest.
 */
export const useNumberBase = (initial = '255', initialBase = 10) => {
  const [source, setSource] = useState({ text: initial, base: initialBase })
  const [customBase, setCustomBase] = useState(36)
  const [grouped, setGrouped] = useState(true)

  const parsed = useMemo(() => {
    if (!source.text.trim()) return { value: null, error: '' }
    try {
      return { value: parseInBase(source.text, source.base), error: '' }
    } catch (reason) {
      return { value: null, error: reason instanceof Error ? reason.message : 'Invalid number' }
    }
  }, [source])

  const render = (base: number) => {
    if (base === source.base) return source.text
    if (parsed.value === null) return ''
    const formatted = formatInBase(parsed.value, base)
    const size = groupSizes[base] ?? 4
    return grouped ? groupDigits(formatted, size) : formatted
  }

  const bases =
    customBase && !fixedBases.includes(customBase) ? [...fixedBases, customBase] : fixedBases

  const rows: BaseRow[] = bases.map((base) => ({
    base,
    label: { 2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX' }[base] ?? `BASE ${base}`,
    value: render(base),
    editing: base === source.base,
  }))

  const complements =
    parsed.value === null
      ? []
      : complementWidths.map((bits) => {
          const wrapped = twosComplement(parsed.value as bigint, bits)
          return {
            bits,
            value: wrapped === null ? null : formatInBase(wrapped, 16).padStart(bits / 4, '0'),
          }
        })

  return {
    source,
    rows,
    customBase,
    setCustomBase,
    grouped,
    setGrouped,
    error: parsed.error,
    bits: parsed.value === null ? 0 : bitLength(parsed.value),
    complements,
    edit: (base: number, text: string) => setSource({ text, base }),
    clear: () => setSource({ text: '', base: source.base }),
  }
}
