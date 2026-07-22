'use client'

import { useMemo, useState } from 'react'
import {
  buildGithubSearchQuery,
  buildGithubSearchUrl,
  emptyGithubSearchCondition,
  type GithubSearchCondition,
} from '../../domain/github-search'

/** Holds the advanced-search condition and derives the query and target URL. */
export const useGithubSearch = () => {
  const [condition, setCondition] = useState<GithubSearchCondition>(emptyGithubSearchCondition)

  const set = <Key extends keyof GithubSearchCondition>(
    key: Key,
    value: GithubSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGithubSearchQuery(condition), [condition])
  const url = useMemo(() => buildGithubSearchUrl(condition), [condition])
  const { searchType } = condition

  return {
    condition,
    set,
    query,
    url,
    searchType,
    // Issues and pull requests share the same filter vocabulary.
    isIssueSearch: searchType === 'issues' || searchType === 'pullrequests',
    reset: () => setCondition(emptyGithubSearchCondition),
  }
}
