/**
 * A live world clock reuses the time-zone maths that back the converter and
 * adds only the presentation a ticking clock needs: a friendly city label and a
 * day/night sense for each zone.
 */

import { instantToWallTime } from '@/features/timezone/functions/timezone'

/** Cities shown before the visitor has picked their own line-up. */
export const defaultZones = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
]

/**
 * `Asia/Tokyo` → `Tokyo`, `America/Argentina/Buenos_Aires` → `Buenos Aires`.
 * The last path segment is the locality; underscores stand in for spaces.
 */
export const zoneCity = (zone: string) => {
  const last = zone.split('/').at(-1) ?? zone
  return last.replaceAll('_', ' ')
}

/** `Asia/Tokyo` → `Asia`; the leading region, blank for single-segment ids. */
export const zoneRegion = (zone: string) => {
  const segments = zone.split('/')
  return segments.length > 1 ? segments[0].replaceAll('_', ' ') : ''
}

/** Daytime runs 06:00–17:59 local, so the card can show a sun or a moon. */
export const isDaytime = (instant: Date, timeZone: string) => {
  const hour = instantToWallTime(instant, timeZone).hour
  return hour >= 6 && hour < 18
}

export const withoutDuplicates = (zones: string[]) =>
  zones.filter((zone, index, all) => all.indexOf(zone) === index)
