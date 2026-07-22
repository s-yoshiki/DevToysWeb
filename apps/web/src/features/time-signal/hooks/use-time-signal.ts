'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isAudioSupported, playBeep, playTimeSignal } from '@/features/tools/domain/audio'
import {
  formatWallClock,
  nextSlotAt,
  type SignalInterval,
  slotIndex,
} from '../functions/time-signal'

export type SignalStyle = 'pips' | 'count'

const maxHistory = 12

export const useTimeSignal = () => {
  const [now, setNow] = useState<Date | null>(null)
  const [interval, setInterval] = useState<SignalInterval>(60)
  const [style, setStyle] = useState<SignalStyle>('pips')
  const [enabled, setEnabled] = useState(false)
  const [history, setHistory] = useState<{ id: number; time: string }[]>([])
  const [supported, setSupported] = useState(true)
  const lastSlot = useRef<number | null>(null)

  // Mount-only: the static export must not ship a server-rendered clock.
  useEffect(() => {
    setNow(new Date())
    setSupported(isAudioSupported())
  }, [])

  const announce = useCallback(
    (moment: Date) => {
      if (style === 'count') {
        const hour = moment.getHours() % 12 || 12
        playBeep({ count: hour, frequency: 760, duration: 0.14 })
        return
      }
      playTimeSignal()
    },
    [style],
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      const moment = new Date()
      setNow(moment)

      const slot = slotIndex(moment, interval)
      // The first tick after enabling only records where we are, so turning the
      // signal on mid-slot never fires immediately.
      if (lastSlot.current === null) {
        lastSlot.current = slot
        return
      }
      if (slot === lastSlot.current) return
      lastSlot.current = slot
      if (!enabled) return
      announce(moment)
      setHistory((previous) =>
        [{ id: moment.getTime(), time: formatWallClock(moment) }, ...previous].slice(0, maxHistory),
      )
    }, 250)
    return () => window.clearInterval(id)
  }, [announce, enabled, interval])

  // Re-anchors the slot so switching interval never fires on the switch itself.
  const changeInterval = useCallback((next: SignalInterval) => {
    lastSlot.current = null
    setInterval(next)
  }, [])

  const test = useCallback(() => {
    setSupported(isAudioSupported())
    announce(new Date())
  }, [announce])

  const clear = useCallback(() => {
    setEnabled(false)
    setHistory([])
  }, [])

  const upcoming = now ? nextSlotAt(now, interval) : null

  return {
    now,
    interval,
    setInterval: changeInterval,
    style,
    setStyle,
    enabled,
    setEnabled,
    history,
    supported,
    upcoming,
    countdownMs: now && upcoming ? Math.max(0, upcoming.getTime() - now.getTime()) : 0,
    test,
    clear,
  }
}
