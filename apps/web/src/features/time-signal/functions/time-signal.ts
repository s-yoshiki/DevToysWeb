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

/** `HH:MM:SS` in the visitor's local time, always zero-padded and 24-hour. */
export const formatWallClock = (date: Date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
