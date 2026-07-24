'use client'

import { useCallback, useEffect, useState } from 'react'

export type ConnectionInfo = {
  online: boolean
  connectionType: string | null
  downlink: number | null
  rtt: number | null
  saveData: boolean | null
  language: string
  languages: string
  timezone: string
  timezoneOffset: string
  platform: string
  vendor: string
  cookieEnabled: boolean
  doNotTrack: string
  hardwareConcurrency: number | null
  deviceMemory: number | null
  userAgent: string
}

type NavigatorConnection = {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

const offsetLabel = () => {
  const offset = -new Date().getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const pad = (n: number) => String(Math.abs(n)).padStart(2, '0')
  return `UTC${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`
}

const read = (): ConnectionInfo => {
  const nav = navigator as Navigator & {
    connection?: NavigatorConnection
    deviceMemory?: number
  }
  const connection = nav.connection
  return {
    online: nav.onLine,
    connectionType: connection?.effectiveType ?? null,
    downlink: connection?.downlink ?? null,
    rtt: connection?.rtt ?? null,
    saveData: connection?.saveData ?? null,
    language: nav.language,
    languages: nav.languages?.join(', ') ?? nav.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: offsetLabel(),
    platform: nav.platform,
    vendor: nav.vendor || '—',
    cookieEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack ?? 'null',
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    deviceMemory: nav.deviceMemory ?? null,
    userAgent: nav.userAgent,
  }
}

export const useConnectionInfo = () => {
  const [info, setInfo] = useState<ConnectionInfo | null>(null)

  const refresh = useCallback(() => setInfo(read()), [])

  useEffect(() => {
    refresh()
    const update = () => refresh()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [refresh])

  return { info, refresh }
}
