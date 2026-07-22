'use client'

import { useEffect, useState } from 'react'
import { generateQrCode } from '../functions/generate-qr-code'
import type { CorrectionLevel } from '../types/qr-code'

export const useQrCode = () => {
  const [input, setInput] = useState(`${location.href}`)
  const [size, setSize] = useState(320)
  const [level, setLevel] = useState<CorrectionLevel>('M')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!input) {
      setDataUrl('')
      setError('')
      return
    }

    let active = true

    generateQrCode(input, { size, level })
      .then((value) => {
        if (active) {
          setDataUrl(value)
          setError('')
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setDataUrl('')
          setError(reason instanceof Error ? reason.message : 'QR generation failed')
        }
      })

    return () => {
      active = false
    }
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
