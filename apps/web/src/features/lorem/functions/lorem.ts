export type LoremUnit = 'words' | 'sentences' | 'paragraphs'
export type LoremLanguage = 'la' | 'ja'

const latin =
  `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris
nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse
cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui
officia deserunt mollit anim id est laborum`.split(/\s+/)

const japanese =
  `吾輩は 猫である 名前は まだ無い どこで 生まれたか とんと 見当が つかぬ なんでも 薄暗い
じめじめした所で ニャーニャー 泣いていた事だけは 記憶している 人間という ものを 見たのは
これが 始まりで あろう あとで 聞くと それは 書生という 一番 獰悪な 種族で あったそうだ`.split(/\s+/)

/**
 * Deterministic-looking but varied output. `Math.random` is fine here: filler
 * text has no security or reproducibility requirement.
 */
const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]
const between = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

const sentence = (language: LoremLanguage, startWithLorem = false) => {
  const words = language === 'ja' ? japanese : latin
  const length = between(8, 18)
  const picked = Array.from({ length }, () => pick(words))
  if (startWithLorem && language === 'la') picked.splice(0, 2, 'lorem', 'ipsum')

  if (language === 'ja') return `${picked.join('')}。`
  const [first, ...rest] = picked
  return `${first[0].toUpperCase()}${first.slice(1)}${rest.length ? ` ${rest.join(' ')}` : ''}.`
}

const paragraph = (language: LoremLanguage, startWithLorem = false) =>
  Array.from({ length: between(3, 6) }, (_, index) =>
    sentence(language, startWithLorem && index === 0),
  ).join(language === 'ja' ? '' : ' ')

export const generateLorem = ({
  unit,
  count,
  language,
  startWithLorem,
}: {
  unit: LoremUnit
  count: number
  language: LoremLanguage
  startWithLorem: boolean
}) => {
  const total = Math.max(1, Math.min(200, Math.floor(count) || 1))
  if (unit === 'words') {
    const words = language === 'ja' ? japanese : latin
    const picked = Array.from({ length: total }, () => pick(words))
    if (startWithLorem && language === 'la') picked.splice(0, Math.min(2, total), 'lorem', 'ipsum')
    return language === 'ja' ? picked.join('') : picked.join(' ')
  }
  if (unit === 'sentences')
    return Array.from({ length: total }, (_, index) =>
      sentence(language, startWithLorem && index === 0),
    ).join(language === 'ja' ? '' : ' ')
  return Array.from({ length: total }, (_, index) =>
    paragraph(language, startWithLorem && index === 0),
  ).join('\n\n')
}
