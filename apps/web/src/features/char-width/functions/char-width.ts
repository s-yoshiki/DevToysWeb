export type WidthDirection = 'toFullWidth' | 'toHalfWidth'
export type WidthTarget = 'alphanumeric' | 'symbol' | 'katakana' | 'space'
export type KanaConversion = 'none' | 'toKatakana' | 'toHiragana'

export type CharWidthOptions = {
  direction: WidthDirection
  targets: Record<WidthTarget, boolean>
  kana: KanaConversion
}

export const widthTargets: readonly WidthTarget[] = ['alphanumeric', 'symbol', 'katakana', 'space']

export const defaultCharWidthOptions: CharWidthOptions = {
  direction: 'toHalfWidth',
  targets: { alphanumeric: true, symbol: true, katakana: true, space: true },
  kana: 'none',
}

/** ASCII U+0021–U+007E and their full-width twins U+FF01–U+FF5E sit this far apart. */
const WIDTH_OFFSET = 0xfee0
const ASCII_START = 0x21
const ASCII_END = 0x7e
const IDEOGRAPHIC_SPACE = '　'

/** Katakana that map one-to-one; voiced forms are handled separately below. */
const HALF_KANA = '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ'
const FULL_KANA =
  '。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜'

/** Half-width bases that combine with U+FF9E (ﾞ) or U+FF9F (ﾟ) into one character. */
const VOICED_BASE = 'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎｳｦﾜ'
const VOICED_FULL = 'ガギグゲゴザジズゼゾダヂヅデドバビブベボヴヺヷ'
const SEMI_VOICED_BASE = 'ﾊﾋﾌﾍﾎ'
const SEMI_VOICED_FULL = 'パピプペポ'

const VOICED_MARK = 'ﾞ'
const SEMI_VOICED_MARK = 'ﾟ'

const pairs = (from: string, to: string) =>
  new Map(Array.from(from, (character, index) => [character, to[index]] as const))

const halfToFullKana = pairs(HALF_KANA, FULL_KANA)
const fullToHalfKana = pairs(FULL_KANA, HALF_KANA)
const voicedToFull = pairs(VOICED_BASE, VOICED_FULL)
const semiVoicedToFull = pairs(SEMI_VOICED_BASE, SEMI_VOICED_FULL)
const fullToVoiced = pairs(VOICED_FULL, VOICED_BASE)
const fullToSemiVoiced = pairs(SEMI_VOICED_FULL, SEMI_VOICED_BASE)

const HIRAGANA_START = 0x3041
const HIRAGANA_END = 0x3096
const KANA_OFFSET = 0x60

const isAsciiAlphanumeric = (code: number) =>
  (code >= 0x30 && code <= 0x39) || (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)

/** True when the ASCII code point belongs to a class the caller asked to convert. */
const wantsAscii = (code: number, targets: Record<WidthTarget, boolean>) =>
  isAsciiAlphanumeric(code) ? targets.alphanumeric : targets.symbol

const asciiToFullWidth = (value: string, targets: Record<WidthTarget, boolean>) =>
  Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0
    if (code < ASCII_START || code > ASCII_END) return character
    return wantsAscii(code, targets) ? String.fromCodePoint(code + WIDTH_OFFSET) : character
  }).join('')

const asciiToHalfWidth = (value: string, targets: Record<WidthTarget, boolean>) =>
  Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0
    const base = code - WIDTH_OFFSET
    if (base < ASCII_START || base > ASCII_END) return character
    return wantsAscii(base, targets) ? String.fromCodePoint(base) : character
  }).join('')

/**
 * Half-width katakana carry their voiced mark as a separate character, so the
 * mark has to be consumed together with the base it follows.
 */
const katakanaToFullWidth = (value: string) => {
  const characters = Array.from(value)
  const output: string[] = []
  for (let index = 0; index < characters.length; index += 1) {
    const current = characters[index]
    const next = characters[index + 1]
    if (next === VOICED_MARK) {
      const voiced = voicedToFull.get(current)
      if (voiced) {
        output.push(voiced)
        index += 1
        continue
      }
    }
    if (next === SEMI_VOICED_MARK) {
      const semiVoiced = semiVoicedToFull.get(current)
      if (semiVoiced) {
        output.push(semiVoiced)
        index += 1
        continue
      }
    }
    output.push(halfToFullKana.get(current) ?? current)
  }
  return output.join('')
}

const katakanaToHalfWidth = (value: string) =>
  Array.from(value, (character) => {
    const voiced = fullToVoiced.get(character)
    if (voiced) return `${voiced}${VOICED_MARK}`
    const semiVoiced = fullToSemiVoiced.get(character)
    if (semiVoiced) return `${semiVoiced}${SEMI_VOICED_MARK}`
    return fullToHalfKana.get(character) ?? character
  }).join('')

export const hiraganaToKatakana = (value: string) =>
  Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0
    return code >= HIRAGANA_START && code <= HIRAGANA_END
      ? String.fromCodePoint(code + KANA_OFFSET)
      : character
  }).join('')

export const katakanaToHiragana = (value: string) =>
  Array.from(value, (character) => {
    const code = (character.codePointAt(0) ?? 0) - KANA_OFFSET
    return code >= HIRAGANA_START && code <= HIRAGANA_END ? String.fromCodePoint(code) : character
  }).join('')

export const convertCharWidth = (value: string, options: CharWidthOptions) => {
  const { direction, targets } = options
  let result = value

  if (direction === 'toFullWidth') {
    if (targets.katakana) result = katakanaToFullWidth(result)
    result = asciiToFullWidth(result, targets)
    if (targets.space) result = result.replaceAll(' ', IDEOGRAPHIC_SPACE)
  } else {
    if (targets.katakana) result = katakanaToHalfWidth(result)
    result = asciiToHalfWidth(result, targets)
    if (targets.space) result = result.replaceAll(IDEOGRAPHIC_SPACE, ' ')
  }

  if (options.kana === 'toKatakana') result = hiraganaToKatakana(result)
  if (options.kana === 'toHiragana') result = katakanaToHiragana(result)
  return result
}

export type CharWidthStats = {
  inputLength: number
  outputLength: number
  changed: number
}

/**
 * Counts differing positions up to the shared prefix length plus whatever the
 * longer side adds, which is enough to tell "nothing matched" from "converted".
 */
export const summarizeCharWidth = (input: string, output: string): CharWidthStats => {
  const source = Array.from(input)
  const result = Array.from(output)
  const shared = Math.min(source.length, result.length)
  let changed = Math.abs(source.length - result.length)
  for (let index = 0; index < shared; index += 1) {
    if (source[index] !== result[index]) changed += 1
  }
  return { inputLength: source.length, outputLength: result.length, changed }
}
