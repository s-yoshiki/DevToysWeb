export type FancyStyleId =
  | 'bold'
  | 'italic'
  | 'boldItalic'
  | 'script'
  | 'boldScript'
  | 'fraktur'
  | 'doubleStruck'
  | 'sansSerif'
  | 'monospace'
  | 'fullWidth'
  | 'circled'
  | 'squared'
  | 'smallCaps'
  | 'superscript'
  | 'upsideDown'
  | 'strikethrough'
  | 'underline'
  | 'reversed'

export type FancyStyle = {
  id: FancyStyleId
  name: { ja: string; en: string }
  transform: (value: string) => string
}

/** Latin letters and digits are the only ranges these Unicode blocks cover. */
type AlphabetRange = {
  upper?: number
  lower?: number
  digit?: number
  /** Code points the block reserves because the glyph lives in Letterlike Symbols. */
  exceptions?: Record<string, string>
}

const UPPER_A = 0x41
const UPPER_Z = 0x5a
const LOWER_A = 0x61
const LOWER_Z = 0x7a
const DIGIT_0 = 0x30
const DIGIT_9 = 0x39

const mapAlphabet = (value: string, range: AlphabetRange) =>
  Array.from(value, (character) => {
    const replacement = range.exceptions?.[character]
    if (replacement) return replacement
    const code = character.codePointAt(0) ?? 0
    if (range.upper !== undefined && code >= UPPER_A && code <= UPPER_Z)
      return String.fromCodePoint(range.upper + code - UPPER_A)
    if (range.lower !== undefined && code >= LOWER_A && code <= LOWER_Z)
      return String.fromCodePoint(range.lower + code - LOWER_A)
    if (range.digit !== undefined && code >= DIGIT_0 && code <= DIGIT_9)
      return String.fromCodePoint(range.digit + code - DIGIT_0)
    return character
  }).join('')

const pairTable = (from: string, to: string): Record<string, string> => {
  const targets = Array.from(to)
  return Object.fromEntries(Array.from(from, (character, index) => [character, targets[index]]))
}

const ASCII_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ASCII_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const ASCII_DIGITS = '0123456789'

const mapTable = (value: string, table: Record<string, string>) =>
  Array.from(value, (character) => table[character] ?? character).join('')

const combine = (value: string, mark: string) =>
  Array.from(value, (character) => `${character}${mark}`).join('')

const SCRIPT_EXCEPTIONS: Record<string, string> = {
  B: 'ℬ',
  E: 'ℰ',
  F: 'ℱ',
  H: 'ℋ',
  I: 'ℐ',
  L: 'ℒ',
  M: 'ℳ',
  R: 'ℛ',
  e: 'ℯ',
  g: 'ℊ',
  o: 'ℴ',
}

const FRAKTUR_EXCEPTIONS: Record<string, string> = {
  C: 'ℭ',
  H: 'ℌ',
  I: 'ℑ',
  R: 'ℜ',
  Z: 'ℨ',
}

const DOUBLE_STRUCK_EXCEPTIONS: Record<string, string> = {
  C: 'ℂ',
  H: 'ℍ',
  N: 'ℕ',
  P: 'ℙ',
  Q: 'ℚ',
  R: 'ℝ',
  Z: 'ℤ',
}

