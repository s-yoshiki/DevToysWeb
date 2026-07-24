'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type BatchConversion = { blob: Blob; name: string }

export type BatchItem = {
  id: string
  file: File
  status: 'pending' | 'working' | 'done' | 'error'
  result?: { url: string; size: number; name: string }
  error?: string
}

export const maxBatchFiles = 20

/**
 * File-list bookkeeping shared by the batch image tools: selection, per-file
 * status while a conversion runs, and object URL cleanup. Callers supply the
 * conversion itself, so the two tools differ only in how a file becomes a blob.
 */
export const useImageBatch = (validate?: (file: File) => string) => {
  const [items, setItems] = useState<BatchItem[]>([])
  const [rejected, setRejected] = useState<{ name: string; reason: string }[]>([])
  const [busy, setBusy] = useState(false)
  const urls = useRef<string[]>([])

  const releaseUrls = useCallback(() => {
    for (const url of urls.current) URL.revokeObjectURL(url)
    urls.current = []
  }, [])

  useEffect(() => releaseUrls, [releaseUrls])

  const update = (id: string, patch: Partial<BatchItem>) =>
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  /** Files the caller cannot handle are reported separately, not queued. */
  const select = (files: FileList | null) => {
    releaseUrls()
    const selected = Array.from(files ?? []).slice(0, maxBatchFiles)
    const accepted: BatchItem[] = []
    const refused: { name: string; reason: string }[] = []

    selected.forEach((file, index) => {
      const reason = validate?.(file) ?? ''
      if (reason) refused.push({ name: file.name, reason })
      else
        accepted.push({
          id: `${index}-${file.name}-${file.lastModified}`,
          file,
          status: 'pending',
        })
    })

    setItems(accepted)
    setRejected(refused)
  }

  // Sequential on purpose: decoding several images at once is what makes the tab
  // stutter, and per-file progress is more useful here than raw throughput.
  const run = async (convert: (file: File) => Promise<BatchConversion>) => {
    setBusy(true)
    for (const item of items) {
      update(item.id, { status: 'working', error: undefined, result: undefined })
      try {
        const { blob, name } = await convert(item.file)
        const url = URL.createObjectURL(blob)
        urls.current.push(url)
        update(item.id, { status: 'done', result: { url, size: blob.size, name } })
      } catch (reason) {
        update(item.id, {
          status: 'error',
          error: reason instanceof Error ? reason.message : 'Conversion failed',
        })
      }
    }
    setBusy(false)
  }

  const clear = () => {
    releaseUrls()
    setItems([])
    setRejected([])
  }

  return {
    items,
    rejected,
    busy,
    select,
    run: (convert: (file: File) => Promise<BatchConversion>) => void run(convert),
    clear,
    totalSaved: items.reduce(
      (total, item) => (item.result ? total + (item.file.size - item.result.size) : total),
      0,
    ),
  }
}
