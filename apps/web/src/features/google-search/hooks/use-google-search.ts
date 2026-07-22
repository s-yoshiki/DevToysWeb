'use client'

import { useMemo, useState } from 'react'
import {
  buildGoogleSearchQuery,
  buildGoogleSearchUrl,
  emptyGoogleSearchCondition,
  type GoogleSearchCondition,
} from '@/features/google-search/functions/google-search'

/** Holds the advanced-search condition and derives the query and target URL. */
export const useGoogleSearch = () => {
  const [condition, setCondition] = useState<GoogleSearchCondition>(emptyGoogleSearchCondition)

  const set = <Key extends keyof GoogleSearchCondition>(
    key: Key,
    value: GoogleSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGoogleSearchQuery(condition), [condition])
  const url = useMemo(() => buildGoogleSearchUrl(condition), [condition])

  return { condition, set, query, url, reset: () => setCondition(emptyGoogleSearchCondition) }
}
