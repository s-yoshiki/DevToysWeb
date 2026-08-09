export type InvisibleCategory = 'whitespace' | 'format' | 'blank'

export type InvisibleCharacter = {
  character: string
  codePoint: number
  unicode: string
  javascript: string
  marker: string
  category: InvisibleCategory
  name: { ja: string; en: string }
  description: { ja: string; en: string }
}

export type InvisibleOccurrence = InvisibleCharacter & {
  index: number
  line: number
  column: number
}

const createCharacter = (
  codePoint: number,
  category: InvisibleCategory,
  marker: string,
  ja: string,
  en: string,
  descriptionJa: string,
  descriptionEn: string,
): InvisibleCharacter => {
  const character = String.fromCodePoint(codePoint)
  const hex = codePoint.toString(16).toUpperCase().padStart(4, '0')
  const javascript = codePoint <= 0xffff ? `\\u${hex}` : `\\u{${codePoint.toString(16)}}`
  return {
    character,
    codePoint,
    unicode: `U+${hex}`,
    javascript,
    marker,
    category,
    name: { ja, en },
    description: { ja: descriptionJa, en: descriptionEn },
  }
}

const whitespace = (
  codePoint: number,
  marker: string,
  ja: string,
  en: string,
  descriptionJa: string,
  descriptionEn: string,
) => createCharacter(codePoint, 'whitespace', marker, ja, en, descriptionJa, descriptionEn)

const format = (
  codePoint: number,
  marker: string,
  ja: string,
  en: string,
  descriptionJa: string,
  descriptionEn: string,
) => createCharacter(codePoint, 'format', marker, ja, en, descriptionJa, descriptionEn)

const blank = (
  codePoint: number,
  marker: string,
  ja: string,
  en: string,
  descriptionJa: string,
  descriptionEn: string,
) => createCharacter(codePoint, 'blank', marker, ja, en, descriptionJa, descriptionEn)

/**
 * Unicode 17.0's White_Space characters plus commonly confusing invisible
 * format controls and characters that render like a blank glyph.
 */
