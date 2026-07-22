/**
 * Time zone maths built on `Intl` alone: the browser already ships the IANA
 * database, so the only thing missing is turning a wall clock reading in some
 * zone back into an instant.
 */

export type WallTime = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const partsFormatter = (timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

export const isValidTimeZone = (timeZone: string) => {
  try {
    partsFormatter(timeZone).format(new Date())
    return true
  } catch {
    return false
  }
}

/** The wall clock reading a zone shows at a given instant. */
export const instantToWallTime = (instant: Date, timeZone: string): WallTime => {
  const parts = partsFormatter(timeZone).formatToParts(instant)
  const lookup = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? '0')
  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    hour: lookup('hour'),
    minute: lookup('minute'),
    second: lookup('second'),
  }
}

const asUtcMillis = (wall: WallTime) =>
  Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)

/** Minutes east of UTC that the zone was using at `instant`. */
export const zoneOffsetMinutes = (instant: Date, timeZone: string) =>
  (asUtcMillis(instantToWallTime(instant, timeZone)) - instant.getTime()) / 60_000

/**
 * Inverse of `instantToWallTime`. The first offset guess can be wrong across a
 * DST transition, so it is re-checked against the instant it produces.
 */
export const wallTimeToInstant = (wall: WallTime, timeZone: string) => {
  const utcGuess = asUtcMillis(wall)
  const firstOffset = zoneOffsetMinutes(new Date(utcGuess), timeZone)
  const candidate = new Date(utcGuess - firstOffset * 60_000)
  const secondOffset = zoneOffsetMinutes(candidate, timeZone)
  if (secondOffset === firstOffset) return candidate
  return new Date(utcGuess - secondOffset * 60_000)
}

export const formatOffset = (minutes: number) => {
  const sign = minutes < 0 ? '-' : '+'
  const absolute = Math.abs(minutes)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const rest = String(absolute % 60).padStart(2, '0')
  return `UTC${sign}${hours}:${rest}`
}

/** `JST`, `GMT+5:30`, … whichever short name the runtime knows for the zone. */
export const zoneAbbreviation = (instant: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value ?? ''

const pad = (value: number, length = 2) => String(value).padStart(length, '0')

/** `YYYY-MM-DDTHH:mm:ss`, the shape `<input type="datetime-local">` expects. */
export const formatWallTime = (wall: WallTime) =>
  `${pad(wall.year, 4)}-${pad(wall.month)}-${pad(wall.day)}T${pad(wall.hour)}:${pad(wall.minute)}:${pad(wall.second)}`

export const parseWallTime = (value: string): WallTime | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim())
  if (!match) return null
  const [, year, month, day, hour, minute, second] = match
  const wall = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second ?? '0'),
  }
  if (wall.month < 1 || wall.month > 12 || wall.day < 1 || wall.day > 31) return null
  if (wall.hour > 23 || wall.minute > 59 || wall.second > 59) return null
  return wall
}

/** Calendar days between two zones' readings of the same instant: -1, 0 or +1. */
export const dayShift = (from: WallTime, to: WallTime) => {
  const left = Date.UTC(from.year, from.month - 1, from.day)
  const right = Date.UTC(to.year, to.month - 1, to.day)
  return Math.round((right - left) / 86_400_000)
}

const fallbackZones = [
  'UTC',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Pacific/Honolulu',
]

/** Every zone the runtime knows, or a usable subset on older browsers. */
export const listTimeZones = () => {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf?.('timeZone')
  return supported?.length ? supported : fallbackZones
}

export const popularZones = fallbackZones
