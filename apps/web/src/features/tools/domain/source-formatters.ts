const indentWith = (depth: number, indent: string) => indent.repeat(Math.max(0, depth))

/**
 * A structural CSS formatter: it re-indents blocks and puts one declaration per
 * line without trying to normalise values, so authored intent survives.
 * Strings and comments are copied through untouched.
 */
export const formatCss = (source: string, indent = '  ') => {
  const lines: string[] = []
  let buffer = ''
  let depth = 0

  const flush = (suffix = '') => {
    const body = buffer.trim()
    buffer = ''
    if (!body) return
    // Only a declaration gets the `property: value` spacing; the first colon is
    // the separator, so `background:url(data:…)` still splits correctly.
    const text = suffix === ';' ? body.replace(/^([^:]+):\s*([\s\S]+)$/, '$1: $2') : body
    lines.push(indentWith(depth, indent) + text + suffix)
  }

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]

    if (char === '"' || char === "'") {
      const quote = char
      buffer += char
      index += 1
      while (index < source.length) {
        buffer += source[index]
        if (source[index] === '\\') {
          buffer += source[index + 1] ?? ''
          index += 2
          continue
        }
        if (source[index] === quote) break
        index += 1
      }
      continue
    }

    if (char === '/' && source[index + 1] === '*') {
      const end = source.indexOf('*/', index + 2)
      const stop = end === -1 ? source.length : end + 2
      buffer += source.slice(index, stop)
      flush()
      index = stop - 1
      continue
    }

    if (char === '{') {
      flush(' {')
      depth += 1
      continue
    }

    if (char === '}') {
      flush(';')
      depth -= 1
      lines.push(`${indentWith(depth, indent)}}`)
      continue
    }

    if (char === ';') {
      flush(';')
      continue
    }

    if (char === '\n' || char === '\r') {
      if (buffer.trim()) buffer += ' '
      continue
    }

    buffer += char
  }

  flush()
  return lines
    .join('\n')
    .replace(/;{2,}/g, ';')
    .replace(/\n{3,}/g, '\n\n')
}

/** Elements that never have a closing tag, so they must not open an indent level. */
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/** Their content is not markup, so it is emitted verbatim. */
const rawTextElements = new Set(['script', 'style', 'pre', 'textarea'])

type HtmlToken = { kind: 'tag' | 'text' | 'raw'; value: string; name?: string; closing?: boolean }

const tokenizeHtml = (source: string): HtmlToken[] => {
  const tokens: HtmlToken[] = []
  let index = 0

  while (index < source.length) {
    const next = source.indexOf('<', index)
    if (next === -1) {
      const text = source.slice(index)
      if (text.trim()) tokens.push({ kind: 'text', value: text.trim() })
      break
    }
    if (next > index) {
      const text = source.slice(index, next)
      if (text.trim()) tokens.push({ kind: 'text', value: text.trim() })
    }

    // Comments and doctype/CDATA are opaque: copy them through as one token.
    if (source.startsWith('<!--', next)) {
      const end = source.indexOf('-->', next)
      const stop = end === -1 ? source.length : end + 3
      tokens.push({ kind: 'text', value: source.slice(next, stop) })
      index = stop
      continue
    }

    const end = source.indexOf('>', next)
    if (end === -1) {
      tokens.push({ kind: 'text', value: source.slice(next) })
      break
    }

    const value = source.slice(next, end + 1)
    const nameMatch = value.match(/^<\/?\s*([a-zA-Z0-9:-]+)/)
    const name = nameMatch?.[1]?.toLowerCase()
    const closing = value.startsWith('</')
    tokens.push({ kind: 'tag', value, name, closing })
    index = end + 1

    if (name && !closing && rawTextElements.has(name) && !value.endsWith('/>')) {
      const closeAt = source.toLowerCase().indexOf(`</${name}`, index)
      const stop = closeAt === -1 ? source.length : closeAt
      const raw = source.slice(index, stop)
      if (raw.trim()) tokens.push({ kind: 'raw', value: raw.replace(/^\s*\n|\s+$/g, '') })
      index = stop
    }
  }

  return tokens
}

/**
 * Re-indents HTML one node per line. Attributes and raw-text blocks are left
 * exactly as authored — this is a formatter, not a minifier or a rewriter.
 */
export const formatHtml = (source: string, indent = '  ') => {
  const lines: string[] = []
  let depth = 0

  for (const token of tokenizeHtml(source)) {
    if (token.kind === 'raw') {
      for (const line of token.value.split('\n'))
        lines.push(indentWith(depth, indent) + line.trim())
      continue
    }

    if (token.kind === 'text') {
      lines.push(indentWith(depth, indent) + token.value.replace(/\s+/g, ' '))
      continue
    }

    if (token.closing) {
      depth -= 1
      lines.push(indentWith(depth, indent) + token.value)
      continue
    }

    lines.push(indentWith(depth, indent) + token.value)
    const selfClosing = token.value.endsWith('/>') || (token.name && voidElements.has(token.name))
    const declaration = token.value.startsWith('<!') || token.value.startsWith('<?')
    if (!selfClosing && !declaration) depth += 1
  }

  return lines.join('\n')
}

/**
 * Strips the parts of an SVG that never affect rendering — editor metadata,
 * comments, the XML prolog and redundant whitespace.
 */
export const optimizeSvg = (source: string) => {
  const cleaned = source
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(metadata|title|desc)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\s+(sodipodi|inkscape|sketch):[a-zA-Z-]+="[^"]*"/g, '')
    .replace(/\s+xmlns:(sodipodi|inkscape|sketch)="[^"]*"/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (!cleaned.includes('<svg')) throw new Error('Input does not contain an <svg> element')
  return cleaned
}

/** Percent-encodes an SVG for use in `url()` without the Base64 size penalty. */
export const svgToDataUri = (source: string) =>
  `data:image/svg+xml,${encodeURIComponent(source)
    .replace(/%20/g, ' ')
    .replace(/%3D/g, '=')
    .replace(/%3A/g, ':')
    .replace(/%2F/g, '/')
    // Attribute quotes become `'` so the whole URI can sit inside `url("…")`.
    .replace(/'/g, '%27')
    .replace(/%22/g, "'")}`
