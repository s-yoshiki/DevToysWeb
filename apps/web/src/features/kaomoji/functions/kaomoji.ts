export type KaomojiCategory =
  | 'joy'
  | 'love'
  | 'sad'
  | 'anger'
  | 'surprise'
  | 'greeting'
  | 'action'
  | 'animal'
  | 'misc'

export type KaomojiEntry = {
  kaomoji: string
  name: { ja: string; en: string }
  keywords: string[]
  category: KaomojiCategory
}

const entry = (
  kaomoji: string,
  ja: string,
  en: string,
  category: KaomojiCategory,
  ...keywords: string[]
): KaomojiEntry => ({ kaomoji, name: { ja, en }, keywords, category })

/**
 * A curated, browser-local kaomoji (Japanese emoticon) catalog. Unlike emoji,
 * kaomoji are ordinary character sequences, so the interesting developer view
 * is how they survive transport: code points, HTML entities, and source escapes.
 */
export const kaomojiCatalog: readonly KaomojiEntry[] = [
  // Joy & laughter
  entry('(^_^)', 'にっこり', 'smiling', 'joy', '笑顔', 'smile', 'happy'),
  entry('(≧▽≦)', '大笑い', 'big laugh', 'joy', '笑い', 'laugh'),
  entry('(*^▽^*)', 'うれしい', 'delighted', 'joy', '喜び', 'glad'),
  entry('(・∀・)', 'ご機嫌', 'cheerful', 'joy', '笑顔', 'grin'),
  entry('(￣▽￣)', 'にやり', 'smirking', 'joy', '笑い', 'smirk'),
  entry('ヽ(´▽`)ノ', '両手を上げて喜ぶ', 'cheering with both hands', 'joy', '万歳', 'cheer'),
  entry('\\(^o^)/', 'バンザイ', 'hooray', 'joy', '万歳', 'hooray', 'banzai'),
  entry('(๑>◡<๑)', 'ほくほく', 'beaming', 'joy', '笑顔', 'beam'),
  entry('(*≧∀≦*)', '大喜び', 'overjoyed', 'joy', '喜び', 'excited'),
  entry('w(^o^)w', 'テンションが高い', 'hyped up', 'joy', '興奮', 'hype'),
  entry('(´∀｀)', 'のんき', 'easygoing', 'joy', '笑顔', 'relaxed'),
  entry('(＾▽＾)', 'ほほえみ', 'bright smile', 'joy', '笑顔', 'smile'),

  // Love & affection
  entry('(*´꒳`*)', 'ほんわか', 'warm and fuzzy', 'love', '和む', 'cozy'),
  entry('(♡´▽`♡)', 'ラブラブ', 'lovestruck', 'love', '恋', 'love'),
  entry('(´∀｀)♡', 'ハート付きの笑顔', 'smile with a heart', 'love', '好き', 'heart'),
  entry('(♡˙︶˙♡)', 'うっとり', 'smitten', 'love', '恋', 'adore'),
  entry('(*/ω＼*)', '照れる', 'bashful', 'love', '照れ', 'shy', 'blush'),
  entry('(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '真っ赤に照れる', 'blushing hard', 'love', '照れ', 'blush'),
  entry('(๑˃̵ᴗ˂̵)', 'きゅん', 'heart flutter', 'love', 'ときめき', 'flutter'),
  entry('( ˘ ³˘)♥', '投げキッス', 'blowing a kiss', 'love', 'キス', 'kiss'),

  // Sadness & tears
  entry('(´；ω；`)', '泣く', 'crying', 'sad', '涙', 'cry'),
  entry('(T_T)', '大泣き', 'sobbing', 'sad', '涙', 'tears'),
  entry('(ToT)', 'わんわん泣く', 'bawling', 'sad', '涙', 'cry'),
  entry('(;_;)', 'しくしく', 'weeping', 'sad', '涙', 'weep'),
  entry('(´・ω・`)', 'しょんぼり', 'downcast', 'sad', '落ち込み', 'sad'),
  entry('(◞‸◟)', 'うつむく', 'dejected', 'sad', '落ち込み', 'gloomy'),
  entry('orz', '土下座・絶望', 'kneeling in despair', 'sad', '絶望', 'despair', 'orz'),
  entry('(ノд-｡)', 'すすり泣く', 'sniffling', 'sad', '涙', 'sniff'),
  entry('(´-ω-`)', 'ため息', 'sighing', 'sad', 'ため息', 'sigh'),

  // Anger
  entry('(｀ε´)', 'ぶーぶー', 'grumbling', 'anger', '不満', 'grumpy'),
  entry('(*｀へ´*)', 'むっとする', 'annoyed', 'anger', '不機嫌', 'annoyed'),
  entry('ヽ(｀Д´)ﾉ', '激怒', 'furious', 'anger', '怒り', 'rage'),
  entry('(╬ Ò﹏Ó)', '殺気立つ', 'seething', 'anger', '怒り', 'seethe'),
  entry('凸(｀0´)凸', '中指を立てる', 'flipping off', 'anger', '挑発', 'provoke'),
  entry('(￣ヘ￣)', 'にらむ', 'glaring', 'anger', '不満', 'glare'),
  entry('(♯｀∧´)', 'ぷんぷん', 'fuming', 'anger', '怒り', 'fume'),

  // Surprise
  entry('Σ(ﾟДﾟ)', 'びっくり', 'startled', 'surprise', '驚き', 'shock'),
  entry('(°ロ°)', '目を丸くする', 'wide-eyed', 'surprise', '驚き', 'astonished'),
  entry('(⊙_⊙)', 'ぽかん', 'stunned', 'surprise', '驚き', 'stunned'),
  entry('Σ(・□・；)', 'ぎょっとする', 'taken aback', 'surprise', '驚き', 'gasp'),
  entry('(＠_＠)', '目が回る', 'dizzy', 'surprise', '混乱', 'dizzy'),
  entry('(ﾟдﾟ)', 'あっけにとられる', 'dumbfounded', 'surprise', '驚き', 'baffled'),

  // Greetings
  entry('(・ω・)ノ', '手を振る', 'waving', 'greeting', '挨拶', 'wave', 'hello'),
  entry('ヾ(＾-＾)ノ', '元気に挨拶', 'energetic greeting', 'greeting', '挨拶', 'hi'),
  entry('ヽ(・∀・)ﾉ', 'やあ', 'hey there', 'greeting', '挨拶', 'hey'),
  entry('m(_ _)m', 'お辞儀・お願い', 'bowing, please', 'greeting', 'お願い', 'bow', 'sorry'),
  entry('(_ _)', 'ぺこり', 'slight bow', 'greeting', 'お辞儀', 'bow'),
  entry('(~˘▾˘)~', 'ゆらゆら', 'swaying hello', 'greeting', '挨拶', 'sway'),
  entry('(*・ω・)ﾉ', 'またね', 'see you', 'greeting', '別れ', 'bye'),

  // Actions & reactions
  entry('¯\\_(ツ)_/¯', 'やれやれ', 'shrug', 'action', 'お手上げ', 'shrug', 'whatever'),
  entry('(╯°□°）╯︵ ┻━┻', 'ちゃぶ台返し', 'table flip', 'action', '激怒', 'table flip'),
  entry('┬─┬ ノ( ゜-゜ノ)', 'ちゃぶ台を戻す', 'putting the table back', 'action', '和解', 'unflip'),
  entry('(☞ﾟヮﾟ)☞', 'あっち向いて', 'pointing away', 'action', '指差し', 'point'),
  entry('(๑•̀ㅂ•́)و✧', 'やる気満々', 'fired up', 'action', '気合', 'determined'),
  entry('ᕕ( ᐛ )ᕗ', '走る', 'running off', 'action', '走る', 'run'),
  entry('(」゜ロ゜)」', '叫ぶ', 'shouting', 'action', '叫び', 'shout'),
  entry('_(:3 」∠)_', 'だらける', 'flopped over', 'action', 'ぐったり', 'lazy'),
  entry('(-_-)zzz', '寝ている', 'sleeping', 'action', '睡眠', 'sleep'),
  entry('(¬_¬)', 'じとっと見る', 'side-eye', 'action', '疑い', 'suspicious'),
  entry('(・_・;)', '冷や汗', 'cold sweat', 'action', '焦り', 'sweat'),
  entry('( ͡° ͜ʖ ͡°)', 'ニヤリ顔', 'lenny face', 'action', 'ニヤリ', 'lenny'),
  entry('(´･_･`)', '考え込む', 'pondering', 'action', '思考', 'think'),
  entry('⊂(・﹏・⊂)', 'そーっと近づく', 'sneaking up', 'action', '接近', 'sneak'),
  entry('(っ˘ω˘ς )', 'うとうと', 'drowsy', 'action', '眠い', 'drowsy'),

  // Animals
  entry('(=^･ω･^=)', '猫', 'cat', 'animal', 'ねこ', 'cat'),
  entry('(=^‥^=)', '猫（正面）', 'cat facing you', 'animal', 'ねこ', 'cat'),
  entry('ฅ^•ﻌ•^ฅ', '猫の手', 'cat paws', 'animal', 'ねこ', 'cat', 'paw'),
  entry('ʕ•ᴥ•ʔ', 'クマ', 'bear', 'animal', 'くま', 'bear'),
  entry('(・(ｴ)・)', 'クマ（和風）', 'bear, kanji style', 'animal', 'くま', 'bear'),
  entry('(=｀ω´=)', '不機嫌な猫', 'grumpy cat', 'animal', 'ねこ', 'cat'),
  entry('(◕ᴥ◕)', '犬', 'dog', 'animal', 'いぬ', 'dog'),
  entry('/ᐠ｡ꞈ｡ᐟ\\', '子猫', 'kitten', 'animal', 'ねこ', 'kitten'),
  entry('＜(ﾟ)))))彡', '魚', 'fish', 'animal', 'さかな', 'fish'),
  entry('(´・(ｪ)・`)', '困ったクマ', 'troubled bear', 'animal', 'くま', 'bear'),

  // Misc & decorated
  entry('☆*:.｡.o(≧▽≦)o.｡.:*☆', 'きらきら大喜び', 'sparkling joy', 'misc', '装飾', 'sparkle'),
  entry('♪(๑ᴖ◡ᴖ๑)♪', '鼻歌', 'humming', 'misc', '音楽', 'hum'),
  entry('(◍•ᴗ•◍)', 'やわらか笑顔', 'soft smile', 'misc', '笑顔', 'soft'),
  entry('(●`ω´●)', 'いたずらっぽい', 'mischievous', 'misc', 'いたずら', 'mischief'),
  entry('(๑´ڡ`๑)', 'おいしい', 'yummy', 'misc', '食事', 'yummy'),
  entry('(*´﹃`*)', 'よだれ', 'drooling', 'misc', '食事', 'drool'),
  entry('(・∀・)つ', '差し出す', 'offering something', 'misc', '手渡し', 'offer'),
  entry('(´ω｀)', 'ほのぼの', 'heartwarming', 'misc', '和む', 'calm'),
]

export const kaomojiCategories: readonly (KaomojiCategory | 'all')[] = [
  'all',
  'joy',
  'love',
  'sad',
  'anger',
  'surprise',
  'greeting',
  'action',
  'animal',
  'misc',
]

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim()

export const filterKaomoji = (
  entries: readonly KaomojiEntry[],
  query: string,
  category: KaomojiCategory | 'all',
) => {
  const normalizedQuery = normalize(query)
  return entries.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!normalizedQuery) return true
    const searchable = [item.kaomoji, item.name.ja, item.name.en, ...item.keywords]
      .map(normalize)
      .join(' ')
    return searchable.includes(normalizedQuery)
  })
}

