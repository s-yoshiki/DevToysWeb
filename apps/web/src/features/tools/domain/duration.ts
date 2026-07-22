/** Duration formatting shared by the timer and stopwatch workspaces. */

const pad = (value: number, length = 2) => String(value).padStart(length, '0')

export type DurationParts = {
  hours: number
  minutes: number
  seconds: number
  /** Hundredths of a second, the finest unit either tool displays. */
  centiseconds: number
}

export const splitDuration = (milliseconds: number): DurationParts => {
  const total = Math.max(0, Math.floor(milliseconds))
  return {
    hours: Math.floor(total / 3_600_000),
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
    centiseconds: Math.floor(total / 10) % 100,
  }
}

/** `MM:SS` until an hour has passed, then `H:MM:SS`. */
export const formatClock = (milliseconds: number) => {
  const { hours, minutes, seconds } = splitDuration(milliseconds)
  return hours ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

/** The stopwatch reading, with hundredths appended. */
export const formatPrecise = (milliseconds: number) =>
  `${formatClock(milliseconds)}.${pad(splitDuration(milliseconds).centiseconds)}`

/** Total milliseconds for an hours/minutes/seconds form, clamped at zero. */
export const toMilliseconds = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: {
  hours?: number
  minutes?: number
  seconds?: number
}) => Math.max(0, (hours * 3600 + minutes * 60 + seconds) * 1000)
