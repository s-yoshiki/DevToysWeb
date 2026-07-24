'use client'

import { useState } from 'react'
import { inspectPage, type SiteReport } from '@/libs/api/diagnostics-client'

/**
 * Fetches one page report from `/api/diagnose`. The OGP and SEO checkers read
 * different parts of the same response, so they share the request plumbing.
 */
export const usePageReport = (fallbackMessage: string) => {
  const [url, setUrl] = useState('https://example.com')
  const [report, setReport] = useState<SiteReport | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    const value = url.trim()
    if (!value) return
    setLoading(true)
    setError('')
    try {
      setReport(await inspectPage(value))
    } catch (reason) {
      setReport(null)
      setError(reason instanceof Error ? reason.message : fallbackMessage)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setUrl('')
    setReport(null)
    setError('')
  }

  return { url, setUrl, report, error, loading, run: () => void run(), clear }
}
