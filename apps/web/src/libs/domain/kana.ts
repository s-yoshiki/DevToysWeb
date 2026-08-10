/**
 * Hiragana and katakana conversion, shared by the width converter and by any
 * tool that wants a search to ignore which script the user typed in.
 */

/** U+3041 ぁ through U+3096 ゖ map onto katakana exactly this far apart. */
const HIRAGANA_START = 0x3041
const HIRAGANA_END = 0x3096
const KANA_OFFSET = 0x60

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

/**
 * Folds a string into the form used for matching: NFKC widens half-width
 * katakana and narrows full-width latin, then case and script are flattened so
 * `ﾈｺ`, `ネコ`, and `ねこ` all compare equal.
 */
export const toSearchableKana = (value: string) =>
  katakanaToHiragana(value.normalize('NFKC').toLocaleLowerCase('ja')).trim()
