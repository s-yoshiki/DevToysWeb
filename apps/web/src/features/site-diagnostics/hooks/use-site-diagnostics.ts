'use client'

import { useState } from 'react'
import { diagnoseSite } from '@/libs/api/diagnostics-client'
import { useApiRequest } from '@/hooks/use-api-request'

export const useSiteDiagnostics = () => {
  const [url, setUrl] = useState('https://example.com')
  const request = useApiRequest(diagnoseSite, 'Diagnostics failed')

  const clear = () => {
    setUrl('')
    request.reset()
  }

  return { url, setUrl, ...request, run: () => void request.run(url), clear }
}
