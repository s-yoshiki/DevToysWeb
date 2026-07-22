export type GlobOptions = {
  /** When false, a leading dot must be matched literally, as most shells do. */
  dot: boolean
  caseSensitive: boolean
}

export const defaultGlobOptions: GlobOptions = { dot: false, caseSensitive: true }

const escapeLiteral = (char: string) => char.replace(/[.+^${}()|[\]\\]/g, '\\$&')

/**
 * Translates the shell glob subset developers actually type — `*`, `**`, `?`,
 * `[…]` classes and `{a,b}` alternation — into an anchored regular expression.
 * Paths are matched with `/` as the only separator.
 */
export const globToRegExp = (pattern: string, options: GlobOptions = defaultGlobOptions) => {
  let source = ''
  let braceDepth = 0
  // A wildcard must not swallow a leading dot, but a literal `.` in the pattern
  // may match one — so the guard is emitted per wildcard, at segment starts only.
  let atSegmentStart: boolean = true
  const noDot = options.dot ? '' : '(?!\\.)'

  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index]
    const segmentStart: boolean = atSegmentStart
    atSegmentStart = char === '/'

    if (char === '\\') {
      const next = pattern[index + 1]
      if (next === undefined) throw new Error('Pattern ends with a dangling backslash')
      source += escapeLiteral(next)
      index += 1
      continue
    }

    if (char === '*') {
      const guard = segmentStart ? noDot : ''
      if (pattern[index + 1] === '*') {
        index += 1
        if (pattern[index + 1] === '/') {
          index += 1
          // `a/**/b` must also match `a/b`, so the whole group is optional.
          source += `(?:${guard}[^/]*\\/)*`
          atSegmentStart = true
        } else {
          source += `${guard}[^/]*(?:\\/${noDot}[^/]*)*`
        }
      } else {
        source += `${guard}[^/]*`
      }
      continue
    }

    if (char === '?') {
      source += `${segmentStart ? noDot : ''}[^/]`
      continue
    }

    if (char === '[') {
      const end = pattern.indexOf(']', index + 1)
      if (end === -1) throw new Error('Unterminated character class: missing "]"')
      const body = pattern.slice(index + 1, end)
      const negated = body.startsWith('!') || body.startsWith('^')
      source += `[${negated ? '^' : ''}${body.slice(negated ? 1 : 0).replace(/\\/g, '\\\\')}]`
      index = end
      continue
    }

    if (char === '{') {
      braceDepth += 1
      source += '(?:'
      // Each alternative starts where the brace did.
      atSegmentStart = segmentStart
      continue
    }

    if (char === '}' && braceDepth > 0) {
      braceDepth -= 1
      source += ')'
      continue
    }

    if (char === ',' && braceDepth > 0) {
      source += '|'
      atSegmentStart = segmentStart
      continue
    }

    source += escapeLiteral(char)
  }

  if (braceDepth > 0) throw new Error('Unterminated alternation: missing "}"')

  return new RegExp(`^${source}$`, options.caseSensitive ? '' : 'i')
}

export type GlobMatch = { path: string; matched: boolean }

export const matchPaths = (
  pattern: string,
  paths: string[],
  options: GlobOptions = defaultGlobOptions,
): GlobMatch[] => {
  const expression = globToRegExp(pattern, options)
  return paths.map((path) => ({ path, matched: expression.test(path) }))
}
