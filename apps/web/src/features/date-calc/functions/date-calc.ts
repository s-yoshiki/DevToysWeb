/** Calendar breakdown between two instants, plus flat totals. */
export type DateDifference = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  businessDays: number
  direction: 1 | -1 | 0
}

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24

/** Whole weekdays (Mon–Fri) in the half-open range [from, to). */
const countBusinessDays = (from: Date, to: Date) => {
  let count = 0
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  while (cursor < end) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) count++
    cursor.setDate(cursor.getDate() + 1)
  }
  return count
}

/**
 * Difference between two dates. The Y/M/D part borrows across calendar
 * boundaries so it reads the way people expect ("2 years, 3 months, 4 days").
 */
// Add whole months while preserving the time of day, clamping the day to the
// target month's length (so 2024-01-31 + 1 month is 2024-02-29, not March).
const addCalendarMonths = (date: Date, count: number): Date => {
  const total = date.getMonth() + count
  const year = date.getFullYear() + Math.floor(total / 12)
  const month = ((total % 12) + 12) % 12
  const day = Math.min(date.getDate(), new Date(year, month + 1, 0).getDate())
  return new Date(
    year,
    month,
    day,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  )
}

export const dateDifference = (a: Date, b: Date): DateDifference => {
  const direction = a.getTime() === b.getTime() ? 0 : a < b ? 1 : -1
  const [from, to] = a <= b ? [a, b] : [b, a]

  // Anchor `from` forward by as many whole months as fit without passing `to`,
  // then measure the leftover span. This avoids the day-borrowing edge cases.
  let totalMonths =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  if (addCalendarMonths(from, totalMonths) > to) totalMonths--
  const anchor = addCalendarMonths(from, totalMonths)

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  let remainder = to.getTime() - anchor.getTime()
  const days = Math.floor(remainder / MS_PER_DAY)
  remainder -= days * MS_PER_DAY
  const hours = Math.floor(remainder / MS_PER_HOUR)
  remainder -= hours * MS_PER_HOUR
  const minutes = Math.floor(remainder / MS_PER_MINUTE)
  remainder -= minutes * MS_PER_MINUTE
  const seconds = Math.floor(remainder / MS_PER_SECOND)

  const diffMs = to.getTime() - from.getTime()
  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor(diffMs / MS_PER_DAY),
    totalWeeks: Math.floor(diffMs / MS_PER_DAY / 7),
    totalHours: Math.floor(diffMs / MS_PER_HOUR),
    totalMinutes: Math.floor(diffMs / MS_PER_MINUTE),
    totalSeconds: Math.floor(diffMs / MS_PER_SECOND),
    businessDays: countBusinessDays(from, to),
    direction,
  }
}

export type DurationParts = {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** Add (or, when `sign` is -1, subtract) a calendar duration from `base`. */
export const addDuration = (base: Date, parts: DurationParts, sign: 1 | -1): Date => {
  const result = new Date(base.getTime())
  result.setFullYear(result.getFullYear() + sign * parts.years)
  result.setMonth(result.getMonth() + sign * parts.months)
  result.setDate(result.getDate() + sign * (parts.weeks * 7 + parts.days))
  result.setHours(result.getHours() + sign * parts.hours)
  result.setMinutes(result.getMinutes() + sign * parts.minutes)
  result.setSeconds(result.getSeconds() + sign * parts.seconds)
  return result
}

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const weekdayLabel = (date: Date, locale: 'ja' | 'en') =>
  (locale === 'ja' ? WEEKDAYS_JA : WEEKDAYS_EN)[date.getDay()]

/** ISO 8601 week number (weeks start Monday, week 1 contains the first Thursday). */
export const isoWeekNumber = (date: Date) => {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayNr = (target.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNr = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3)
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (MS_PER_DAY * 7))
}

/** Day of the year, 1–366. */
export const dayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date.getTime() - start.getTime()) / MS_PER_DAY)
}

/** Format a Date for a `datetime-local` input value (local time, no timezone). */
export const toDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export const formatLong = (date: Date, locale: 'ja' | 'en') => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  return `${base} (${weekdayLabel(date, locale)})`
}
