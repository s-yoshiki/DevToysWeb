'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import {
  dayShift,
  formatOffset,
  formatWallTime,
  instantToWallTime,
  isValidTimeZone,
  parseWallTime,
  wallTimeToInstant,
  zoneAbbreviation,
  zoneOffsetMinutes,
} from '../functions/timezone'

const localZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

const defaultTargets = ['UTC', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']

const withoutDuplicates = (zones: string[]) =>
  zones.filter((zone, index, all) => all.indexOf(zone) === index)

export type ZoneRow = {
  zone: string
  date: string
  time: string
  offset: string
  abbreviation: string
  shift: number
}

/**
 * A wall clock reading in one zone, resolved to an instant and then shown in
 * every other zone the visitor is tracking. The current time and the visitor's
 * own zone only arrive after mount, because neither exists during the static
 * export that produced the markup.
 */
export const useTimezone = () => {
  const { locale } = useLocale()
  const [sourceZone, setSourceZone] = useState('UTC')
  const [wallText, setWallText] = useState('')
  const [targets, setTargets] = useState(defaultTargets)

  useEffect(() => {
    const zone = localZone()
    setSourceZone(zone)
    setWallText(formatWallTime(instantToWallTime(new Date(), zone)))
    setTargets((previous) => withoutDuplicates([zone, ...previous]))
  }, [])

  const resolved = useMemo(() => {
    if (!wallText) return { instant: null, error: '' }
    if (!isValidTimeZone(sourceZone))
      return { instant: null, error: `Unknown time zone: ${sourceZone}` }
    const wall = parseWallTime(wallText)
    if (!wall) return { instant: null, error: 'Enter a date and time as YYYY-MM-DDTHH:mm' }
    return { instant: wallTimeToInstant(wall, sourceZone), error: '' }
  }, [sourceZone, wallText])

  const rows = useMemo<ZoneRow[]>(() => {
    const instant = resolved.instant
    if (!instant) return []
    const sourceWall = instantToWallTime(instant, sourceZone)

    return targets.filter(isValidTimeZone).map((zone) => ({
      zone,
      date: new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: zone }).format(instant),
      // Explicit 2-digit fields rather than `timeStyle`, so every row lines up.
      time: new Intl.DateTimeFormat(locale, {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: zone,
      }).format(instant),
      offset: formatOffset(zoneOffsetMinutes(instant, zone)),
      abbreviation: zoneAbbreviation(instant, zone),
      shift: dayShift(sourceWall, instantToWallTime(instant, zone)),
    }))
  }, [locale, resolved.instant, sourceZone, targets])

  return {
    sourceZone,
    setSourceZone,
    wallText,
    setWallText,
    targets,
    rows,
    error: resolved.error,
    unixSeconds: resolved.instant ? Math.floor(resolved.instant.getTime() / 1000) : null,
    isoString: resolved.instant?.toISOString() ?? '',
    setNow: () => setWallText(formatWallTime(instantToWallTime(new Date(), sourceZone))),
    /** Reports back so the field can keep an unknown zone visible for editing. */
    addTarget: (zone: string) => {
      if (!isValidTimeZone(zone)) return false
      setTargets((previous) => withoutDuplicates([...previous, zone]))
      return true
    },
    removeTarget: (zone: string) =>
      setTargets((previous) => previous.filter((entry) => entry !== zone)),
    clear: () => {
      const zone = localZone()
      setSourceZone(zone)
      setWallText(formatWallTime(instantToWallTime(new Date(), zone)))
      setTargets(withoutDuplicates([zone, ...defaultTargets]))
    },
  }
}
