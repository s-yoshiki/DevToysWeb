import {
  integer,
  isoDate,
  negate,
  orGroup,
  quotePhrase,
  splitTerms,
} from '@/features/tools/domain/search-operators'

/** Result vertical, matching GitHub's `type=` URL parameter. */
export type GithubSearchType =
  | 'repositories'
  | 'code'
  | 'issues'
  | 'pullrequests'
  | 'users'
  | 'discussions'

/** Owner qualifier: a personal account (`user:`) or an organisation (`org:`). */
export type GithubOwnerKind = 'user' | 'org'

/** Where a repository search should look for the words. */
export type GithubRepoField = '' | 'name' | 'description' | 'readme' | 'topics'

/** Whether forked or archived repositories take part in the search. */
export type GithubInclusion = 'default' | 'exclude' | 'only'

export type GithubIssueState = '' | 'open' | 'closed' | 'merged' | 'draft'

export type GithubReviewState = '' | 'none' | 'required' | 'approved' | 'changes_requested'

export type GithubAccountType = '' | 'user' | 'org'

export type GithubSearchCondition = {
  searchType: GithubSearchType
  allWords: string
  exactPhrase: string
  anyWords: string
  noneWords: string
  ownerKind: GithubOwnerKind
  owner: string
  repo: string
  language: string
  createdAfter: string
  createdBefore: string
  // Repositories
  repoField: GithubRepoField
  minStars: string
  minForks: string
  topic: string
  license: string
  pushedAfter: string
  archived: GithubInclusion
  forks: GithubInclusion
  // Code
  path: string
  symbol: string
  // Issues and pull requests
  state: GithubIssueState
  author: string
  assignee: string
  mentions: string
  label: string
  milestone: string
  minComments: string
  review: GithubReviewState
  // Users
  accountType: GithubAccountType
  location: string
  minFollowers: string
  minRepos: string
}

export const emptyGithubSearchCondition: GithubSearchCondition = {
  searchType: 'repositories',
  allWords: '',
  exactPhrase: '',
  anyWords: '',
  noneWords: '',
  ownerKind: 'user',
  owner: '',
  repo: '',
  language: '',
  createdAfter: '',
  createdBefore: '',
  repoField: '',
  minStars: '',
  minForks: '',
  topic: '',
  license: '',
  pushedAfter: '',
  archived: 'default',
  forks: 'default',
  path: '',
  symbol: '',
  state: '',
  author: '',
  assignee: '',
  mentions: '',
  label: '',
  milestone: '',
  minComments: '',
  review: '',
  accountType: '',
  location: '',
  minFollowers: '',
  minRepos: '',
}

const isIssueSearch = (type: GithubSearchType) => type === 'issues' || type === 'pullrequests'

/** A value containing spaces has to be quoted, as GitHub would otherwise split it. */
const qualifier = (name: string, value: string) => {
  const term = value.trim().replace(/"/g, '')
  if (!term) return ''
  return term.includes(' ') ? `${name}:"${term}"` : `${name}:${term}`
}

/** GitHub expresses thresholds as ranges, so a minimum becomes `>=n`. */
const atLeast = (name: string, value: string) => {
  const amount = integer(value)
  return amount ? `${name}:>=${amount}` : ''
}

const dateBound = (name: string, value: string, comparator: '>=' | '<=') => {
  const date = isoDate(value)
  return date ? `${name}:${comparator}${date}` : ''
}

/** `repo:` already pins the owner, so an owner qualifier would only narrow it further. */
const scopeOperators = (condition: GithubSearchCondition) => {
  const repo = condition.repo.trim()
  if (repo) return [`repo:${repo}`]
  return [orGroup(splitTerms(condition.owner).map((term) => `${condition.ownerKind}:${term}`))]
}

const inclusionOperator = (name: string, value: GithubInclusion) => {
  if (value === 'only') return `${name}:true`
  if (value === 'exclude') return `${name}:false`
  return ''
}

/**
 * Assembles the operator string GitHub's advanced search form produces. Only
 * the qualifiers that apply to the selected result type are emitted, since
 * GitHub rejects a search that mixes qualifiers across verticals.
 */
export const buildGithubSearchQuery = (condition: GithubSearchCondition) => {
  const parts: string[] = []
  const { searchType } = condition

  parts.push(...splitTerms(condition.allWords))
  parts.push(quotePhrase(condition.exactPhrase))
  parts.push(orGroup(splitTerms(condition.anyWords)))
  parts.push(...splitTerms(condition.noneWords).map(negate))

  if (searchType !== 'users') parts.push(...scopeOperators(condition))
  if (searchType !== 'discussions') parts.push(qualifier('language', condition.language))

  if (searchType === 'repositories') {
    if (condition.repoField) parts.push(`in:${condition.repoField}`)
    parts.push(atLeast('stars', condition.minStars))
    parts.push(atLeast('forks', condition.minForks))
    parts.push(qualifier('topic', condition.topic))
    parts.push(qualifier('license', condition.license))
    parts.push(dateBound('pushed', condition.pushedAfter, '>='))
    parts.push(inclusionOperator('archived', condition.archived))
    parts.push(inclusionOperator('fork', condition.forks))
  }

  if (searchType === 'code') {
    parts.push(qualifier('path', condition.path))
    parts.push(qualifier('symbol', condition.symbol))
  }

  if (isIssueSearch(searchType)) {
    if (condition.state) parts.push(`is:${condition.state}`)
    parts.push(qualifier('author', condition.author))
    parts.push(qualifier('assignee', condition.assignee))
    parts.push(qualifier('mentions', condition.mentions))
    parts.push(qualifier('label', condition.label))
    parts.push(qualifier('milestone', condition.milestone))
    parts.push(atLeast('comments', condition.minComments))
    if (condition.review) parts.push(`review:${condition.review}`)
  }

  if (searchType === 'discussions') {
    parts.push(qualifier('author', condition.author))
  }

  if (searchType === 'users') {
    if (condition.accountType) parts.push(`type:${condition.accountType}`)
    parts.push(qualifier('location', condition.location))
    parts.push(atLeast('followers', condition.minFollowers))
    parts.push(atLeast('repos', condition.minRepos))
  }

  parts.push(dateBound('created', condition.createdAfter, '>='))
  parts.push(dateBound('created', condition.createdBefore, '<='))

  return parts.filter(Boolean).join(' ')
}

export const buildGithubSearchUrl = (condition: GithubSearchCondition) => {
  const query = buildGithubSearchQuery(condition)
  if (!query) return ''
  const params = new URLSearchParams({ q: query, type: condition.searchType })
  return `https://github.com/search?${params.toString()}`
}
