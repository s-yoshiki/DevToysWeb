'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { playBeep } from '@/features/tools/domain/audio'
import { toMilliseconds } from '@/features/tools/domain/duration'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

const tickInterval = 100

/**
 * Counts down against a wall-clock deadline rather than by accumulating ticks,
 * so a throttled background tab still reports the correct remaining time when it
 * comes back to the foreground.
 */
export const useTimer = () => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [remaining, setRemaining] = useState(toMilliseconds({ minutes: 5 }))
  const [soundEnabled, setSoundEnabled] = useState(true)
  const deadline = useRef(0)
  const soundRef = useRef(soundEnabled)
  soundRef.current = soundEnabled

  const duration = toMilliseconds({ hours, minutes, seconds })

  // While idle the display simply mirrors the form, so editing the fields is
  // immediately visible without a separate "apply" step.
  useEffect(() => {
    if (status === 'idle') setRemaining(duration)
  }, [duration, status])

  useEffect(() => {
    if (status !== 'running') return
    const id = window.setInterval(() => {
      const left = deadline.current - Date.now()
      if (left > 0) {
        setRemaining(left)
        return
      }
      setRemaining(0)
      setStatus('finished')
      if (soundRef.current) playBeep({ count: 3, frequency: 950 })
    }, tickInterval)
    return () => window.clearInterval(id)
  }, [status])

  const start = useCallback(() => {
    const target = status === 'paused' ? remaining : duration
    if (target <= 0) return
    deadline.current = Date.now() + target
    setRemaining(target)
    setStatus('running')
  }, [duration, remaining, status])

  const pause = useCallback(() => {
    if (status !== 'running') return
    setRemaining(Math.max(0, deadline.current - Date.now()))
    setStatus('paused')
  }, [status])

  const reset = useCallback(() => {
    setStatus('idle')
    setRemaining(duration)
  }, [duration])

  const applyPreset = useCallback((presetSeconds: number) => {
    setHours(Math.floor(presetSeconds / 3600))
    setMinutes(Math.floor(presetSeconds / 60) % 60)
    setSeconds(presetSeconds % 60)
    setStatus('idle')
  }, [])

  const clear = useCallback(() => {
    setStatus('idle')
    setHours(0)
    setMinutes(5)
    setSeconds(0)
  }, [])

  return {
    hours,
    minutes,
    seconds,
    setHours,
    setMinutes,
    setSeconds,
    status,
    remaining,
    duration,
    soundEnabled,
    setSoundEnabled,
    progress: duration > 0 ? Math.min(1, Math.max(0, 1 - remaining / duration)) : 0,
    start,
    pause,
    reset,
    applyPreset,
    clear,
  }
}
