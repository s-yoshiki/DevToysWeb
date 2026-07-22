import {
  integer,
  isoDate,
  negate,
  orGroup,
  quotePhrase,
  splitTerms,
} from '@/features/tools/domain/search-operators'

/** Recency filter, matching Google's `tbs=qdr:` values. */
export type GoogleTimeRange = '' | 'h' | 'd' | 'w' | 'm' | 'y'

export type GoogleSearchCondition = {
  allWords: string
  exactPhrase: string
  anyWords: string
  noneWords: string
  inTitle: string
  inText: string
  inUrl: string
  sites: string
  excludeSites: string
  fileType: string
  relatedSite: string
  numberFrom: string
  numberTo: string
  after: string
  before: string
  language: string
  timeRange: GoogleTimeRange
}

export const emptyGoogleSearchCondition: GoogleSearchCondition = {
  allWords: '',
  exactPhrase: '',
  anyWords: '',
  noneWords: '',
  inTitle: '',
  inText: '',
  inUrl: '',
  sites: '',
  excludeSites: '',
  fileType: '',
  relatedSite: '',
  numberFrom: '',
  numberTo: '',
  after: '',
  before: '',
  language: '',
  timeRange: '',
}

/** Google matches a bare host, so the scheme and any path would only narrow it wrongly. */
const bareHost = (term: string) => term.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

/**
 * Builds a numeric range. Google accepts open-ended forms such as `100..` and
 * `..500`, so a single bound is still worth emitting.
 */
const numberRange = (from: string, to: string) => {
  const low = integer(from)
  const high = integer(to)
  if (!low && !high) return ''
  return `${low}..${high}`
}

/**
 * Assembles the operator string Google's advanced search produces, in the order
 * the form presents it: words, placement, site and file, then dates.
 */
export const buildGoogleSearchQuery = (condition: GoogleSearchCondition) => {
  const parts: string[] = []

  parts.push(...splitTerms(condition.allWords))
  parts.push(quotePhrase(condition.exactPhrase))
  parts.push(orGroup(splitTerms(condition.anyWords)))
  parts.push(...splitTerms(condition.noneWords).map(negate))

  parts.push(orGroup(splitTerms(condition.inTitle).map((term) => `intitle:${term}`)))
  parts.push(orGroup(splitTerms(condition.inText).map((term) => `intext:${term}`)))
  parts.push(orGroup(splitTerms(condition.inUrl).map((term) => `inurl:${term}`)))

  parts.push(orGroup(splitTerms(condition.sites).map((term) => `site:${bareHost(term)}`)))
  parts.push(...splitTerms(condition.excludeSites).map((term) => `-site:${bareHost(term)}`))
  if (condition.fileType.trim()) parts.push(`filetype:${condition.fileType.trim()}`)
  const related = splitTerms(condition.relatedSite)[0]
  if (related) parts.push(`related:${bareHost(related)}`)

  parts.push(numberRange(condition.numberFrom, condition.numberTo))

  const after = isoDate(condition.after)
  if (after) parts.push(`after:${after}`)
  const before = isoDate(condition.before)
  if (before) parts.push(`before:${before}`)

  return parts.filter(Boolean).join(' ')
}

export const buildGoogleSearchUrl = (condition: GoogleSearchCondition) => {
  const query = buildGoogleSearchQuery(condition)
  if (!query) return ''
  const params = new URLSearchParams({ q: query })
  if (condition.language.trim()) params.set('lr', `lang_${condition.language.trim()}`)
  if (condition.timeRange) params.set('tbs', `qdr:${condition.timeRange}`)
  return `https://www.google.com/search?${params.toString()}`
}
