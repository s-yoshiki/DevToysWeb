'use client'

import { useEffect, useState } from 'react'
import { useTranslate } from '@/hooks/use-translate'
import { type ExifEntry, hasLocationData, readExif } from '../../domain/exif'
import { maxImageFileSize, stripMetadata } from '../../domain/image'

export const useExif = () => {
  const t = useTranslate()
  const [file, setFile] = useState<File | null>(null)
  const [entries, setEntries] = useState<ExifEntry[] | null>(null)
  const [cleaned, setCleaned] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cleaned) return
    return () => URL.revokeObjectURL(cleaned.url)
  }, [cleaned])

  const loadFile = async (selected: File | null) => {
    setError('')
    setEntries(null)
    setCleaned(null)
    setFile(selected)
    if (!selected) return
    if (selected.size > maxImageFileSize) {
      setError(t('15MB以下の画像を選択してください', 'Choose an image under 15 MB'))
      return
    }
    try {
      setEntries(readExif(await selected.arrayBuffer()))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read EXIF')
    }
  }

  const strip = async () => {
    if (!file) return
    try {
      const blob = await stripMetadata(file)
      setCleaned({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not strip metadata')
    }
  }

  const clear = () => {
    setEntries(null)
    setCleaned(null)
    setFile(null)
    setError('')
  }

  return {
    file,
    fileName: file?.name ?? '',
    entries,
    cleaned,
    error,
    located: entries ? hasLocationData(entries) : false,
    loadFile: (selected: File | null) => void loadFile(selected),
    strip: () => void strip(),
    clear,
  }
}
