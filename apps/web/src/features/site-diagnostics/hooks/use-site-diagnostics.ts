'use client'

import { useState } from 'react'
import { diagnoseSite } from '@/libs/api/diagnostics-client'
import type { FullSiteReport } from '../types'

export const useSiteDiagnostics = () => {
  const [url, setUrl] = useState('https://example.com')
  const [report, setReport] = useState<FullSiteReport | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    try {
      setReport((await diagnoseSite(url)) as FullSiteReport)
    } catch (reason) {
      setReport(null)
      setError(reason instanceof Error ? reason.message : 'Diagnostics failed')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setUrl('')
    setReport(null)
    setError('')
  }

  return { url, setUrl, report, error, loading, run, clear }
}
