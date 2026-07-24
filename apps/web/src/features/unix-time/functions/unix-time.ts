export type ParsedInstant = {
  date: Date
  /** How the raw input was interpreted, for display. */
  interpretation: 'seconds' | 'milliseconds' | 'date-string'
}

const pad = (n: number, len = 2) => String(Math.abs(n)).padStart(len, '0')

/**
 * Flexibly parse a timestamp: a bare integer is treated as Unix seconds, or
 * milliseconds once it is large enough to be one; anything else falls back to
 * the Date parser (ISO 8601, RFC 2822, etc.).
 */
export const parseInstant = (raw: string): ParsedInstant | null => {
  const value = raw.trim()
  if (!value) return null

  if (/^-?\d+$/.test(value)) {
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    // 13+ digit values are milliseconds (≈ years 2001+ in ms); shorter is seconds.
    const asMs = Math.abs(n) >= 1e12
    const date = new Date(asMs ? n : n * 1000)
    if (Number.isNaN(date.getTime())) return null
    return { date, interpretation: asMs ? 'milliseconds' : 'seconds' }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return { date, interpretation: 'date-string' }
}

/** Local ISO 8601 with the machine's UTC offset, e.g. 2026-07-24T18:30:00+09:00. */
export const toLocalIso = (date: Date): string => {
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
  )
}

export const localOffsetLabel = (date: Date): string => {
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  return `UTC${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
}

const RTF_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
]

/** "3 hours ago" / "in 5 days", relative to now, in the active locale. */
export const relativeTime = (date: Date, locale: string): string => {
  const diffSeconds = (date.getTime() - Date.now()) / 1000
  const abs = Math.abs(diffSeconds)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, seconds] of RTF_UNITS) {
    if (abs >= seconds || unit === 'second') {
      return rtf.format(Math.round(diffSeconds / seconds), unit)
    }
  }
  return rtf.format(0, 'second')
}

export const dayOfYear = (date: Date): number => {
  const start = Date.UTC(date.getFullYear(), 0, 0)
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((current - start) / 86_400_000)
}

/** ISO 8601 week number (weeks start Monday, week 1 holds the first Thursday). */
export const isoWeek = (date: Date): number => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = (target.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - day + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const firstDay = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3)
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (86_400_000 * 7))
}

const WEEKDAYS = {
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}

export const weekday = (date: Date, locale: 'ja' | 'en') => WEEKDAYS[locale][date.getDay()]
