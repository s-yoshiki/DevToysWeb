export type EscapeTarget = 'json' | 'javascript' | 'sql' | 'regex' | 'shell' | 'csv'

export const escapeTargets: EscapeTarget[] = ['json', 'javascript', 'sql', 'regex', 'shell', 'csv']

/** Control characters that have no readable single-letter escape. */
const escapeControl = (value: string) =>
  value.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: escaping them is the point
    /[\u0000-\u001f\u007f]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  )

export const escapeString = (value: string, target: EscapeTarget): string => {
  switch (target) {
    case 'json':
      // `stringify` produces a quoted literal; callers want the inner body only.
      return JSON.stringify(value).slice(1, -1)
    case 'javascript':
      return escapeControl(
        value
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/`/g, '\\`')
          .replace(/\$\{/g, '\\${')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t'),
      )
    case 'sql':
      // ANSI SQL escapes a quote by doubling it; backslashes stay literal.
      return value.replace(/'/g, "''")
    case 'regex':
      return value.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&')
    case 'shell':
      // POSIX single quoting: close, insert an escaped quote, reopen.
      return `'${value.replace(/'/g, `'\\''`)}'`
    case 'csv':
      return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
  }
}

const literalEscapes: Record<string, string> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
  v: '\v',
  '0': '\0',
}

const codePointAt = (value: string, start: number, length: number, label: string) => {
  const digits = value.slice(start, start + length)
  const parsed = Number.parseInt(digits, 16)
  if (digits.length < length || Number.isNaN(parsed))
    throw new Error(`Malformed ${label} escape: \\${label === 'hex' ? 'x' : 'u'}${digits}`)
  return parsed
}

/**
 * Walks the literal once instead of round-tripping through `JSON.parse`, which
 * cannot be handed a body that already contains escaped quotes.
 */
const unescapeSourceLiteral = (value: string) => {
  let output = ''
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== '\\') {
      output += value[index]
      continue
    }
    index += 1
    const marker = value[index]
    if (marker === undefined) throw new Error('Input ends with a dangling backslash')
    if (marker === 'u' && value[index + 1] === '{') {
      const end = value.indexOf('}', index)
      if (end === -1) throw new Error('Unterminated \\u{…} escape')
      output += String.fromCodePoint(codePointAt(value, index + 2, end - index - 2, 'unicode'))
      index = end
    } else if (marker === 'u') {
      output += String.fromCharCode(codePointAt(value, index + 1, 4, 'unicode'))
      index += 4
    } else if (marker === 'x') {
      output += String.fromCharCode(codePointAt(value, index + 1, 2, 'hex'))
      index += 2
    } else {
      output += literalEscapes[marker] ?? marker
    }
  }
  return output
}

export const unescapeString = (value: string, target: EscapeTarget): string => {
  switch (target) {
    case 'json':
    case 'javascript':
      return unescapeSourceLiteral(value)
    case 'sql':
      return value.replace(/''/g, "'")
    case 'regex':
      return value.replace(/\\([.*+?^${}()|[\]\\/-])/g, '$1')
    case 'shell': {
      const body = value.replace(/^'|'$/g, '')
      return body.replace(/'\\''/g, "'")
    }
    case 'csv':
      return value.startsWith('"') && value.endsWith('"')
        ? value.slice(1, -1).replace(/""/g, '"')
        : value
  }
}

export type ListOptions = {
  trim: boolean
  dropEmpty: boolean
  unique: boolean
  sort: 'none' | 'asc' | 'desc' | 'length' | 'natural'
  reverse: boolean
  prefix: string
  suffix: string
  separator: string
  numbered: boolean
}

export const defaultListOptions: ListOptions = {
  trim: true,
  dropEmpty: true,
  unique: false,
  sort: 'none',
  reverse: false,
  prefix: '',
  suffix: '',
  separator: '\n',
  numbered: false,
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

export const formatList = (value: string, options: ListOptions) => {
  let lines = value.split(/\r?\n/)
  if (options.trim) lines = lines.map((line) => line.trim())
  if (options.dropEmpty) lines = lines.filter((line) => line.length > 0)
  if (options.unique) lines = [...new Set(lines)]

  if (options.sort === 'asc') lines = [...lines].sort((a, b) => a.localeCompare(b))
  else if (options.sort === 'desc') lines = [...lines].sort((a, b) => b.localeCompare(a))
  else if (options.sort === 'length') lines = [...lines].sort((a, b) => a.length - b.length)
  else if (options.sort === 'natural') lines = [...lines].sort((a, b) => collator.compare(a, b))

  if (options.reverse) lines = [...lines].reverse()

  const width = String(lines.length).length
  return lines
    .map((line, index) => {
      const numbered = options.numbered
        ? `${String(index + 1).padStart(width, ' ')}. ${line}`
        : line
      return `${options.prefix}${numbered}${options.suffix}`
    })
    .join(options.separator)
}
