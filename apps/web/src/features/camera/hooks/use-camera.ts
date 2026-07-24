'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type Facing = 'user' | 'environment'

type Status = 'idle' | 'starting' | 'live' | 'error'

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [facing, setFacing] = useState<Facing>('user')
  const [errorCode, setErrorCode] = useState('')
  const [photo, setPhoto] = useState('')

  const supported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }, [])

  const start = useCallback(
    async (mode: Facing) => {
      if (!supported) {
        setStatus('error')
        setErrorCode('no-api')
        return
      }
      stop()
      setStatus('starting')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setFacing(mode)
        setStatus('live')
        setErrorCode('')
      } catch (error) {
        setStatus('error')
        setErrorCode(error instanceof DOMException ? error.name : 'unknown')
      }
    },
    [supported, stop],
  )

  const flip = useCallback(() => {
    void start(facing === 'user' ? 'environment' : 'user')
  }, [facing, start])

  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video?.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setPhoto(canvas.toDataURL('image/png'))
  }, [])

  useEffect(() => stop, [stop])

  const clear = useCallback(() => {
    stop()
    setPhoto('')
    setErrorCode('')
  }, [stop])

  return {
    videoRef,
    status,
    facing,
    errorCode,
    photo,
    supported,
    start,
    stop,
    flip,
    capture,
    clear,
  }
}
