'use client'

import { useState } from 'react'
import {
  type ImageFormat,
  maxImageFileSize,
  withImageExtension,
} from '@/features/tools/domain/image'
import { useImageBatch } from '@/features/tools/hooks/use-image-batch'
import { useTranslate } from '@/hooks/use-translate'
import { convertHeic, isHeicFile } from '../functions/heic'

/** Canvas can encode all three, and none of them need a HEVC licence to open. */
export const heicTargetFormats: ImageFormat[] = ['image/jpeg', 'image/png', 'image/webp']

export const useHeicConvert = () => {
  const t = useTranslate()
  const [format, setFormat] = useState<ImageFormat>('image/jpeg')
  const [quality, setQuality] = useState(90)

  const batch = useImageBatch((file) =>
    file.size > maxImageFileSize ? t('15MBを超えています', 'Larger than 15 MB') : '',
  )

  return {
    ...batch,
    format,
    setFormat,
    quality,
    setQuality,
    convert: () =>
      batch.run(async (file) => {
        if (!(await isHeicFile(file)))
          throw new Error(t('HEIC/HEIF画像ではありません', 'Not a HEIC/HEIF image'))
        return {
          blob: await convertHeic(file, format, quality),
          name: withImageExtension(file.name, format),
        }
      }),
  }
}