export const invisibleCharacters: readonly InvisibleCharacter[] = [
  whitespace(0x0009, '⇥', '文字の水平タブ', 'CHARACTER TABULATION', '水平タブ', 'horizontal tab'),
  whitespace(0x000a, '↵', '改行', 'LINE FEED', '改行（LF）', 'line feed'),
  whitespace(0x000b, '↕', '垂直タブ', 'LINE TABULATION', '垂直タブ', 'vertical tab'),
  whitespace(0x000c, '␌', '改ページ', 'FORM FEED', '改ページ', 'form feed'),
  whitespace(0x000d, '↩', '復帰', 'CARRIAGE RETURN', '復帰（CR）', 'carriage return'),
  whitespace(0x0020, '·', '半角スペース', 'SPACE', '通常のスペース', 'ordinary space'),
  whitespace(0x0085, '↵', '次行制御', 'NEXT LINE', '次行制御', 'next line control'),
  whitespace(
    0x00a0,
    '⍽',
    'ノーブレークスペース',
    'NO-BREAK SPACE',
    '改行を禁止するスペース（NBSP）',
    'non-breaking space',
  ),
  whitespace(
    0x1680,
    '␠',
    'オガムスペース',
    'OGHAM SPACE MARK',
    'オガム文字用のスペース',
    'Ogham script spacing',
  ),
  whitespace(0x2000, '␠', 'EN幅スペース', 'EN QUAD', '1en幅', 'en quad'),
  whitespace(0x2001, '␠', 'EM幅スペース', 'EM QUAD', '1em幅', 'em quad'),
  whitespace(0x2002, '␠', 'ENスペース', 'EN SPACE', 'enスペース', 'en space'),
  whitespace(0x2003, '␠', 'EMスペース', 'EM SPACE', 'emスペース', 'em space'),
  whitespace(
    0x2004,
    '␠',
    '3分の1EMスペース',
    'THREE-PER-EM SPACE',
    '1/3em幅',
    'one-third em space',
  ),
  whitespace(
    0x2005,
    '␠',
    '4分の1EMスペース',
    'FOUR-PER-EM SPACE',
    '1/4em幅',
    'one-fourth em space',
  ),
  whitespace(0x2006, '␠', '6分の1EMスペース', 'SIX-PER-EM SPACE', '1/6em幅', 'one-sixth em space'),
  whitespace(
    0x2007,
    '␠',
    '数字幅スペース',
    'FIGURE SPACE',
    '数字と同じ固定幅',
    'fixed digit width',
  ),
  whitespace(
    0x2008,
    '␠',
    '句読点スペース',
    'PUNCTUATION SPACE',
    '句読点と同程度の幅',
    'punctuation width',
  ),
  whitespace(0x2009, '␠', '細いスペース', 'THIN SPACE', '細いスペース', 'thin space'),
  whitespace(
    0x200a,
    '␠',
    '極細スペース',
    'HAIR SPACE',
    '細いスペースよりさらに細い',
    'very thin space',
  ),
  whitespace(0x2028, '↵', '行区切り', 'LINE SEPARATOR', '行区切り', 'line separator'),
  whitespace(0x2029, '¶', '段落区切り', 'PARAGRAPH SEPARATOR', '段落区切り', 'paragraph separator'),
  whitespace(
    0x202f,
    '⍽',
    '狭いノーブレークスペース',
    'NARROW NO-BREAK SPACE',
    '細い改行禁止スペース',
    'narrow non-breaking space',
  ),
  whitespace(
    0x205f,
    '␠',
    '中幅数学スペース',
    'MEDIUM MATHEMATICAL SPACE',
    '数式用の中幅スペース',
    'medium mathematical space',
  ),
  whitespace(0x3000, '□', '全角スペース', 'IDEOGRAPHIC SPACE', '全角スペース', 'ideographic space'),

  format(
    0x00ad,
    '¬',
    'ソフトハイフン',
    'SOFT HYPHEN',
    '必要な場合だけ表示されるハイフン',
    'optional line-break hyphen',
  ),
  format(
    0x034f,
    '◌',
    '結合文字接合子',
    'COMBINING GRAPHEME JOINER',
    '結合文字の境界制御',
    'combining character boundary control',
  ),
  format(
    0x061c,
    'ALM',
    'アラビア文字マーク',
    'ARABIC LETTER MARK',
    'アラビア文字の方向制御',
    'Arabic text direction control',
  ),
  format(
    0x180e,
    'MVS',
    'モンゴル母音区切り',
    'MONGOLIAN VOWEL SEPARATOR',
    'モンゴル文字の字形制御',
    'Mongolian shaping control',
  ),
  format(
    0x200b,
    'ZWSP',
    'ゼロ幅スペース',
    'ZERO WIDTH SPACE',
    '幅を持たない改行候補',
    'zero-width line-break opportunity',
  ),
  format(
    0x200c,
    'ZWNJ',
    'ゼロ幅非接合子',
    'ZERO WIDTH NON-JOINER',
    '文字の結合を抑止',
    'prevents character joining',
  ),
  format(
    0x200d,
    'ZWJ',
    'ゼロ幅接合子',
    'ZERO WIDTH JOINER',
    '文字や絵文字を結合',
    'joins characters or emoji',
  ),
  format(
    0x200e,
    'LRM',
    '左から右マーク',
    'LEFT-TO-RIGHT MARK',
    '左から右の方向指定',
    'left-to-right direction mark',
  ),
  format(
    0x200f,
    'RLM',
    '右から左マーク',
    'RIGHT-TO-LEFT MARK',
    '右から左の方向指定',
    'right-to-left direction mark',
  ),
  format(
    0x2060,
    'WJ',
    'ワードジョイナー',
    'WORD JOINER',
    '幅を持たず改行を禁止',
    'zero-width line-break prevention',
  ),
  format(
    0x2061,
    'FUN',
    '関数適用',
    'FUNCTION APPLICATION',
    '数式の関数適用',
    'function application in math',
  ),
  format(0x2062, 'TIMES', '不可視乗算', 'INVISIBLE TIMES', '数式の乗算', 'multiplication in math'),
  format(0x2063, 'SEP', '不可視区切り', 'INVISIBLE SEPARATOR', '数式の区切り', 'separator in math'),
  format(0x2064, 'PLUS', '不可視加算', 'INVISIBLE PLUS', '数式の加算', 'addition in math'),
  format(
    0x2066,
    'LRI',
    '左から右の分離',
    'LEFT-TO-RIGHT ISOLATE',
    '左から右の方向分離',
    'left-to-right isolate',
  ),
  format(
    0x2067,
    'RLI',
    '右から左の分離',
    'RIGHT-TO-LEFT ISOLATE',
    '右から左の方向分離',
    'right-to-left isolate',
  ),
  format(
    0x2068,
    'FSI',
    '先頭の強い文字による分離',
    'FIRST STRONG ISOLATE',
    '先頭の強い文字に従う方向分離',
    'isolate using the first strong character',
  ),
  format(
    0x2069,
    'PDI',
    '方向分離の終了',
    'POP DIRECTIONAL ISOLATE',
    '方向分離を終了',
    'ends a directional isolate',
  ),
  format(
    0xfeff,
    'BOM',
    'ゼロ幅ノーブレークスペース',
    'ZERO WIDTH NO-BREAK SPACE / BOM',
    '先頭ではBOM、途中では非推奨',
    'BOM at the start; deprecated in text',
  ),

  blank(
    0x115f,
    '□',
    'ハングル初声フィラー',
    'HANGUL CHOSEONG FILLER',
    '文字カテゴリはLetter',
    'classified as a letter',
  ),
  blank(
    0x1160,
    '□',
    'ハングル中声フィラー',
    'HANGUL JUNGSEONG FILLER',
    '文字カテゴリはLetter',
    'classified as a letter',
  ),
  blank(
    0x2800,
    '⠿',
    '点字空白',
    'BRAILLE PATTERN BLANK',
    '空白のように見える記号',
    'blank-looking symbol',
  ),
  blank(
    0x3164,
    '□',
    'ハングルフィラー',
    'HANGUL FILLER',
    '文字カテゴリはLetter',
    'classified as a letter',
  ),
  blank(
    0xffa0,
    '□',
    '半角ハングルフィラー',
    'HALFWIDTH HANGUL FILLER',
    '文字カテゴリはLetter',
    'classified as a letter',
  ),
]

