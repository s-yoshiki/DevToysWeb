'use client'

import { useState } from 'react'
import { diagnoseSite } from '@/features/tools/api/diagnostics-client'
import { useApiRequest } from '@/features/tools/hooks/use-api-request'

export const useSiteDiagnostics = () => {
  const [url, setUrl] = useState('https://example.com')
  const request = useApiRequest(diagnoseSite, 'Diagnostics failed')

  const clear = () => {
    setUrl('')
    request.reset()
  }

  return { url, setUrl, ...request, run: () => void request.run(url), clear }
}
