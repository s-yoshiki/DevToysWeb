'use client'

import { useMemo, useState } from 'react'
import {
  buildXSearchQuery,
  buildXSearchUrl,
  emptyXSearchCondition,
  type XSearchCondition,
  type XSearchResultTab,
} from '../../domain/x-search'

/** Holds the advanced-search condition and derives the query and target URL. */
export const useXSearch = () => {
  const [condition, setCondition] = useState<XSearchCondition>(emptyXSearchCondition)
  const [tab, setTab] = useState<XSearchResultTab>('top')

  const set = <Key extends keyof XSearchCondition>(key: Key, value: XSearchCondition[Key]) =>
    setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildXSearchQuery(condition), [condition])
  const url = useMemo(() => buildXSearchUrl(condition, tab), [condition, tab])

  const reset = () => {
    setCondition(emptyXSearchCondition)
    setTab('top')
  }

  return { condition, set, tab, setTab, query, url, reset }
}
