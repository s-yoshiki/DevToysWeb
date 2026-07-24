'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import {
  dayShift,
  formatOffset,
  instantToWallTime,
  isValidTimeZone,
  zoneAbbreviation,
  zoneOffsetMinutes,
} from '@/features/timezone/functions/timezone'
import {
  defaultZones,
  isDaytime,
  withoutDuplicates,
  zoneCity,
  zoneRegion,
} from '../functions/world-clock'

const storageKey = 'devtoys:world-clock-zones'
const hourFormatKey = 'devtoys:world-clock-hour12'

const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

const readZones = (): string[] | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(
      (zone): zone is string => typeof zone === 'string' && isValidTimeZone(zone),
    )
  } catch {
    return null
  }
}

const writeZones = (zones: string[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(zones))
  } catch {
    // Private browsing can reject writes; the line-up is best-effort.
  }
}

export type ClockRow = {
  zone: string
  city: string
  region: string
  time: string
  date: string
  offset: string
  abbreviation: string
  shift: number
  isDay: boolean
  isLocal: boolean
}

/**
 * A ticking world clock. The line-up and the visitor's own zone only settle
 * after mount, so the static export renders identical markup for everyone and
 * hydration never mismatches; a one-second interval advances the reading.
 */
export const useWorldClock = () => {
  const { locale } = useLocale()
  const [now, setNow] = useState<Date | null>(null)
  const [home, setHome] = useState('UTC')
  const [zones, setZones] = useState<string[]>(defaultZones)
  const [hour12, setHour12] = useState(false)

  useEffect(() => {
    const zone = localZone()
    setHome(zone)
    setNow(new Date())
    const stored = readZones()
    setZones(stored?.length ? stored : withoutDuplicates([zone, ...defaultZones]))
    setHour12(window.localStorage.getItem(hourFormatKey) === 'true')
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const update = useCallback((next: string[]) => {
    const deduped = withoutDuplicates(next)
    setZones(deduped)
    writeZones(deduped)
  }, [])

  const rows = useMemo<ClockRow[]>(() => {
    if (!now) return []
    const homeWall = instantToWallTime(now, home)
    return zones.filter(isValidTimeZone).map((zone) => ({
      zone,
      city: zoneCity(zone),
      region: zoneRegion(zone),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12,
        hourCycle: hour12 ? undefined : 'h23',
        timeZone: zone,
      }).format(now),
      date: new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: zone,
      }).format(now),
      // `now` carries milliseconds, so the raw offset is a hair off a whole
      // minute; every real zone offset is an integer number of minutes.
      offset: formatOffset(Math.round(zoneOffsetMinutes(now, zone))),
      abbreviation: zoneAbbreviation(now, zone),
      shift: dayShift(homeWall, instantToWallTime(now, zone)),
      isDay: isDaytime(now, zone),
      isLocal: zone === home,
    }))
  }, [home, hour12, locale, now, zones])

  return {
    rows,
    hour12,
    ready: now !== null,
    toggleHour12: () =>
      setHour12((previous) => {
        const next = !previous
        if (typeof window !== 'undefined') window.localStorage.setItem(hourFormatKey, String(next))
        return next
      }),
    /** Reports back so the field can keep an unknown zone visible for editing. */
    addZone: (zone: string) => {
      const trimmed = zone.trim()
      if (!isValidTimeZone(trimmed) || zones.includes(trimmed)) return false
      update([...zones, trimmed])
      return true
    },
    removeZone: (zone: string) => update(zones.filter((entry) => entry !== zone)),
    clear: () => update(withoutDuplicates([localZone(), ...defaultZones])),
  }
}
