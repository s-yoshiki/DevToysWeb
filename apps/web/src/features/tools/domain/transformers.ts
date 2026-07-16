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

const escapeCsvCell = (value: unknown) => {
  const text =
    value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const jsonToCsv = (value: string) => {
  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed)) throw new Error('JSON input must be an array')
  if (!parsed.length) return ''
  if (parsed.some((row) => !row || typeof row !== 'object' || Array.isArray(row)))
    throw new Error('Each JSON array item must be an object')

  const records = parsed as Record<string, unknown>[]
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))]
  return [
    headers.map(escapeCsvCell).join(','),
    ...records.map((record) => headers.map((header) => escapeCsvCell(record[header])).join(',')),
  ].join('\n')
}

const parseCsvRows = (value: string) => {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (quoted) {
      if (char === '"' && value[index + 1] === '"') {
        cell += '"'
        index += 1
      } else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"' && cell === '') quoted = true
    else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && value[index + 1] === '\n') index += 1
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += char
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field')
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows
}

export const csvToJson = (value: string) => {
  const rows = parseCsvRows(value)
  if (!rows.length) return '[]'
  const [headers, ...records] = rows
  if (headers.some((header) => !header)) throw new Error('CSV headers cannot be empty')
  if (new Set(headers).size !== headers.length) throw new Error('CSV headers must be unique')
  if (records.some((row) => row.length !== headers.length))
    throw new Error('Every CSV row must contain the same number of columns as the header')
  return JSON.stringify(
    records.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]]))),
    null,
    2,
  )
}

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
    case 'json-csv':
      return reverse ? csvToJson(value) : jsonToCsv(value)
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
