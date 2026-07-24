'use client'

import { useMemo, useState } from 'react'
import {
  addDuration,
  type DurationParts,
  dateDifference,
  toDateTimeLocal,
} from '../functions/date-calc'

export type DateCalcMode = 'difference' | 'add'

const emptyDuration: DurationParts = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

const parseLocal = (value: string): Date | null => {
  if (!value) return null
  // Accept both `YYYY-MM-DD` and `YYYY-MM-DDTHH:mm`.
  const normalized = value.length === 10 ? `${value}T00:00` : value
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export const useDateCalc = () => {
  const [mode, setMode] = useState<DateCalcMode>('difference')

  const now = new Date()
  const [from, setFrom] = useState(() => {
    const d = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    return toDateTimeLocal(d)
  })
  const [to, setTo] = useState(() => toDateTimeLocal(now))

  const [base, setBase] = useState(() => toDateTimeLocal(now))
  const [sign, setSign] = useState<1 | -1>(1)
  const [duration, setDuration] = useState<DurationParts>(emptyDuration)

  const difference = useMemo(() => {
    const a = parseLocal(from)
    const b = parseLocal(to)
    if (!a || !b) return null
    return { a, b, result: dateDifference(a, b) }
  }, [from, to])

  const added = useMemo(() => {
    const baseDate = parseLocal(base)
    if (!baseDate) return null
    return { baseDate, result: addDuration(baseDate, duration, sign) }
  }, [base, duration, sign])

  const setDurationField = (field: keyof DurationParts, value: number) =>
    setDuration((prev) => ({ ...prev, [field]: Number.isFinite(value) ? value : 0 }))

  const setToNow = () => setTo(toDateTimeLocal(new Date()))
  const setBaseNow = () => setBase(toDateTimeLocal(new Date()))

  const clear = () => {
    const current = new Date()
    setMode('difference')
    setFrom(
      toDateTimeLocal(new Date(current.getFullYear() - 1, current.getMonth(), current.getDate())),
    )
    setTo(toDateTimeLocal(current))
    setBase(toDateTimeLocal(current))
    setSign(1)
    setDuration(emptyDuration)
  }

  return {
    mode,
    setMode,
    from,
    setFrom,
    to,
    setTo,
    setToNow,
    difference,
    base,
    setBase,
    setBaseNow,
    sign,
    setSign,
    duration,
    setDurationField,
    added,
    clear,
  }
}
