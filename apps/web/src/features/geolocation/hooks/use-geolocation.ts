'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Coords = {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
  timestamp: number
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const toCoords = (position: GeolocationPosition): Coords => ({
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy,
  altitude: position.coords.altitude,
  altitudeAccuracy: position.coords.altitudeAccuracy,
  heading: position.coords.heading,
  speed: position.coords.speed,
  timestamp: position.timestamp,
})

const messageFor = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'permission-denied'
    case error.POSITION_UNAVAILABLE:
      return 'unavailable'
    case error.TIMEOUT:
      return 'timeout'
    default:
      return 'unknown'
  }
}

export const useGeolocation = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [coords, setCoords] = useState<Coords | null>(null)
  const [errorCode, setErrorCode] = useState<string>('')
  const [watching, setWatching] = useState(false)
  const watchId = useRef<number | null>(null)

  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator

  const stopWatch = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
    setWatching(false)
  }, [])

  const locate = useCallback(() => {
    if (!supported) {
      setStatus('error')
      setErrorCode('no-api')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(toCoords(position))
        setStatus('success')
        setErrorCode('')
      },
      (error) => {
        setStatus('error')
        setErrorCode(messageFor(error))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, [supported])

  const toggleWatch = useCallback(() => {
    if (!supported) {
      setStatus('error')
      setErrorCode('no-api')
      return
    }
    if (watchId.current !== null) {
      stopWatch()
      return
    }
    setStatus('loading')
    setWatching(true)
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        setCoords(toCoords(position))
        setStatus('success')
        setErrorCode('')
      },
      (error) => {
        setStatus('error')
        setErrorCode(messageFor(error))
        stopWatch()
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, [supported, stopWatch])

  useEffect(() => stopWatch, [stopWatch])

  const clear = useCallback(() => {
    stopWatch()
    setCoords(null)
    setStatus('idle')
    setErrorCode('')
  }, [stopWatch])

  return { supported, status, coords, errorCode, watching, locate, toggleWatch, clear }
}
