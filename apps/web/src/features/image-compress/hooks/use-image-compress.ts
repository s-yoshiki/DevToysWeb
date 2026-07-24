'use client'

import { useState } from 'react'
import {
  encodeImage,
  type ImageFormat,
  maxImageFileSize,
  sourceImageFormat,
  withImageExtension,
} from '@/libs/domain/image'
import { useImageBatch } from '@/hooks/use-image-batch'
import { useTranslate } from '@/hooks/use-translate'

/** `source` keeps each file in the format it arrived in. */
export type CompressTarget = 'source' | ImageFormat

const widthPresets = [0, 3840, 2560, 1920, 1280, 800] as const

/**
 * Size-first counterpart to the format converter: the same batch plumbing, but
 * the knobs are quality and maximum width, and the report is what was saved.
 */
export const useImageCompress = () => {
  const t = useTranslate()
  const [target, setTarget] = useState<CompressTarget>('source')
  const [quality, setQuality] = useState(75)
  const [maxWidth, setMaxWidth] = useState<number>(1920)

  const batch = useImageBatch((file) => {
    if (!file.type.startsWith('image/')) return t('画像ではありません', 'Not an image file')
    if (file.size > maxImageFileSize) return t('15MBを超えています', 'Larger than 15 MB')
    return ''
  })

  const originalBytes = batch.items.reduce((total, item) => total + item.file.size, 0)
  const compressedBytes = batch.items.reduce(
    (total, item) => total + (item.result?.size ?? item.file.size),
    0,
  )

  return {
    ...batch,
    target,
    setTarget,
    quality,
    setQuality,
    maxWidth,
    setMaxWidth,
    widthPresets,
    originalBytes,
    compressedBytes,
    savedRatio: originalBytes ? ((originalBytes - compressedBytes) / originalBytes) * 100 : 0,
    compress: () =>
      batch.run(async (file) => {
        const format = target === 'source' ? sourceImageFormat(file) : target
        const { blob } = await encodeImage(file, { format, quality, maxWidth })
        return { blob, name: withImageExtension(file.name, format) }
      }),
  }
}