const byCharacter = new Map(invisibleCharacters.map((item) => [item.character, item]))

export const findInvisibleCharacter = (character: string) => byCharacter.get(character)

export const inspectInvisibleText = (text: string): InvisibleOccurrence[] => {
  let line = 1
  let column = 1
  return Array.from(text).flatMap((character, index) => {
    const item = findInvisibleCharacter(character)
    const occurrence = item ? [{ ...item, index, line, column }] : []
    if (character === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
    return occurrence
  })
}

export const visualizeInvisibleText = (text: string) =>
  Array.from(text)
    .map((character) => findInvisibleCharacter(character)?.marker ?? character)
    .join('')

export const removeInvisibleCharacters = (text: string) =>
  Array.from(text)
    .filter((character) => !findInvisibleCharacter(character))
    .join('')

export const filterInvisibleCharacters = (query: string, category: InvisibleCategory | 'all') => {
  const normalizedQuery = query.normalize('NFKC').toLocaleLowerCase().trim()
  return invisibleCharacters.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!normalizedQuery) return true
    const searchable = [
      item.unicode,
      item.javascript,
      item.marker,
      item.name.ja,
      item.name.en,
      item.description.ja,
      item.description.en,
    ]
      .join(' ')
      .toLocaleLowerCase()
    return searchable.includes(normalizedQuery)
  })
}
