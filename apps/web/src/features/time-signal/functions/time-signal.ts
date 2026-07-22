/** Interval choices offered by the time signal, in minutes. */
export const signalIntervals = [60, 30, 15, 10, 5, 1] as const
export type SignalInterval = (typeof signalIntervals)[number]

/**
 * Index of the slot a moment falls into, counted from local midnight. The signal
 * fires when this value changes, which keeps the boundary check independent of
 * how often the clock is polled.
 */
export const slotIndex = (date: Date, intervalMinutes: number) =>
  Math.floor((date.getHours() * 60 + date.getMinutes()) / intervalMinutes)

/** Start of the next slot after `date`, used for the countdown display. */
export const nextSlotAt = (date: Date, intervalMinutes: number) => {
  const next = new Date(date)
  next.setSeconds(0, 0)
  const minutes = next.getHours() * 60 + next.getMinutes()
  const boundary = (Math.floor(minutes / intervalMinutes) + 1) * intervalMinutes
  next.setHours(0, 0, 0, 0)
  next.setMinutes(boundary)
  return next
}

/** The next 10-second boundary used by the Japanese 117-style signal. */
export const nextTelephoneSignalAt = (date: Date, minimumLeadMs = 0) => {
  const earliest = date.getTime() + minimumLeadMs
  return new Date(Math.ceil((earliest + 1) / 10_000) * 10_000)
}

/** Speech text for the upcoming tone, localized to the active page language. */
export const formatTimeAnnouncement = (date: Date, locale: 'ja' | 'en') => {
  const hours = date.getHours()
  const hour = hours % 12
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  if (locale === 'ja') {
    const period = hours < 12 ? '午前' : '午後'
    return `${period}${hour}時${minutes}分${seconds}秒をお知らせします`
  }

  const period = hours < 12 ? 'A.M.' : 'P.M.'
  return `At the tone, the time will be ${hour || 12} hours, ${minutes} minutes, and ${seconds} seconds ${period}`
}

/** `HH:MM:SS` in the visitor's local time, always zero-padded and 24-hour. */
export const formatWallClock = (date: Date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
