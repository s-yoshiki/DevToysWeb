export const maxImageFileSize = 15 * 1024 * 1024

export const imageFormats = ['image/webp', 'image/avif', 'image/jpeg', 'image/png'] as const
export type ImageFormat = (typeof imageFormats)[number]

export const imageFormatLabels: Record<ImageFormat, string> = {
  'image/webp': 'WebP',
  'image/avif': 'AVIF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
}

export type EncodedImage = { blob: Blob; width: number; height: number }

const drawToCanvas = (bitmap: ImageBitmap, width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable in this browser')
  context.drawImage(bitmap, 0, 0, width, height)
  return canvas
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

export const encodeImage = async (
  file: File,
  { format, quality, maxWidth }: { format: ImageFormat; quality: number; maxWidth: number },
): Promise<EncodedImage> => {
  const bitmap = await createImageBitmap(file)
  const scale = maxWidth > 0 && bitmap.width > maxWidth ? maxWidth / bitmap.width : 1
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = drawToCanvas(bitmap, width, height)
  bitmap.close()

  const blob = await toBlob(canvas, format, quality / 100)
  // Safari silently falls back to PNG for formats it cannot encode.
  if (!blob) throw new Error(`${imageFormatLabels[format]} encoding is not supported here`)
  if (blob.type !== format)
    throw new Error(
      `${imageFormatLabels[format]} is not supported by this browser (got ${blob.type})`,
    )
  return { blob, width, height }
}

/** Re-encoding through a canvas drops every metadata segment by construction. */
export const stripMetadata = async (file: File) => {
  const bitmap = await createImageBitmap(file)
  const canvas = drawToCanvas(bitmap, bitmap.width, bitmap.height)
  bitmap.close()
  const blob = await toBlob(canvas, 'image/jpeg', 0.92)
  if (!blob) throw new Error('Could not re-encode the image')
  return blob
}