/** Code points, so surrogate pairs read as one entry rather than two halves. */
export const getKaomojiCodePoints = (value: string) =>
  Array.from(value)
    .map(
      (character) => `U+${character.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`,
    )
    .join(' ')

export const getKaomojiHtml = (value: string) =>
  Array.from(value)
    .map((character) => {
      const point = character.codePointAt(0) ?? 0
      return point < 0x80 ? character : `&#${point};`
    })
    .join('')

/**
 * `\uXXXX` escapes over UTF-16 code units, which is what a JavaScript, JSON, or
 * Java source literal needs when the file itself must stay ASCII.
 */
export const getKaomojiUnicodeEscape = (value: string) =>
  Array.from({ length: value.length }, (_unused, index) => {
    const unit = value.charCodeAt(index)
    if (unit < 0x20 || unit > 0x7e) return `\\u${unit.toString(16).toUpperCase().padStart(4, '0')}`
    const character = value[index]
    return character === '\\' || character === "'" ? `\\${character}` : character
  }).join('')

export const generateKaomoji = (
  entries: readonly KaomojiEntry[],
  count: number,
  random: () => number = Math.random,
) => {
  const total = Math.max(1, Math.min(30, Math.floor(count) || 1))
  if (entries.length === 0) return []
  return Array.from({ length: total }, () => entries[Math.floor(random() * entries.length)])
}
