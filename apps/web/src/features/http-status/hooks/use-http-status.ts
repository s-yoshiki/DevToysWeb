'use client'

import { useMemo, useState } from 'react'
import {
  filterHttpStatuses,
  type HttpStatusClass,
  httpStatuses,
  statusClassOf,
} from '../functions/http-status'

export const useHttpStatus = () => {
  const [query, setQuery] = useState('')
  const [statusClass, setStatusClass] = useState<HttpStatusClass | 'all'>('all')

  const results = useMemo(
    () => filterHttpStatuses(httpStatuses, query, statusClass),
    [query, statusClass],
  )

  // Rendering one section per class keeps the flat list scannable.
  const groups = useMemo(() => {
    const buckets = new Map<HttpStatusClass, typeof results>()
    for (const status of results) {
      const key = statusClassOf(status.code)
      buckets.set(key, [...(buckets.get(key) ?? []), status])
    }
    return [...buckets.entries()]
  }, [results])

  const clear = () => {
    setQuery('')
    setStatusClass('all')
  }

  return {
    query,
    setQuery,
    statusClass,
    setStatusClass,
    results,
    groups,
    clear,
    total: httpStatuses.length,
  }
}
