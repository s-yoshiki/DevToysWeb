/** Splits on non-alphanumerics and camelCase humps so any input can be re-cased. */
export const splitWords = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

export type TextStats = { characters: number; words: number; lines: number; bytes: number }

export const analyzeText = (value: string): TextStats => ({
  characters: [...value].length,
  words: splitWords(value).length,
  lines: value ? value.split(/\r?\n/).length : 0,
  bytes: new TextEncoder().encode(value).length,
})

export const convertCases = (value: string) => {
  const lower = splitWords(value).map((part) => part.toLocaleLowerCase())
  const cap = (part: string) => part.charAt(0).toLocaleUpperCase() + part.slice(1)
  return {
    camelCase: lower.map((part, index) => (index ? cap(part) : part)).join(''),
    PascalCase: lower.map(cap).join(''),
    snake_case: lower.join('_'),
    'kebab-case': lower.join('-'),
    UPPER_CASE: value.toLocaleUpperCase(),
    'lower case': value.toLocaleLowerCase(),
  }
}
