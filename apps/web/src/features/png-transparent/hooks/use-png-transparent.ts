'use client'

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { maxImageFileSize } from '@/libs/domain/image'
import { useTranslate } from '@/hooks/use-translate'
import { knockOutColor, parseHexColor, toHexColor } from '../functions/png-transparent'

type Source = { width: number; height: number; pixels: Uint8ClampedArray; name: string }

const outputName = (name: string) => `${name.replace(/\.[^./\\]+$/, '') || 'image'}-transparent.png`

export const usePngTransparent = () => {
  const t = useTranslate()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [source, setSource] = useState<Source | null>(null)
  const [color, setColor] = useState('#ffffff')
  const [tolerance, setTolerance] = useState(12)
  const [soften, setSoften] = useState(true)
  const [cleared, setCleared] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(
    async (file?: File) => {
      setError('')
      setCleared(0)
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setError(t('画像ファイルを選択してください', 'Select an image file'))
        return
      }
      if (file.size > maxImageFileSize) {
        setError(t('15MB以下の画像を選択してください', 'Choose an image under 15 MB'))
        return
      }
      setBusy(true)
      try {
        const bitmap = await createImageBitmap(file)
        const scratch = document.createElement('canvas')
        scratch.width = bitmap.width
        scratch.height = bitmap.height
        const context = scratch.getContext('2d')
        if (!context) throw new Error('Canvas 2D is unavailable in this browser')
        context.drawImage(bitmap, 0, 0)
        bitmap.close()
        const image = context.getImageData(0, 0, scratch.width, scratch.height)
        setSource({
          width: scratch.width,
          height: scratch.height,
          pixels: image.data,
          name: file.name,
        })
        // The corner is nearly always the background the user wants gone.
        setColor(toHexColor({ r: image.data[0], g: image.data[1], b: image.data[2] }))
      } catch (reason) {
        setSource(null)
        setError(reason instanceof Error ? reason.message : 'Could not read the image')
      } finally {
        setBusy(false)
      }
    },
    [t],
  )

  // Re-runs on every parameter change so the preview always shows the current
  // settings; the original pixels are never mutated, only a working copy.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !source) return
    const context = canvas.getContext('2d')
    const target = parseHexColor(color)
    if (!context || !target) return

    const working = new Uint8ClampedArray(source.pixels)
    setCleared(knockOutColor(working, target, { tolerance, soften }))
    canvas.width = source.width
    canvas.height = source.height
    context.putImageData(new ImageData(working, source.width, source.height), 0, 0)
  }, [color, soften, source, tolerance])

  /** Samples the clicked pixel from the untouched original. */
  const pick = useCallback(
    (event: ReactMouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || !source) return
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor(((event.clientX - rect.left) / rect.width) * source.width)
      const y = Math.floor(((event.clientY - rect.top) / rect.height) * source.height)
      if (x < 0 || y < 0 || x >= source.width || y >= source.height) return
      const offset = (y * source.width + x) * 4
      setColor(
        toHexColor({
          r: source.pixels[offset],
          g: source.pixels[offset + 1],
          b: source.pixels[offset + 2],
        }),
      )
    },
    [source],
  )

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !source) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = outputName(source.name)
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [source])

  const clear = useCallback(() => {
    setSource(null)
    setCleared(0)
    setError('')
    setColor('#ffffff')
  }, [])

  return {
    canvasRef,
    source,
    color,
    setColor,
    tolerance,
    setTolerance,
    soften,
    setSoften,
    cleared,
    clearedRatio: source ? (cleared / (source.width * source.height)) * 100 : 0,
    error,
    busy,
    load: (file?: File) => void load(file),
    pick,
    download,
    clear,
  }
}
