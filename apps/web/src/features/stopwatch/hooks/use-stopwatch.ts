'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Lap = { index: number; total: number; split: number }

/**
 * Elapsed time is derived from timestamps, not accumulated ticks: the interval
 * only decides how often the reading refreshes, so a throttled tab drifts in
 * frame rate rather than in measured time.
 */
export const useStopwatch = () => {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<Lap[]>([])
  const startedAt = useRef(0)
  const carried = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(
      () => setElapsed(carried.current + (Date.now() - startedAt.current)),
      33,
    )
    return () => window.clearInterval(id)
  }, [running])

  const start = useCallback(() => {
    startedAt.current = Date.now()
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    carried.current += Date.now() - startedAt.current
    setElapsed(carried.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    carried.current = 0
    setElapsed(0)
    setLaps([])
    setRunning(false)
  }, [])

  const recordLap = useCallback(() => {
    const total = running ? carried.current + (Date.now() - startedAt.current) : carried.current
    setLaps((previous) => [
      { index: previous.length + 1, total, split: total - (previous[0]?.total ?? 0) },
      ...previous,
    ])
  }, [running])

  const fastest = laps.length > 1 ? Math.min(...laps.map((lap) => lap.split)) : null
  const slowest = laps.length > 1 ? Math.max(...laps.map((lap) => lap.split)) : null

  return {
    running,
    elapsed,
    laps,
    fastest,
    slowest,
    start,
    stop,
    reset,
    recordLap,
    toggle: () => (running ? stop() : start()),
  }
}
