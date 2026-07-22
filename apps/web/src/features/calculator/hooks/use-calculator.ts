'use client'

import { useMemo, useState } from 'react'
import {
  type AngleMode,
  evaluateExpression,
  formatResult,
} from '@/features/tools/domain/expression'

export type HistoryEntry = { id: string; expression: string; result: string }

const historyLimit = 20

/**
 * Shared by the basic and scientific calculators: one expression string that
 * both the keypad and the keyboard edit, evaluated on every change so the
 * result is a preview until `commit` moves it into the history.
 */
export const useCalculator = (initialExpression = '') => {
  const [expression, setExpression] = useState(initialExpression)
  const [angleMode, setAngleMode] = useState<AngleMode>('deg')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [memory, setMemory] = useState<number | null>(null)

  const evaluation = useMemo(() => {
    if (!expression.trim()) return { result: '', error: '' }
    try {
      return { result: formatResult(evaluateExpression(expression, angleMode)), error: '' }
    } catch (reason) {
      return { result: '', error: reason instanceof Error ? reason.message : 'Invalid expression' }
    }
  }, [angleMode, expression])

  const insert = (text: string) => setExpression((previous) => previous + text)
  const backspace = () => setExpression((previous) => previous.slice(0, -1))

  /** Keeps the result as the next input so calculations can be chained. */
  const commit = () => {
    if (!evaluation.result) return
    setHistory((previous) =>
      [{ id: crypto.randomUUID(), expression, result: evaluation.result }, ...previous].slice(
        0,
        historyLimit,
      ),
    )
    setExpression(evaluation.result)
  }

  const clear = () => setExpression('')

  const clearAll = () => {
    setExpression('')
    setHistory([])
    setMemory(null)
  }

  /** `M+` and `M−` fold the current result into the stored value. */
  const applyMemory = (mode: 'add' | 'subtract' | 'recall' | 'clear') => {
    if (mode === 'clear') return setMemory(null)
    if (mode === 'recall') return memory === null ? undefined : insert(formatResult(memory))
    if (!evaluation.result) return
    const value = Number(evaluation.result)
    setMemory((previous) => (previous ?? 0) + (mode === 'add' ? value : -value))
  }

  return {
    expression,
    setExpression,
    angleMode,
    setAngleMode,
    result: evaluation.result,
    error: evaluation.error,
    history,
    memory,
    insert,
    backspace,
    commit,
    clear,
    clearAll,
    applyMemory,
  }
}

export type Calculator = ReturnType<typeof useCalculator>
