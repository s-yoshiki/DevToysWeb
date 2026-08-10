/**
 * Kaomoji assembled from parts. A face reads outward from the middle:
 * `arms( brackets( eye mouth eye ) )` wrapped in an optional decoration, so
 * each table only has to know its own pair of characters.
 */

export type PairPart = {
  id: string
  label: { ja: string; en: string }
  left: string
  right: string
}

export type SinglePart = {
  id: string
  label: { ja: string; en: string }
  value: string
}

const pair = (id: string, ja: string, en: string, left: string, right: string): PairPart => ({
  id,
  label: { ja, en },
  left,
  right,
})

const single = (id: string, ja: string, en: string, value: string): SinglePart => ({
  id,
  label: { ja, en },
  value,
})

export const kaomojiBrackets: readonly PairPart[] = [
  pair('none', 'なし', 'None', '', ''),
  pair('round', '丸括弧', 'Round', '(', ')'),
  pair('wide', '全角丸括弧', 'Full-width round', '（', '）'),
  pair('curly', '波括弧', 'Curly', '{', '}'),
  pair('square', '角括弧', 'Square', '[', ']'),
  pair('corner', 'かぎ括弧', 'Corner', '｢', '｣'),
  pair('lenticular', 'すみ付き括弧', 'Lenticular', '〔', '〕'),
  pair('angle', '山括弧', 'Angle', '〈', '〉'),
  pair('cheek', 'ほっぺ付き', 'With cheeks', '(๑', '๑)'),
  pair('fluffy', 'ふんわり', 'Fluffy', '( ˘', '˘ )'),
]

export const kaomojiEyes: readonly PairPart[] = [
  pair('caret', 'にっこり', 'Smiling', '^', '^'),
  pair('dot', 'まる目', 'Dots', '・', '・'),
  pair('squint', '笑い目', 'Laughing', '≧', '≦'),
  pair('tight', 'ぎゅっと', 'Squeezed', '＞', '＜'),
  pair('teary', 'うるうる', 'Teary', '˃', '˂'),
  pair('droopy', 'たれ目', 'Droopy', '´', '｀'),
  pair('round', 'まんまる', 'Round', '°', '°'),
  pair('star', '星目', 'Starry', '☆', '☆'),
  pair('sparkle', 'きらめき', 'Sparkling', '✧', '✧'),
  pair('heart', 'ハート目', 'Hearts', '♡', '♡'),
  pair('cry', '泣き目', 'Crying', 'T', 'T'),
  pair('closed', '閉じ目', 'Closed', '-', '-'),
  pair('stare', '凝視', 'Staring', '⊙', '⊙'),
  pair('bead', 'つぶら', 'Beady', 'ㆁ', 'ㆁ'),
  pair('sharp', 'つり目', 'Sharp', '｀', '´'),
  pair('dead', 'ばつ目', 'Crossed out', '×', '×'),
]

export const kaomojiMouths: readonly SinglePart[] = [
  single('none', 'なし', 'None', ''),
  single('under', 'むすび口', 'Straight', '_'),
  single('omega', 'ω口', 'Omega', 'ω'),
  single('smile', 'にっこり口', 'Smile', '∀'),
  single('open', '開いた口', 'Open', '∇'),
  single('kiss', 'とがり口', 'Pursed', 'ε'),
  single('shout', '叫び口', 'Shouting', 'д'),
  single('frown', 'への字', 'Frown', '‸'),
  single('snout', '動物の口', 'Snout', 'ᴥ'),
  single('grin', 'にかっと', 'Grin', 'ヮ'),
  single('wave', '波打つ口', 'Wavy', '﹏'),
  single('curve', 'にこ口', 'Curved', '‿'),
  single('square', '四角い口', 'Square', '□'),
  single('teeth', '歯を見せる', 'Bared teeth', '皿'),
  single('drool', 'よだれ口', 'Drooling', 'ڡ'),
  single('triangle', '三角口', 'Triangle', '△'),
]

export const kaomojiArms: readonly PairPart[] = [
  pair('none', 'なし', 'None', '', ''),
  pair('raise', '両手を上げる', 'Raised', 'ヽ', 'ﾉ'),
  pair('cheer', '万歳', 'Cheering', '＼', '／'),
  pair('shrug', 'やれやれ', 'Shrug', '┐', '┌'),
  pair('hug', '抱きしめる', 'Hugging', '╰', '╯'),
  pair('run', '走る', 'Running', 'ᕕ', 'ᕗ'),
  pair('reach', '差し出す', 'Reaching', '⊂', '⊃'),
  pair('wave', '手を振る', 'Waving', 'ヾ', 'ﾉ'),
  pair('flex', '気合', 'Flexing', '٩', '۶'),
  pair('hold', '両手を添える', 'Cupping', 'o', 'o'),
  pair('paw', '肉球', 'Paws', 'ฅ', 'ฅ'),
]

export const kaomojiDecorations: readonly PairPart[] = [
  pair('none', 'なし', 'None', '', ''),
  pair('star', '星', 'Stars', '☆', '☆'),
  pair('note', '音符', 'Music', '♪', '♪'),
  pair('sparkle', 'きらきら', 'Sparkles', '✧･ﾟ: *', '* :･ﾟ✧'),
  pair('glitter', '装飾ドット', 'Glitter', '｡ﾟ+.', '.+ﾟ｡'),
  pair('twinkle', '流れ星', 'Shooting star', '', '☆彡'),
  pair('heart', 'ハート', 'Heart', '', '♡'),
  pair('bang', 'ビックリマーク', 'Exclamation', '', '！'),
  pair('hand', '振る手', 'Waving hand', '', 'ﾉ'),
  pair('flower', '花', 'Flowers', '✿', '✿'),
]

export type KaomojiPartSelection = {
  brackets: string
  eyes: string
  mouth: string
  arms: string
  decoration: string
}

export const defaultKaomojiParts: KaomojiPartSelection = {
  brackets: 'round',
  eyes: 'caret',
  mouth: 'under',
  arms: 'none',
  decoration: 'none',
}

const findPair = (parts: readonly PairPart[], id: string) =>
  parts.find((part) => part.id === id) ?? parts[0]

const findSingle = (parts: readonly SinglePart[], id: string) =>
  parts.find((part) => part.id === id) ?? parts[0]

export const buildKaomoji = (selection: KaomojiPartSelection) => {
  const brackets = findPair(kaomojiBrackets, selection.brackets)
  const eyes = findPair(kaomojiEyes, selection.eyes)
  const mouth = findSingle(kaomojiMouths, selection.mouth)
  const arms = findPair(kaomojiArms, selection.arms)
  const decoration = findPair(kaomojiDecorations, selection.decoration)

  const face = `${eyes.left}${mouth.value}${eyes.right}`
  const bracketed = `${brackets.left}${face}${brackets.right}`
  const armed = `${arms.left}${bracketed}${arms.right}`
  return `${decoration.left}${armed}${decoration.right}`
}

export const randomKaomojiParts = (random: () => number = Math.random): KaomojiPartSelection => {
  const pick = <Part extends { id: string }>(parts: readonly Part[]) =>
    parts[Math.floor(random() * parts.length)].id
  return {
    brackets: pick(kaomojiBrackets),
    eyes: pick(kaomojiEyes),
    mouth: pick(kaomojiMouths),
    arms: pick(kaomojiArms),
    decoration: pick(kaomojiDecorations),
  }
}
