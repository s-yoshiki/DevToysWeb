'use client'

import { useState } from 'react'
import {
  encodeImage,
  type ImageFormat,
  maxImageFileSize,
  withImageExtension,
} from '@/libs/domain/image'
import { useImageBatch } from '@/hooks/use-image-batch'
import { useTranslate } from '@/hooks/use-translate'

/** Format-only conversion: several files at once, original dimensions kept. */
export const useImageFormat = () => {
  const t = useTranslate()
  const [format, setFormat] = useState<ImageFormat>('image/webp')
  const [quality, setQuality] = useState(85)

  const batch = useImageBatch((file) => {
    if (!file.type.startsWith('image/')) return t('画像ではありません', 'Not an image file')
    if (file.size > maxImageFileSize) return t('15MBを超えています', 'Larger than 15 MB')
    return ''
  })

  return {
    ...batch,
    format,
    setFormat,
    quality,
    setQuality,
    convert: () =>
      batch.run(async (file) => ({
        blob: (await encodeImage(file, { format, quality, maxWidth: 0 })).blob,
        name: withImageExtension(file.name, format),
      })),
  }
}
