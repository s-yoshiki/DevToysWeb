/**
 * Building blocks shared by the search-query builders. Every helper returns an
 * empty string for empty input so callers can filter the assembled parts once.
 */

/** Splits a free-form field on whitespace and commas, the delimiters search forms accept. */
export const splitTerms = (value: string) =>
  value
    .split(/[\s,]+/)
    .map((term) => term.trim())
    .filter(Boolean)

/** Joins alternatives with OR, adding parentheses only when they are needed. */
export const orGroup = (terms: string[]) =>
  terms.length > 1 ? `(${terms.join(' OR ')})` : (terms[0] ?? '')

/** Quotes a phrase, dropping inner quotes that would end it early. */
export const quotePhrase = (value: string) => {
  const phrase = value.trim().replace(/"/g, '')
  return phrase ? `"${phrase}"` : ''
}

/** Prefixes a term with `-`, tolerating a `-` the user typed themselves. */
export const negate = (term: string) => `-${term.replace(/^-+/, '')}`

export const naturalNumber = (value: string) => {
  const digits = value.trim()
  return /^[1-9]\d*$/.test(digits) ? digits : ''
}

export const integer = (value: string) => {
  const digits = value.trim()
  return /^-?\d+$/.test(digits) ? digits : ''
}

export const isoDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : ''
