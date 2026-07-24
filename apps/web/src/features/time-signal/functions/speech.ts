'use client'

import { formatTimeAnnouncement } from './time-signal'

let activeUtterance: SpeechSynthesisUtterance | null = null

export const isSpeechSupported = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof SpeechSynthesisUtterance !== 'undefined'

export const cancelTimeAnnouncement = () => {
  if (!isSpeechSupported()) return
  if (activeUtterance) window.speechSynthesis.cancel()
  activeUtterance = null
}

export const speakTimeAnnouncement = (date: Date, locale: 'ja' | 'en', onEnd?: () => void) => {
  if (!isSpeechSupported()) return false

  if (activeUtterance) window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(formatTimeAnnouncement(date, locale))
  utterance.lang = locale === 'ja' ? 'ja-JP' : 'en-US'
  utterance.rate = locale === 'ja' ? 0.95 : 0.8
  utterance.pitch = 0.9

  const voice = window.speechSynthesis
    .getVoices()
    .find((candidate) => candidate.lang.toLowerCase().startsWith(locale))
  if (voice) utterance.voice = voice

  utterance.onend = () => {
    activeUtterance = null
    onEnd?.()
  }
  utterance.onerror = () => {
    activeUtterance = null
    onEnd?.()
  }
  activeUtterance = utterance
  window.speechSynthesis.speak(utterance)
  return true
}
