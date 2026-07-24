/**
 * Best-effort mojibake restoration that runs entirely on the browser's
 * TextDecoder. It covers the common case where bytes in some encoding were
 * decoded through a single-byte (Latin-1 / Windows-1252) pipeline, e.g. UTF-8,
 * Shift_JIS or EUC-JP text that arrived as garbled characters. It re-derives the
 * original bytes, then decodes them under several candidate encodings and ranks
 * the results by how much readable text each produces.
 */

export type MojibakeCandidate = {
  encoding: string
  label: string
  text: string
  score: number
}

// Windows-1252 printable characters in the 0x80–0x9F range, mapped back to their
// source byte so we can reverse a cp1252 decode losslessly.
const CP1252_REVERSE: Record<number, number> = {
  8364: 0x80,
  8218: 0x82,
  402: 0x83,
  8222: 0x84,
  8230: 0x85,
  8224: 0x86,
  8225: 0x87,
  710: 0x88,
  8240: 0x89,
  352: 0x8a,
  8249: 0x8b,
  338: 0x8c,
  381: 0x8e,
  8216: 0x91,
  8217: 0x92,
  8220: 0x93,
  8221: 0x94,
  8226: 0x95,
  8211: 0x96,
  8212: 0x97,
  732: 0x98,
  8482: 0x99,
  353: 0x9a,
  8250: 0x9b,
  339: 0x9c,
  382: 0x9e,
  376: 0x9f,
}

const CANDIDATES: { encoding: string; label: string }[] = [
  { encoding: 'utf-8', label: 'UTF-8' },
  { encoding: 'shift_jis', label: 'Shift_JIS (CP932)' },
  { encoding: 'euc-jp', label: 'EUC-JP' },
  { encoding: 'iso-2022-jp', label: 'ISO-2022-JP' },
  { encoding: 'gbk', label: 'GBK (簡体字)' },
  { encoding: 'big5', label: 'Big5 (繁体字)' },
  { encoding: 'euc-kr', label: 'EUC-KR (한글)' },
  { encoding: 'windows-1251', label: 'Windows-1251 (Cyrillic)' },
]

/** Map a mojibake string back to the byte sequence it most likely came from. */
const toSourceBytes = (input: string): Uint8Array | null => {
  const bytes: number[] = []
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0
    if (code <= 0xff) {
      bytes.push(code)
    } else if (CP1252_REVERSE[code] !== undefined) {
      bytes.push(CP1252_REVERSE[code])
    } else {
      // A character outside the single-byte range means this isn't the kind of
      // mojibake we can reverse by re-reading bytes.
      return null
    }
  }
  return new Uint8Array(bytes)
}

/**
 * Higher is better. The weights matter because any lenient multi-byte legacy
 * encoding (GBK, Shift_JIS, …) will happily turn arbitrary bytes into a wall of
 * CJK ideographs, so raw ideograph count is a poor signal. We reward the strong
 * "real Japanese" markers (kana) and penalise the classic garbage artifacts
 * (half-width katakana, stray controls, replacement characters).
 */
const scoreText = (text: string): number => {
  if (!text) return -Infinity
  let score = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    if (code === 0xfffd)
      score -= 20 // replacement character — decode failed here
    else if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) score -= 12
    else if (code >= 0x80 && code <= 0x9f)
      score -= 10 // stray C1 controls
    else if (code >= 0x3040 && code <= 0x309f)
      score += 5 // hiragana — strong signal
    else if (code >= 0x30a0 && code <= 0x30ff)
      score += 4 // full-width katakana
    else if (code >= 0xff61 && code <= 0xff9f)
      score -= 3 // half-width katakana — artifact
    else if (code >= 0xff01 && code <= 0xff60)
      score -= 1 // full-width ASCII forms — often artifact
    else if (code >= 0x4e00 && code <= 0x9fff)
      score += 1 // CJK ideographs — weak signal
    else if (code >= 0x3400 && code <= 0x4dbf)
      score -= 1 // rare CJK ext A — likely garbage
    else if (code >= 0xac00 && code <= 0xd7a3)
      score += 2 // hangul
    else if (code >= 0x20 && code <= 0x7e)
      score += 1 // printable ASCII
    else if (code === 0x0a || code === 0x0d || code === 0x09) score += 0
    else if (code >= 0xa0 && code <= 0x24f)
      score += 1 // Latin-1 / Latin extended
    else score -= 2
  }
  return score
}

/** True when the byte sequence is well-formed UTF-8 (a near-certain restore). */
const isValidUtf8 = (bytes: Uint8Array): boolean => {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return true
  } catch {
    return false
  }
}

const decode = (bytes: Uint8Array, encoding: string): string | null => {
  try {
    return new TextDecoder(encoding, { fatal: false }).decode(bytes)
  } catch {
    return null
  }
}

// A clean UTF-8 decode of the recovered bytes is overwhelmingly likely to be the
// real answer, so it should out-rank any lenient legacy-encoding guess.
const UTF8_VALID_BONUS = 1_000_000

/**
 * Iteratively undo repeated UTF-8-through-Latin1 encoding (e.g. "Ã‚Â£" → "£").
 * We only peel a layer while its recovered bytes are themselves well-formed
 * UTF-8, which stops exactly at the original text: genuine Latin text such as
 * "café" re-encodes to invalid UTF-8, so it is never over-corrected.
 */
const restoreUtf8Chain = (input: string): { text: string; valid: boolean } => {
  let current = input
  let valid = false
  for (let i = 0; i < 4; i++) {
    const bytes = toSourceBytes(current)
    if (!bytes || !isValidUtf8(bytes)) break
    const decoded = decode(bytes, 'utf-8')
    if (decoded === null || decoded === current) break
    current = decoded
    valid = true
  }
  return { text: current, valid }
}

/** Rank restoration candidates for the given (assumed garbled) text. */
export const analyzeMojibake = (input: string): MojibakeCandidate[] => {
  if (!input) return []
  const bytes = toSourceBytes(input)
  const baseline = scoreText(input)
  const seen = new Map<string, MojibakeCandidate>()

  const consider = (encoding: string, label: string, text: string | null, bonus = 0) => {
    if (text === null || text === '' || text === input) return
    const score = scoreText(text) + bonus
    const existing = seen.get(text)
    if (!existing || score > existing.score) seen.set(text, { encoding, label, text, score })
  }

  let singlePassUtf8: string | null = null
  if (bytes) {
    const utf8Valid = isValidUtf8(bytes)
    for (const { encoding, label } of CANDIDATES) {
      const decoded = decode(bytes, encoding)
      if (encoding === 'utf-8') singlePassUtf8 = decoded
      consider(encoding, label, decoded, encoding === 'utf-8' && utf8Valid ? UTF8_VALID_BONUS : 0)
    }
  }

  // The chain fully unwinds repeated encodings; only surface it when it peeled
  // further than the single pass, so it can outrank that partial result.
  const chained = restoreUtf8Chain(input)
  if (chained.text !== input && chained.text !== singlePassUtf8) {
    consider(
      'utf-8',
      'UTF-8 (multi-pass)',
      chained.text,
      chained.valid ? UTF8_VALID_BONUS + 1000 : 0,
    )
  }

  return Array.from(seen.values())
    .filter((candidate) => candidate.score > baseline)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
}
