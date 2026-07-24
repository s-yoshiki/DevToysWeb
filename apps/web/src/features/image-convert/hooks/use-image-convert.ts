'use client'

import { useEffect, useState } from 'react'
import { encodeImage, type ImageFormat, maxImageFileSize } from '@/libs/domain/image'
import { useTranslate } from '@/hooks/use-translate'

type Source = { file: File; url: string }
type Converted = { url: string; size: number; width: number; height: number }

export const useImageConvert = () => {
  const t = useTranslate()
  const [source, setSource] = useState<Source | null>(null)
  const [format, setFormat] = useState<ImageFormat>('image/webp')
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1600)
  const [result, setResult] = useState<Converted | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Object URLs are retained by the browser until explicitly revoked.
  useEffect(() => {
    if (!source) return
    return () => URL.revokeObjectURL(source.url)
  }, [source])
  useEffect(() => {
    if (!result) return
    return () => URL.revokeObjectURL(result.url)
  }, [result])

  const loadFile = (file?: File) => {
    setError('')
    setResult(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(t('画像ファイルを選択してください', 'Select an image file'))
      return
    }
    if (file.size > maxImageFileSize) {
      setError(t('15MB以下の画像を選択してください', 'Choose an image under 15 MB'))
      return
    }
    // The effect above owns revocation, so this only has to publish the new URL.
    setSource({ file, url: URL.createObjectURL(file) })
  }

  const convert = async () => {
    if (!source) return
    setBusy(true)
    setError('')
    try {
      const encoded = await encodeImage(source.file, { format, quality, maxWidth })
      setResult({
        url: URL.createObjectURL(encoded.blob),
        size: encoded.blob.size,
        width: encoded.width,
        height: encoded.height,
      })
    } catch (reason) {
      setResult(null)
      setError(reason instanceof Error ? reason.message : 'Conversion failed')
    } finally {
      setBusy(false)
    }
  }

  const clear = () => {
    setSource(null)
    setResult(null)
    setError('')
  }

  return {
    source,
    format,
    setFormat,
    quality,
    setQuality,
    maxWidth,
    setMaxWidth,
    result,
    error,
    busy,
    loadFile,
    convert: () => void convert(),
    savedRatio: source && result ? ((source.file.size - result.size) / source.file.size) * 100 : 0,
    clear,
  }
}
