import CryptoJS from 'crypto-js'
import { dump, load } from 'js-yaml'
import { format as formatSql } from 'sql-formatter'
import xmlFormatter from 'xml-formatter'

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char,
  )
const unescapeHtml = (value: string) =>
  value.replace(
    /&(amp|lt|gt|#39|quot);/g,
    (entity) =>
      ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&quot;': '"' })[entity] ?? entity,
  )
const utf8ToBase64 = (value: string) => btoa(unescape(encodeURIComponent(value)))
const base64ToUtf8 = (value: string) => decodeURIComponent(escape(atob(value)))

export const transform = (
  slug: string,
  value: string,
  reverse = false,
  options: Record<string, number> = {},
) => {
  if (!value) return ''
  switch (slug) {
    case 'yaml-json':
      return reverse ? dump(JSON.parse(value)) : JSON.stringify(load(value), null, 2)
    case 'number-base':
      return Number.parseInt(value, options.from ?? 10)
        .toString(options.to ?? 16)
        .toUpperCase()
    case 'date-time': {
      const date = reverse ? new Date(Number(value) * 1000) : new Date(value)
      return reverse ? date.toISOString() : String(Math.floor(date.getTime() / 1000))
    }
    case 'base64':
      return reverse ? base64ToUtf8(value) : utf8ToBase64(value)
    case 'url':
      return reverse ? decodeURIComponent(value) : encodeURIComponent(value)
    case 'html':
      return reverse ? unescapeHtml(value) : escapeHtml(value)
    case 'jwt':
      return JSON.stringify(
        JSON.parse(
          base64ToUtf8(value.split('.')[reverse ? 0 : 1].replace(/-/g, '+').replace(/_/g, '/')),
        ),
        null,
        2,
      )
    case 'json-format':
      return JSON.stringify(JSON.parse(value), null, 2)
    case 'sql-format':
      return formatSql(value, { language: 'sql', tabWidth: 2 })
    case 'xml-format':
      return xmlFormatter(value, { indentation: '  ', collapseContent: true })
    case 'hash':
      return CryptoJS.SHA256(value).toString()
    default:
      return value
  }
}

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?'
export const generate = (slug: string, count = 5, length = 20) => {
  if (slug === 'uuid') return Array.from({ length: count }, () => crypto.randomUUID()).join('\n')
  if (slug === 'password')
    return Array.from({ length: count }, () =>
      Array.from(
        { length },
        () => alphabet[crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length],
      ).join(''),
    ).join('\n')
  return ''
}
