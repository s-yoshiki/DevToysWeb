'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import {
  isAudioSupported,
  playBeep,
  playTimeSignal,
  prepareAudio,
  scheduleTelephoneTimeSignal,
} from '@/features/tools/domain/audio'
import {
  cancelTimeAnnouncement,
  isSpeechSupported,
  speakTimeAnnouncement,
} from '../functions/speech'
import {
  formatWallClock,
  nextSlotAt,
  nextTelephoneSignalAt,
  type SignalInterval,
  slotIndex,
} from '../functions/time-signal'

export type SignalStyle = 'telephone' | 'pips' | 'count'

const maxHistory = 12

export const useTimeSignal = () => {
  const { locale } = useLocale()
  const [now, setNow] = useState<Date | null>(null)
  const [interval, setInterval] = useState<SignalInterval>(60)
  const [style, setStyle] = useState<SignalStyle>('telephone')
  const [enabled, setEnabled] = useState(false)
  const [history, setHistory] = useState<{ id: number; time: string }[]>([])
  const [audioSupported, setAudioSupported] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(true)
  const lastSlot = useRef<number | null>(null)
  const telephoneTarget = useRef<number | null>(null)
  const cancelScheduledSignal = useRef<(() => void) | null>(null)

  // Mount-only: the static export must not ship a server-rendered clock.
  useEffect(() => {
    setNow(new Date())
    setAudioSupported(isAudioSupported())
    setSpeechSupported(isSpeechSupported())
  }, [])

  const announce = useCallback(
    (moment: Date) => {
      if (style === 'telephone') {
        const spoken = speakTimeAnnouncement(moment, locale, () => playTimeSignal())
        if (!spoken) playTimeSignal()
        return
      }
      if (style === 'count') {
        const hour = moment.getHours() % 12 || 12
        playBeep({ count: hour, frequency: 760, duration: 0.14 })
        return
      }
      playTimeSignal()
    },
    [locale, style],
  )

  const stopTelephoneSignal = useCallback(() => {
    cancelScheduledSignal.current?.()
    cancelScheduledSignal.current = null
    telephoneTarget.current = null
    cancelTimeAnnouncement()
  }, [])

  useEffect(() => {
    if (!enabled || style !== 'telephone') {
      stopTelephoneSignal()
      return
    }

    const scheduleNext = (moment: Date) => {
      // Leave enough time for the synthesized announcement to finish before
      // the three countdown pips begin.
      const target = nextTelephoneSignalAt(moment, 5_000)
      telephoneTarget.current = target.getTime()
      cancelScheduledSignal.current = scheduleTelephoneTimeSignal(target.getTime())
      speakTimeAnnouncement(target, locale)
    }
    let cancelled = false
    let id: number | null = null
    void prepareAudio().then(() => {
      if (cancelled) return
      scheduleNext(new Date())
      id = window.setInterval(() => {
        setNow(new Date())
        const target = telephoneTarget.current
        if (target === null || Date.now() < target) return

        const moment = new Date(target)
        setHistory((previous) =>
          [{ id: target, time: formatWallClock(moment) }, ...previous].slice(0, maxHistory),
        )
        scheduleNext(new Date())
      }, 100)
    })

    return () => {
      cancelled = true
      if (id !== null) window.clearInterval(id)
      stopTelephoneSignal()
    }
  }, [enabled, locale, stopTelephoneSignal, style])

  useEffect(() => {
    if (style === 'telephone') return

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
  }, [announce, enabled, interval, style])

  // Re-anchors the slot so switching interval never fires on the switch itself.
  const changeInterval = useCallback((next: SignalInterval) => {
    lastSlot.current = null
    setInterval(next)
  }, [])

  const test = useCallback(() => {
    setAudioSupported(isAudioSupported())
    setSpeechSupported(isSpeechSupported())
    void prepareAudio().then(() => announce(new Date()))
  }, [announce])

  const changeEnabled = useCallback((next: boolean) => {
    if (next) void prepareAudio()
    setEnabled(next)
  }, [])

  const clear = useCallback(() => {
    setEnabled(false)
    setHistory([])
    stopTelephoneSignal()
  }, [stopTelephoneSignal])

  const upcoming = now
    ? style === 'telephone'
      ? new Date(telephoneTarget.current ?? nextTelephoneSignalAt(now).getTime())
      : nextSlotAt(now, interval)
    : null

  return {
    now,
    interval,
    setInterval: changeInterval,
    style,
    setStyle,
    enabled,
    setEnabled: changeEnabled,
    history,
    supported: audioSupported && (style !== 'telephone' || speechSupported),
    audioSupported,
    speechSupported,
    upcoming,
    countdownMs: now && upcoming ? Math.max(0, upcoming.getTime() - now.getTime()) : 0,
    test,
    clear,
  }
}
