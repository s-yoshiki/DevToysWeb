'use client'

import { useMemo, useState } from 'react'
import {
  buildGmailSearchQuery,
  buildGmailSearchUrl,
  emptyGmailSearchCondition,
  type GmailSearchCondition,
} from '@/features/gmail-search/functions/gmail-search'

/** Holds the advanced-search condition and derives the query and target URL. */
export const useGmailSearch = () => {
  const [condition, setCondition] = useState<GmailSearchCondition>(emptyGmailSearchCondition)

  const set = <Key extends keyof GmailSearchCondition>(
    key: Key,
    value: GmailSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGmailSearchQuery(condition), [condition])
  const url = useMemo(() => buildGmailSearchUrl(condition), [condition])

  return { condition, set, query, url, reset: () => setCondition(emptyGmailSearchCondition) }
}