const SMALL_CAPS = pairTable(ASCII_LOWER, 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ')

const SUPERSCRIPT = {
  ...pairTable(ASCII_LOWER, 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ'),
  ...pairTable(ASCII_DIGITS, '⁰¹²³⁴⁵⁶⁷⁸⁹'),
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
}

const UPSIDE_DOWN = {
  ...pairTable(ASCII_LOWER, 'ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz'),
  ...pairTable(ASCII_UPPER, '∀ᗺƆᗡƎℲ⅁HIſʞ˥WNOԀÒᴚS⊥∩ΛMX⅄Z'),
  ...pairTable(ASCII_DIGITS, '0ƖᄅƐㄣϛ9ㄥ86'),
  '.': '˙',
  ',': '‚',
  '?': '¿',
  '!': '¡',
  '&': '⅋',
  _: '‾',
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '<': '>',
  '>': '<',
}

const STRIKETHROUGH_MARK = '̶'
const UNDERLINE_MARK = '̲'

export const fancyStyles: readonly FancyStyle[] = [
  {
    id: 'bold',
    name: { ja: '太字', en: 'Bold' },
    transform: (value) => mapAlphabet(value, { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce }),
  },
  {
    id: 'italic',
    name: { ja: '斜体', en: 'Italic' },
    transform: (value) =>
      mapAlphabet(value, { upper: 0x1d434, lower: 0x1d44e, exceptions: { h: 'ℎ' } }),
  },
  {
    id: 'boldItalic',
    name: { ja: '太字斜体', en: 'Bold italic' },
    transform: (value) => mapAlphabet(value, { upper: 0x1d468, lower: 0x1d482 }),
  },
  {
    id: 'script',
    name: { ja: '筆記体', en: 'Script' },
    transform: (value) =>
      mapAlphabet(value, { upper: 0x1d49c, lower: 0x1d4b6, exceptions: SCRIPT_EXCEPTIONS }),
  },
  {
    id: 'boldScript',
    name: { ja: '太字筆記体', en: 'Bold script' },
    transform: (value) => mapAlphabet(value, { upper: 0x1d4d0, lower: 0x1d4ea }),
  },
  {
    id: 'fraktur',
    name: { ja: 'フラクトゥール', en: 'Fraktur' },
    transform: (value) =>
      mapAlphabet(value, { upper: 0x1d504, lower: 0x1d51e, exceptions: FRAKTUR_EXCEPTIONS }),
  },
  {
    id: 'doubleStruck',
    name: { ja: '二重線', en: 'Double-struck' },
    transform: (value) =>
      mapAlphabet(value, {
        upper: 0x1d538,
        lower: 0x1d552,
        digit: 0x1d7d8,
        exceptions: DOUBLE_STRUCK_EXCEPTIONS,
      }),
  },
  {
    id: 'sansSerif',
    name: { ja: 'サンセリフ', en: 'Sans-serif' },
    transform: (value) => mapAlphabet(value, { upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 }),
  },
  {
    id: 'monospace',
    name: { ja: '等幅', en: 'Monospace' },
    transform: (value) => mapAlphabet(value, { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 }),
  },
  {
    id: 'fullWidth',
    name: { ja: '全角', en: 'Full width' },
    transform: (value) => mapAlphabet(value, { upper: 0xff21, lower: 0xff41, digit: 0xff10 }),
  },
  {
    id: 'circled',
    name: { ja: '丸囲み', en: 'Circled' },
    // U+2460 starts at 1, so zero has to come from the separate U+24EA.
    transform: (value) =>
      mapAlphabet(value, { upper: 0x24b6, lower: 0x24d0, digit: 0x245f, exceptions: { '0': '⓪' } }),
  },
  {
    id: 'squared',
    name: { ja: '四角囲み', en: 'Squared' },
    // The block only has capitals, so lower case is folded up first.
    transform: (value) => mapAlphabet(value.toUpperCase(), { upper: 0x1f130 }),
  },
  {
    id: 'smallCaps',
    name: { ja: 'スモールキャピタル', en: 'Small caps' },
    transform: (value) => mapTable(value.toLowerCase(), SMALL_CAPS),
  },
  {
    id: 'superscript',
    name: { ja: '上付き', en: 'Superscript' },
    transform: (value) => mapTable(value, SUPERSCRIPT),
  },
  {
    id: 'upsideDown',
    name: { ja: '逆さま', en: 'Upside down' },
    transform: (value) => Array.from(mapTable(value, UPSIDE_DOWN)).reverse().join(''),
  },
  {
    id: 'strikethrough',
    name: { ja: '取り消し線', en: 'Strikethrough' },
    transform: (value) => combine(value, STRIKETHROUGH_MARK),
  },
  {
    id: 'underline',
    name: { ja: '下線', en: 'Underline' },
    transform: (value) => combine(value, UNDERLINE_MARK),
  },
  {
    id: 'reversed',
    name: { ja: '逆順', en: 'Reversed' },
    transform: (value) => Array.from(value).reverse().join(''),
  },
]

export const applyFancyStyle = (value: string, id: FancyStyleId) =>
  fancyStyles.find((style) => style.id === id)?.transform(value) ?? value

export type FancyResult = { id: FancyStyleId; name: { ja: string; en: string }; output: string }

export const renderFancyStyles = (value: string): FancyResult[] =>
  fancyStyles.map((style) => ({ id: style.id, name: style.name, output: style.transform(value) }))
