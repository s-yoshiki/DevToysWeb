/**
 * Base conversion on `bigint`, so 64-bit masks and long hex literals survive a
 * round trip that `Number.parseInt` would quietly round away.
 */

export const minBase = 2
export const maxBase = 36

const digits = '0123456789abcdefghijklmnopqrstuvwxyz'

/** Prefixes are accepted only when they agree with the base being parsed. */
const prefixes: Record<string, number> = { '0x': 16, '0o': 8, '0b': 2 }

export const assertBase = (base: number) => {
  if (!Number.isInteger(base) || base < minBase || base > maxBase)
    throw new Error(`Base must be an integer between ${minBase} and ${maxBase}`)
}

/** Strips the separators people paste (spaces, underscores, thousands commas). */
const clean = (value: string) => value.replace(/[\s_,']/g, '')

export const parseInBase = (input: string, base: number): bigint => {
  assertBase(base)
  const trimmed = clean(input).toLowerCase()
  if (!trimmed) throw new Error('Enter a number')

  const negative = trimmed.startsWith('-')
  let body = negative ? trimmed.slice(1) : trimmed.replace(/^\+/, '')

  const prefix = body.slice(0, 2)
  if (prefixes[prefix]) {
    if (prefixes[prefix] !== base)
      throw new Error(`The "${prefix}" prefix does not match base ${base}`)
    body = body.slice(2)
  }
  if (!body) throw new Error('Enter a number')

  const allowed = digits.slice(0, base)
  let result = 0n
  for (const char of body) {
    const index = allowed.indexOf(char)
    if (index < 0) throw new Error(`"${char}" is not a valid digit in base ${base}`)
    result = result * BigInt(base) + BigInt(index)
  }
  return negative ? -result : result
}

export const formatInBase = (value: bigint, base: number) => {
  assertBase(base)
  return value.toString(base).toUpperCase()
}

/** Groups from the right: 4 digits for binary, 3 for decimal, 2 for hex. */
export const groupDigits = (value: string, size: number) => {
  const negative = value.startsWith('-')
  const body = negative ? value.slice(1) : value
  const groups: string[] = []
  for (let end = body.length; end > 0; end -= size)
    groups.unshift(body.slice(Math.max(0, end - size), end))
  return `${negative ? '-' : ''}${groups.join(' ')}`
}

export const bitLength = (value: bigint) => {
  const magnitude = value < 0n ? -value : value
  return magnitude === 0n ? 0 : magnitude.toString(2).length
}

/**
 * Two's complement for the fixed widths people actually reach for. Values that
 * do not fit are reported rather than silently truncated.
 */
export const twosComplement = (value: bigint, bits: number) => {
  const range = 1n << BigInt(bits)
  const min = -(range >> 1n)
  const max = value < 0n ? (range >> 1n) - 1n : range - 1n
  if (value < min || value > max) return null
  return ((value % range) + range) % range
}
