'use client'

import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

export const correctionLevels = ['L', 'M', 'Q', 'H'] as const
export type CorrectionLevel = (typeof correctionLevels)[number]

export const useQrCode = () => {
  const [input, setInput] = useState('https://devtoys.app/')
  const [size, setSize] = useState(320)
  const [level, setLevel] = useState<CorrectionLevel>('M')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!input) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(input, { width: size, margin: 2, errorCorrectionLevel: level })
      .then((value) => {
        setDataUrl(value)
        setError('')
      })
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : 'QR generation failed'),
      )
  }, [input, level, size])

  return {
    input,
    setInput,
    size,
    setSize,
    level,
    setLevel,
    dataUrl,
    error,
    clear: () => setInput(''),
  }
}
