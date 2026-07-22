import {
  isoDate,
  naturalNumber,
  negate,
  orGroup,
  quotePhrase,
  splitTerms,
} from '@/features/tools/domain/search-operators'

/** Three-state toggle used by X search filters such as replies and links. */
export type XSearchFilterMode = 'any' | 'only' | 'exclude'

/** Result tab on x.com/search: Top, Latest, People or Media. */
export type XSearchResultTab = 'top' | 'live' | 'user' | 'media'

export type XSearchCondition = {
  allWords: string
  exactPhrase: string
  anyWords: string
  noneWords: string
  hashtags: string
  language: string
  fromAccounts: string
  toAccounts: string
  mentionAccounts: string
  replies: XSearchFilterMode
  links: XSearchFilterMode
  minReplies: string
  minFaves: string
  minRetweets: string
  since: string
  until: string
}

export const emptyXSearchCondition: XSearchCondition = {
  allWords: '',
  exactPhrase: '',
  anyWords: '',
  noneWords: '',
  hashtags: '',
  language: '',
  fromAccounts: '',
  toAccounts: '',
  mentionAccounts: '',
  replies: 'any',
  links: 'any',
  minReplies: '',
  minFaves: '',
  minRetweets: '',
  since: '',
  until: '',
}

const withPrefix = (prefix: string, term: string) =>
  term.startsWith(prefix) ? term : `${prefix}${term}`

const stripAccount = (term: string) => term.replace(/^@/, '')

const filterOperator = (mode: XSearchFilterMode, name: string) => {
  if (mode === 'only') return `filter:${name}`
  if (mode === 'exclude') return `-filter:${name}`
  return ''
}

/**
 * Assembles the operator string X's advanced search form produces, in the same
 * order the form emits: words, accounts, filters, engagement, then dates.
 */
export const buildXSearchQuery = (condition: XSearchCondition) => {
  const parts: string[] = []

  parts.push(...splitTerms(condition.allWords))
  parts.push(quotePhrase(condition.exactPhrase))
  parts.push(orGroup(splitTerms(condition.anyWords)))
  parts.push(...splitTerms(condition.noneWords).map(negate))
  parts.push(orGroup(splitTerms(condition.hashtags).map((term) => withPrefix('#', term))))
  if (condition.language.trim()) parts.push(`lang:${condition.language.trim()}`)

  parts.push(
    orGroup(splitTerms(condition.fromAccounts).map((term) => `from:${stripAccount(term)}`)),
  )
  parts.push(orGroup(splitTerms(condition.toAccounts).map((term) => `to:${stripAccount(term)}`)))
  parts.push(orGroup(splitTerms(condition.mentionAccounts).map((term) => withPrefix('@', term))))

  parts.push(filterOperator(condition.replies, 'replies'))
  parts.push(filterOperator(condition.links, 'links'))

  const minReplies = naturalNumber(condition.minReplies)
  if (minReplies) parts.push(`min_replies:${minReplies}`)
  const minFaves = naturalNumber(condition.minFaves)
  if (minFaves) parts.push(`min_faves:${minFaves}`)
  const minRetweets = naturalNumber(condition.minRetweets)
  if (minRetweets) parts.push(`min_retweets:${minRetweets}`)

  const since = isoDate(condition.since)
  if (since) parts.push(`since:${since}`)
  const until = isoDate(condition.until)
  if (until) parts.push(`until:${until}`)

  return parts.filter(Boolean).join(' ')
}

export const buildXSearchUrl = (condition: XSearchCondition, tab: XSearchResultTab = 'top') => {
  const query = buildXSearchQuery(condition)
  if (!query) return ''
  const params = new URLSearchParams({ q: query, src: 'typed_query' })
  if (tab !== 'top') params.set('f', tab)
  return `https://x.com/search?${params.toString()}`
}
