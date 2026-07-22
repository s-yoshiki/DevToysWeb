/**
 * Minimal Web Audio chime shared by the time tools. Browsers only allow an
 * AudioContext to start from a user gesture, so the context is created lazily on
 * the first play and then reused (and resumed) for every later beep.
 */

type AudioContextConstructor = new () => AudioContext

const audioContextConstructor = (): AudioContextConstructor | undefined => {
  if (typeof window === 'undefined') return undefined
  const scope = window as typeof window & { webkitAudioContext?: AudioContextConstructor }
  return scope.AudioContext ?? scope.webkitAudioContext
}

export const isAudioSupported = () => Boolean(audioContextConstructor())

let context: AudioContext | null = null

const getContext = () => {
  const Constructor = audioContextConstructor()
  if (!Constructor) return null
  if (!context) context = new Constructor()
  if (context.state === 'suspended') void context.resume()
  return context
}

/**
 * Creates (or resumes) the shared context from a user gesture. Calling this when
 * a sound-based feature is enabled satisfies browser autoplay restrictions so
 * that later scheduled sounds can run without another click.
 */
export const prepareAudio = async () => {
  const audio = getContext()
  if (!audio) return false
  if (audio.state === 'suspended') {
    try {
      await audio.resume()
    } catch {
      return false
    }
  }
  return true
}

export type BeepOptions = {
  /** Pitch in hertz; higher reads as more urgent. */
  frequency?: number
  /** Length of a single beep in seconds. */
  duration?: number
  /** How many beeps to play back to back. */
  count?: number
  /** Peak gain, 0–1. */
  volume?: number
}

/**
 * Plays `count` short sine beeps. Returns false when the browser has no Web
 * Audio support so callers can fall back to a purely visual cue.
 */
export const playBeep = ({
  frequency = 880,
  duration = 0.18,
  count = 1,
  volume = 0.25,
}: BeepOptions = {}) => {
  const audio = getContext()
  if (!audio) return false

  const gap = duration + 0.12
  for (let index = 0; index < count; index += 1) {
    const startAt = audio.currentTime + index * gap
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    // Ramped rather than switched, because an abrupt gain change clicks.
    gain.gain.setValueAtTime(0.0001, startAt)
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + duration + 0.02)
  }
  return true
}

/** The NHK-style pattern: three low pips followed by one long high tone. */
export const playTimeSignal = (volume = 0.25) => {
  const audio = getContext()
  if (!audio) return false
  const played = playBeep({ frequency: 440, duration: 0.12, count: 3, volume })
  if (!played) return false
  window.setTimeout(() => playBeep({ frequency: 880, duration: 0.7, volume }), 720)
  return true
}

/**
 * Schedules the telephone time-service pattern against the AudioContext clock.
 * The short 440 Hz pips sound three, two, and one seconds before `targetAt`; the
 * 880 Hz tone starts exactly on the announced boundary.
 */
export const scheduleTelephoneTimeSignal = (targetAt: number, volume = 0.25) => {
  const audio = getContext()
  if (!audio) return null

  const targetAudioTime = audio.currentTime + (targetAt - Date.now()) / 1_000
  const oscillators: OscillatorNode[] = []
  const tones = [
    { offset: -3, frequency: 440, duration: 0.1 },
    { offset: -2, frequency: 440, duration: 0.1 },
    { offset: -1, frequency: 440, duration: 0.1 },
    { offset: 0, frequency: 880, duration: 0.7 },
  ]

  for (const tone of tones) {
    const startAt = targetAudioTime + tone.offset
    if (startAt <= audio.currentTime) continue

    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = tone.frequency
    gain.gain.setValueAtTime(0.0001, startAt)
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + tone.duration + 0.02)
    oscillators.push(oscillator)
  }

  return () => {
    for (const oscillator of oscillators) {
      try {
        oscillator.stop()
      } catch {
        // The oscillator may already have finished naturally.
      }
    }
  }
}
