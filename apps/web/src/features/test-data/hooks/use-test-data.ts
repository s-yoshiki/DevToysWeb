'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  type FieldKey,
  formatRows,
  generateRows,
  type OutputFormat,
  type TestDataLocale,
} from '../functions/test-data'

const DEFAULT_FIELDS: FieldKey[] = ['id', 'fullName', 'email', 'phone', 'address']

const randomSeed = () => Math.floor(Math.random() * 0xffffffff)

export const useTestData = () => {
  const [selected, setSelected] = useState<FieldKey[]>(DEFAULT_FIELDS)
  const [count, setCount] = useState(10)
  const [locale, setLocale] = useState<TestDataLocale>('ja')
  const [format, setFormat] = useState<OutputFormat>('json')
  const [seed, setSeed] = useState(() => randomSeed())

  const toggleField = useCallback((key: FieldKey) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }, [])

  const rows = useMemo(
    () => generateRows(selected, count, locale, seed),
    [selected, count, locale, seed],
  )
  const output = useMemo(() => formatRows(rows, selected, format), [rows, selected, format])
  const preview = useMemo(
    () => rows.slice(0, 20).map((row, index) => ({ key: `${seed}-${index}`, row })),
    [rows, seed],
  )

  const regenerate = useCallback(() => setSeed(randomSeed()), [])

  const clear = useCallback(() => {
    setSelected(DEFAULT_FIELDS)
    setCount(10)
    setLocale('ja')
    setFormat('json')
    setSeed(randomSeed())
  }, [])

  return {
    selected,
    toggleField,
    count,
    setCount,
    locale,
    setLocale,
    format,
    setFormat,
    rows,
    preview,
    output,
    regenerate,
    clear,
  }
}
