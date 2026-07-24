'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type BarcodeDetectorLike,
  type DetectedBarcode,
  getBarcodeDetector,
} from '../types/barcode-detector'

type Status = 'idle' | 'starting' | 'scanning' | 'error'

export type ScanResult = { value: string; format: string; at: number }

export const useQrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<BarcodeDetectorLike | null>(null)
  const frameRef = useRef<number | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorCode, setErrorCode] = useState('')
  const [results, setResults] = useState<ScanResult[]>([])

  // Resolved after mount so the static-export markup (which always renders the
  // "unsupported" state) matches the first client render and avoids a hydration
  // mismatch. `start()` re-checks the live APIs directly rather than this state.
  const [detectorSupported, setDetectorSupported] = useState(false)
  useEffect(() => {
    setDetectorSupported(getBarcodeDetector() !== null)
  }, [])

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    detectorRef.current = null
    setStatus('idle')
  }, [])

  const pushResult = useCallback((barcode: DetectedBarcode) => {
    setResults((prev) => {
      if (prev[0]?.value === barcode.rawValue) return prev
      return [{ value: barcode.rawValue, format: barcode.format, at: Date.now() }, ...prev].slice(
        0,
        20,
      )
    })
  }, [])

  const start = useCallback(async () => {
    const Detector = getBarcodeDetector()
    const cameraSupported =
      typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
    if (!Detector || !cameraSupported) {
      setStatus('error')
      setErrorCode(!cameraSupported ? 'no-camera' : 'no-detector')
      return
    }
    stop()
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      detectorRef.current = new Detector({ formats: ['qr_code', 'ean_13', 'code_128', 'code_39'] })
      setStatus('scanning')
      setErrorCode('')

      const tick = async () => {
        const video = videoRef.current
        const detector = detectorRef.current
        if (!video || !detector || !video.videoWidth) {
          frameRef.current = requestAnimationFrame(() => void tick())
          return
        }
        try {
          const found = await detector.detect(video)
          if (found.length > 0) pushResult(found[0])
        } catch {
          // Transient decode failures are expected between frames; keep scanning.
        }
        frameRef.current = requestAnimationFrame(() => void tick())
      }
      frameRef.current = requestAnimationFrame(() => void tick())
    } catch (error) {
      setStatus('error')
      setErrorCode(error instanceof DOMException ? error.name : 'unknown')
    }
  }, [stop, pushResult])

  useEffect(() => stop, [stop])

  const clear = useCallback(() => {
    stop()
    setResults([])
    setErrorCode('')
  }, [stop])

  return {
    videoRef,
    status,
    errorCode,
    results,
    detectorSupported,
    start,
    stop,
    clear,
  }
}
