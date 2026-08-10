import { toSearchableKana } from '@/libs/domain/kana'

export type KaomojiCategory =
  | 'joy'
  | 'love'
  | 'sad'
  | 'anger'
  | 'surprise'
  | 'greeting'
  | 'celebrate'
  | 'trouble'
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
  entry('(^o^)', '口を開けて笑う', 'laughing out loud', 'joy', '笑い', 'laugh'),
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
  entry('(⌒▽⌒)', 'にこにこ', 'all smiles', 'joy', '笑顔', 'smile'),
  entry('(´꒳`)', 'やわらかい笑み', 'soft smile', 'joy', '笑顔', 'gentle'),
  entry('(*´艸`*)', '含み笑い', 'giggling', 'joy', '笑い', 'giggle'),
  entry('(o^▽^o)', 'わくわく', 'excited', 'joy', '期待', 'excited'),
  entry('ヽ(*⌒▽⌒*)ﾉ', '大はしゃぎ', 'romping about', 'joy', '喜び', 'ecstatic'),
  entry('(☆▽☆)', '目を輝かせる', 'starry-eyed', 'joy', '感動', 'starry'),
  entry('(๑˘︶˘๑)', '満足', 'content', 'joy', '満足', 'content'),
  entry('(´ヮ`)', 'にへら', 'goofy smile', 'joy', '笑顔', 'goofy'),
  entry('(*≧▽≦)', 'こらえきれない笑い', 'unable to stop laughing', 'joy', '爆笑', 'lol'),
  entry('(^人^)', '感謝の笑み', 'grateful smile', 'joy', '感謝', 'thanks'),
  entry('(￣ー￣)', 'にんまり不敵', 'confident smirk', 'joy', '不敵', 'smug'),
  entry('( ´∀｀)b', 'いいね', 'thumbs up', 'joy', '賛成', 'good'),
  entry('(*´∀｀*)', 'ほんわか笑顔', 'warm smile', 'joy', '和む', 'warm'),
  entry('(⁀ᗢ⁀)', 'にっこり丸目', 'round-eyed smile', 'joy', '笑顔', 'smile'),
  entry('(๑✧∀✧๑)', 'キラキラ笑顔', 'sparkling smile', 'joy', '感動', 'sparkle'),
  entry('(๑˃ᴗ˂)ﻭ', 'うれしい気合', 'happy and fired up', 'joy', '喜び', 'eager'),
  entry('ﾟ+.(≧∀≦)ﾟ+.', '大喜び（装飾）', 'decorated joy', 'joy', '装飾', 'sparkle'),

  // Love & affection
  entry('(*´꒳`*)', 'ほんわか', 'warm and fuzzy', 'love', '和む', 'cozy'),
  entry('(♡´▽`♡)', 'ラブラブ', 'lovestruck', 'love', '恋', 'love'),
  entry('(´∀｀)♡', 'ハート付きの笑顔', 'smile with a heart', 'love', '好き', 'heart'),
  entry('(♡˙︶˙♡)', 'うっとり', 'smitten', 'love', '恋', 'adore'),
  entry('(*/ω＼*)', '照れる', 'bashful', 'love', '照れ', 'shy', 'blush'),
  entry('(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '真っ赤に照れる', 'blushing hard', 'love', '照れ', 'blush'),
  entry('(๑˃̵ᴗ˂̵)', 'きゅん', 'heart flutter', 'love', 'ときめき', 'flutter'),
  entry('( ˘ ³˘)♥', '投げキッス', 'blowing a kiss', 'love', 'キス', 'kiss'),
  entry('(´ε｀ )', 'キス', 'kissing', 'love', 'キス', 'kiss'),
  entry('(⺣◡⺣)♡*', 'うっとり笑顔', 'dreamy smile', 'love', '恋', 'dreamy'),
  entry('(◍•ᴗ•◍)❤', 'やさしい愛情', 'tender affection', 'love', '愛', 'affection'),
  entry('♡(˃͈ દ ˂͈ ༶ )', '泣くほど好き', 'crying with love', 'love', '感動', 'love'),
  entry('(人´∀｀)', 'お願い・好き', 'pleading fondly', 'love', 'お願い', 'please'),
  entry('(*ﾉ∀`*)', 'てへぺろ', 'playful slip', 'love', '照れ', 'oops'),
  entry('(〃▽〃)', '顔が赤い', 'red in the face', 'love', '照れ', 'blush'),
  entry('(//∇//)', '照れ隠し', 'hiding a blush', 'love', '照れ', 'blush'),
  entry('ヽ(♡‿♡)ノ', '恋に落ちる', 'falling in love', 'love', '恋', 'love'),
  entry('(´♡‿♡`)', '目がハート', 'heart eyes', 'love', '恋', 'heart'),
  entry('♡( ◡‿◡ )', '穏やかな好意', 'quiet fondness', 'love', '好意', 'fond'),
  entry('(♡ω♡ )', 'ときめき目', 'twinkling with love', 'love', 'ときめき', 'crush'),
  entry('(*¯ ³¯*)♡', 'キスマーク', 'kiss mark', 'love', 'キス', 'kiss'),
  entry('(๑´ω`๑)♡', 'しあわせ', 'blissful', 'love', '幸せ', 'happy'),
  entry('⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾', 'ふわふわ幸せ', 'floating on air', 'love', '幸せ', 'floaty'),
  entry('(*ˊᵕˋ*)੭', 'ときめく', 'heart skipping', 'love', 'ときめき', 'flutter'),

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
  entry('(T▽T)', '号泣', 'wailing', 'sad', '涙', 'wail'),
  entry('｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡', '号泣（装飾）', 'decorated wailing', 'sad', '涙', 'wail'),
  entry('(இ﹏இ)', '涙目', 'watery eyes', 'sad', '涙', 'teary'),
  entry('(っ- ‸ - ς)', '泣きそう', 'about to cry', 'sad', '涙', 'tearful'),
  entry('(´_｀)', 'がっかり', 'disappointed', 'sad', '落胆', 'letdown'),
  entry('(；ω；)', '涙をこらえる', 'holding back tears', 'sad', '涙', 'tears'),
  entry('(ノ_<。)', '泣き崩れる', 'breaking down', 'sad', '涙', 'sob'),
  entry('(´•̥ω•̥`)', 'うるうる', 'welling up', 'sad', '涙', 'teary'),
  entry('(◍•﹏•)', '悲しい', 'sorrowful', 'sad', '悲しみ', 'sorrow'),
  entry('｜ω･`)', '物陰から寂しく', 'peeking, lonely', 'sad', '寂しい', 'lonely'),
  entry('(´Д｀)', 'がっくり', 'crestfallen', 'sad', '落胆', 'dismay'),
  entry('(ﾉД`)', '顔を覆って泣く', 'crying into hands', 'sad', '涙', 'cry'),
  entry('(._.)', '落胆', 'downhearted', 'sad', '落ち込み', 'down'),
  entry('○| ￣|_', '崩れ落ちる', 'collapsing', 'sad', '絶望', 'defeated'),
  entry('(シ_ _)シ', '力尽きる', 'out of strength', 'sad', '疲れ', 'exhausted'),

  // Anger
  entry('(｀ε´)', 'ぶーぶー', 'grumbling', 'anger', '不満', 'grumpy'),
  entry('(*｀へ´*)', 'むっとする', 'annoyed', 'anger', '不機嫌', 'annoyed'),
  entry('ヽ(｀Д´)ﾉ', '激怒', 'furious', 'anger', '怒り', 'rage'),
  entry('(╬ Ò﹏Ó)', '殺気立つ', 'seething', 'anger', '怒り', 'seethe'),
  entry('凸(｀0´)凸', '中指を立てる', 'flipping off', 'anger', '挑発', 'provoke'),
  entry('(￣ヘ￣)', 'にらむ', 'glaring', 'anger', '不満', 'glare'),
  entry('(♯｀∧´)', 'ぷんぷん', 'fuming', 'anger', '怒り', 'fume'),
  entry('ヽ(#`Д´)ﾉ', '怒鳴る', 'shouting in anger', 'anger', '怒り', 'yell'),
  entry('(；一_一)', '呆れ怒り', 'exasperated', 'anger', '呆れ', 'exasperated'),
  entry('(♯▼皿▼)', '憤怒', 'wrathful', 'anger', '怒り', 'wrath'),
  entry('(ﾒ｀ﾛ´)', '睨みつける', 'staring daggers', 'anger', '怒り', 'glare'),
  entry('(`皿´#)', '歯を食いしばる', 'gritting teeth', 'anger', '怒り', 'grit'),
  entry('٩(๑`^´๑)۶', '抗議', 'protesting', 'anger', '抗議', 'protest'),
  entry('(＃`Д´)', '抗議の声', 'raising a complaint', 'anger', '抗議', 'complain'),
  entry('(¬､¬)', '冷ややかな怒り', 'cold anger', 'anger', '冷たい', 'cold'),
  entry('(ㆆ_ㆆ)', '無言の圧', 'silent pressure', 'anger', '威圧', 'pressure'),
  entry('ლ(ಠ益ಠ)ლ', 'なぜだ', 'why though', 'anger', '不満', 'why'),
  entry('(＃＞＜)', 'いらいら', 'irritated', 'anger', '苛立ち', 'irritated'),

  // Surprise
  entry('Σ(ﾟДﾟ)', 'びっくり', 'startled', 'surprise', '驚き', 'shock'),
  entry('(°ロ°)', '目を丸くする', 'wide-eyed', 'surprise', '驚き', 'astonished'),
  entry('(⊙_⊙)', 'ぽかん', 'stunned', 'surprise', '驚き', 'stunned'),
  entry('Σ(・□・；)', 'ぎょっとする', 'taken aback', 'surprise', '驚き', 'gasp'),
  entry('(＠_＠)', '目が回る', 'dizzy', 'surprise', '混乱', 'dizzy'),
  entry('(ﾟдﾟ)', 'あっけにとられる', 'dumbfounded', 'surprise', '驚き', 'baffled'),
  entry('Σ(°ロ°)', '衝撃', 'shocked', 'surprise', '衝撃', 'shock'),
  entry('(ﾟoﾟ)', '声が出ない', 'speechless', 'surprise', '絶句', 'speechless'),
  entry('Σd(°∀°d)', '驚きと称賛', 'impressed', 'surprise', '称賛', 'impressed'),
  entry('w(°o°)w', '大きく驚く', 'greatly surprised', 'surprise', '驚き', 'wow'),
  entry('(；ﾟДﾟ)', '冷や汗の驚き', 'nervous shock', 'surprise', '焦り', 'shock'),
  entry('Σ(ﾉ°▽°)ﾉ', '飛び上がる', 'jumping in surprise', 'surprise', '驚き', 'jump'),
  entry('(ﾟ□ﾟ)', '絶句', 'lost for words', 'surprise', '絶句', 'speechless'),
  entry('( ゜Д゜)', '呆然', 'dazed', 'surprise', '呆然', 'dazed'),
  entry('Σ(￣□￣;)', '息をのむ', 'gasping', 'surprise', '驚き', 'gasp'),
  entry('⊙▂⊙', 'まじまじ', 'staring blankly', 'surprise', '凝視', 'stare'),
  entry('(◎_◎;)', 'たじろぐ', 'flinching', 'surprise', '動揺', 'flinch'),

  // Greetings & bows
  entry('(・ω・)ノ', '手を振る', 'waving', 'greeting', '挨拶', 'wave', 'hello'),
  entry('ヾ(＾-＾)ノ', '元気に挨拶', 'energetic greeting', 'greeting', '挨拶', 'hi'),
  entry('ヽ(・∀・)ﾉ', 'やあ', 'hey there', 'greeting', '挨拶', 'hey'),
  entry('m(_ _)m', 'お辞儀・お願い', 'bowing, please', 'greeting', 'お願い', 'bow'),
  entry('(_ _)', 'ぺこり', 'slight bow', 'greeting', 'お辞儀', 'bow'),
  entry('(~˘▾˘)~', 'ゆらゆら', 'swaying hello', 'greeting', '挨拶', 'sway'),
  entry('(*・ω・)ﾉ', 'またね', 'see you', 'greeting', '別れ', 'bye'),
  entry('ノシ', '手を振る（略式）', 'quick wave', 'greeting', '挨拶', 'wave'),
  entry('(^^)/~~~', '見送り', 'seeing off', 'greeting', '別れ', 'farewell'),
  entry('(｡･ω･｡)ﾉ', 'こんにちは', 'hello there', 'greeting', '挨拶', 'hello'),
  entry('ヾ(＠⌒ー⌒＠)ノ', 'ごきげんよう', 'good day to you', 'greeting', '挨拶', 'greetings'),
  entry('(*´ω`*)ﾉ', 'おはよう', 'good morning', 'greeting', '挨拶', 'morning'),
  entry('( ´ ▽ ` )ﾉ', 'よろしく', 'nice to meet you', 'greeting', '挨拶', 'regards'),
  entry('(´｡• ω •｡`)ﾉ', 'やさしい挨拶', 'gentle greeting', 'greeting', '挨拶', 'gentle'),
  entry('(・∀・)ﾉｼ', 'じゃあね', 'later then', 'greeting', '別れ', 'bye'),
  entry('(￣^￣)ゞ', '敬礼', 'saluting', 'greeting', '敬礼', 'salute'),
  entry('ｍ(_ _;)ｍ', '恐縮', 'humbly sorry', 'greeting', '恐縮', 'humble'),
  entry('(´∀｀)ゞ', '照れた敬礼', 'bashful salute', 'greeting', '敬礼', 'salute'),
  entry('(*´▽`*)ﾉ゛', 'ばいばい', 'bye bye', 'greeting', '別れ', 'bye'),
  entry('ﾉ( ˘ω˘ )', 'おやすみの挨拶', 'goodnight wave', 'greeting', '就寝', 'goodnight'),

  // Celebration & cheering
  entry('ヽ(´▽`)/', 'おめでとう', 'congratulations', 'celebrate', '祝う', 'congrats'),
  entry('＼(^o^)／', 'やったー', 'yay', 'celebrate', '喜び', 'yay'),
  entry('☆*:.｡.o(≧▽≦)o.｡.:*☆', 'きらきら大喜び', 'sparkling joy', 'celebrate', '装飾', 'sparkle'),
  entry('٩(◕‿◕)۶', 'ばんざい', 'hurray', 'celebrate', '万歳', 'hurray'),
  entry('ヾ(≧▽≦*)o', 'わーい', 'woohoo', 'celebrate', '喜び', 'woohoo'),
  entry('o(≧▽≦)o', '大歓声', 'cheering loudly', 'celebrate', '歓声', 'cheer'),
  entry('⌒*(ﾉ∀`*)*⌒', '拍手', 'applauding', 'celebrate', '拍手', 'applause'),
  entry('(๑•̀ㅂ•́)و✧', 'やる気満々', 'fired up', 'celebrate', '気合', 'determined'),
  entry('ヽ(＾▽＾)ノ', '大喜び', 'delighted cheer', 'celebrate', '喜び', 'cheer'),
  entry('✧*｡ﾟ(ﾉ∀`ﾟ)ﾟ｡*✧', '感激', 'deeply moved', 'celebrate', '感動', 'moved'),
  entry('o(*≧▽≦)ツ', '応援', 'rooting for you', 'celebrate', '応援', 'support'),
  entry('＼(◎o◎)／', 'わあ', 'wow', 'celebrate', '驚喜', 'wow'),
  entry('٩( ᐛ )و', 'がんばれ', 'you can do it', 'celebrate', '応援', 'ganbare'),
  entry('(ง •̀_•́)ง', '気合を入れる', 'psyching up', 'celebrate', '気合', 'pumped'),
  entry('୧(๑•̀ᗝ•́)૭', '立ち上がる', 'standing up for it', 'celebrate', '気合', 'rally'),
  entry('✧◝(⁰▿⁰)◜✧', '輝く喜び', 'radiant joy', 'celebrate', '装飾', 'radiant'),
  entry('ヽ(o´∀`)ﾉ♪♬', '祝いの音楽', 'celebration music', 'celebrate', '音楽', 'music'),
  entry('(*ﾟ▽ﾟ)ﾉ*:･ﾟ✧', '祝福', 'blessing', 'celebrate', '祝う', 'bless'),
  entry('ヾ(*´∀`*)ﾉ', '歓迎の拍手', 'welcoming applause', 'celebrate', '歓迎', 'welcome'),
  entry('ᕕ(⌐■_■)ᕗ♪♬', 'ノリノリ', 'grooving', 'celebrate', '音楽', 'groove'),

  // Trouble & apology
  entry('(´･_･`)', '困り顔', 'troubled', 'trouble', '困る', 'troubled'),
  entry('(・_・;)', '冷や汗', 'cold sweat', 'trouble', '焦り', 'sweat'),
  entry('(^_^;)', '苦笑い', 'wry smile', 'trouble', '苦笑', 'awkward'),
  entry('(；´Д｀)', '参った', 'at a loss', 'trouble', '困る', 'stumped'),
  entry('(´Д｀;)', '弱る', 'weakening', 'trouble', '困る', 'struggling'),
  entry('(>_<)', 'つらい', 'painful', 'trouble', 'つらい', 'ouch'),
  entry('m(__)m', 'ごめんなさい', 'sorry', 'trouble', '謝る', 'sorry'),
  entry('(´・ω・｀)ゞ', '申し訳ない', 'apologetic', 'trouble', '謝る', 'apology'),
  entry('(・・;)', 'たじろぐ', 'taken aback', 'trouble', '動揺', 'flustered'),
  entry('(￣▽￣;)', '苦い笑み', 'bitter smile', 'trouble', '苦笑', 'awkward'),
  entry('┐(´д`)┌', 'お手上げ', 'giving up', 'trouble', 'お手上げ', 'helpless'),
  entry('¯\\_(ツ)_/¯', 'やれやれ', 'shrug', 'trouble', 'お手上げ', 'shrug', 'whatever'),
  entry('(@_@;)', '混乱', 'confused', 'trouble', '混乱', 'confused'),
  entry('(・∧‐)ゞ', '気まずい敬礼', 'awkward salute', 'trouble', '気まずい', 'awkward'),
  entry('(´～`)', 'むずかしい', 'this is hard', 'trouble', '難しい', 'difficult'),
  entry('(；・∀・)', '焦り', 'flustered', 'trouble', '焦り', 'panicky'),
  entry('(-_-;)', '困惑のため息', 'weary sigh', 'trouble', 'ため息', 'weary'),
  entry('＿|￣|○', '挫折', 'crushed', 'trouble', '絶望', 'defeated'),
  entry('(´ﾟдﾟ`)', 'えっ', 'wait, what', 'trouble', '戸惑い', 'huh'),
  entry('(｡•́︿•̀｡)', 'しゅん', 'downcast', 'trouble', '落ち込み', 'glum'),
  entry('(＞人＜;)', 'お願い・すまない', 'begging pardon', 'trouble', '謝る', 'pardon'),
  entry('(￣人￣)', '平謝り', 'profuse apology', 'trouble', '謝る', 'apology'),

  // Actions & reactions
  entry('(╯°□°）╯︵ ┻━┻', 'ちゃぶ台返し', 'table flip', 'action', '激怒', 'table flip'),
  entry('┬─┬ ノ( ゜-゜ノ)', 'ちゃぶ台を戻す', 'putting the table back', 'action', '和解', 'unflip'),
  entry('(☞ﾟヮﾟ)☞', 'あっち向いて', 'pointing away', 'action', '指差し', 'point'),
  entry('ᕕ( ᐛ )ᕗ', '走る', 'running off', 'action', '走る', 'run'),
  entry('(」゜ロ゜)」', '叫ぶ', 'shouting', 'action', '叫び', 'shout'),
  entry('_(:3 」∠)_', 'だらける', 'flopped over', 'action', 'ぐったり', 'lazy'),
  entry('(-_-)zzz', '寝ている', 'sleeping', 'action', '睡眠', 'sleep'),
  entry('(¬_¬)', 'じとっと見る', 'side-eye', 'action', '疑い', 'suspicious'),
  entry('( ͡° ͜ʖ ͡°)', 'ニヤリ顔', 'lenny face', 'action', 'ニヤリ', 'lenny'),
  entry('⊂(・﹏・⊂)', 'そーっと近づく', 'sneaking up', 'action', '接近', 'sneak'),
  entry('(っ˘ω˘ς )', 'うとうと', 'drowsy', 'action', '眠い', 'drowsy'),
  entry('ヾ(・ω・*)', 'なでなで', 'patting a head', 'action', '撫でる', 'pat'),
  entry('( ˘ω˘ )ｽﾔｧ', '熟睡', 'fast asleep', 'action', '睡眠', 'asleep'),
  entry('(っ˘ڡ˘ς)', '食べる', 'eating happily', 'action', '食事', 'eat'),
  entry('( ˇωˇ )', 'しれっと', 'nonchalant', 'action', '平然', 'nonchalant'),
  entry('ヽ(*・ω・)ﾉ', '手招き', 'beckoning', 'action', '呼ぶ', 'beckon'),
  entry('(ﾉ*ﾟｰﾟ)ﾉ', '手を伸ばす', 'reaching out', 'action', '手を伸ばす', 'reach'),
  entry('( ・∀・)ノ゛', '呼びかけ', 'calling out', 'action', '呼ぶ', 'call'),
  entry('σ(￣、￣〃)', '考える', 'thinking it over', 'action', '思考', 'think'),
  entry('(・ω・)b', 'グッド', 'thumbs up', 'action', '賛成', 'good'),
  entry('(`・ω・´)ゞ', '了解', 'roger that', 'action', '了解', 'roger'),
  entry('ε=ε=┏( >_<)┛', '全力で走る', 'running flat out', 'action', '走る', 'dash'),
  entry('((((;ﾟДﾟ))))', '震える', 'trembling', 'action', '恐怖', 'tremble'),
  entry('ヽ(´o｀;)ﾉ', 'おろおろ', 'dithering', 'action', '動揺', 'flustered'),
  entry('( ˘•ω•˘ )', 'じっと見る', 'gazing quietly', 'action', '凝視', 'gaze'),
  entry('⊂二二二( ^ω^)二⊃', 'ブーン', 'flying along', 'action', '移動', 'zoom'),
  entry('( ・ω・)つ⑩', '差し出す', 'handing over', 'action', '手渡し', 'offer'),
  entry('(˘▾˘)~♪', '鼻歌まじり', 'humming along', 'action', '音楽', 'hum'),
  entry('~(＿△＿)~', 'ゆらゆら揺れる', 'swaying about', 'action', '揺れる', 'sway'),
  entry('(･ω･)ﾉ⌒', '投げる', 'throwing', 'action', '投げる', 'throw'),
  entry('ヽ(ﾟДﾟ)ﾉ', '慌てる', 'panicking', 'action', '慌てる', 'panic'),
  entry('(＿ ＿*) Zzz', '眠り込む', 'nodding off', 'action', '睡眠', 'nap'),

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
  entry('ʕ￫ᴥ￩ʔ', '横向きのクマ', 'bear in profile', 'animal', 'くま', 'bear'),
  entry('(・×・)', 'ぶた', 'pig', 'animal', 'ぶた', 'pig'),
  entry('( ˃ᆺ˂ )', 'うさぎ', 'rabbit', 'animal', 'うさぎ', 'rabbit'),
  entry('ʕ·ᴥ·ʔ', '小さいクマ', 'little bear', 'animal', 'くま', 'bear'),
  entry('ᶘ ᵒᴥᵒᶅ', 'あざらし', 'seal', 'animal', 'あざらし', 'seal'),
  entry('(´(ｴ)｀)', 'くまさん', 'friendly bear', 'animal', 'くま', 'bear'),
  entry('ヽ(=^･ω･^=)丿', 'ねこの挨拶', 'cat saying hello', 'animal', 'ねこ', 'cat'),
  entry('( ﾟ(ｪ)ﾟ )', '驚くクマ', 'startled bear', 'animal', 'くま', 'bear'),
  entry('(・ｪ・)', 'たぬき', 'raccoon dog', 'animal', 'たぬき', 'tanuki'),
  entry('( ^ω^)', '犬っぽい笑顔', 'doggy grin', 'animal', 'いぬ', 'dog'),
  entry('ヾ(=`ω´=)ﾉ', '猫の抗議', 'protesting cat', 'animal', 'ねこ', 'cat'),
  entry('ミ๏㉨๏彡', 'くま顔', 'bear face', 'animal', 'くま', 'bear'),
  entry('(○´ω`○)', 'はむすたー', 'hamster', 'animal', 'はむすたー', 'hamster'),

  // Misc & decorated
  entry('♪(๑ᴖ◡ᴖ๑)♪', '鼻歌', 'humming', 'misc', '音楽', 'hum'),
  entry('(◍•ᴗ•◍)', 'やわらか笑顔', 'soft smile', 'misc', '笑顔', 'soft'),
  entry('(●`ω´●)', 'いたずらっぽい', 'mischievous', 'misc', 'いたずら', 'mischief'),
  entry('(๑´ڡ`๑)', 'おいしい', 'yummy', 'misc', '食事', 'yummy'),
  entry('(*´﹃`*)', 'よだれ', 'drooling', 'misc', '食事', 'drool'),
  entry('(・∀・)つ', '差し出す（空手）', 'offering empty hands', 'misc', '手渡し', 'offer'),
  entry('(´ω｀)', 'ほのぼの', 'heartwarming', 'misc', '和む', 'calm'),
  entry('( ˘ᴗ˘ )', '安らか', 'at peace', 'misc', '安らぎ', 'peaceful'),
  entry('✿◕ ‿ ◕✿', '花飾り', 'flower framed', 'misc', '装飾', 'flower'),
  entry('☆彡', '流れ星', 'shooting star', 'misc', '装飾', 'star'),
  entry('✧･ﾟ: *✧･ﾟ:*', 'きらめき', 'sparkle line', 'misc', '装飾', 'sparkle'),
  entry('(´｡• ᵕ •｡`)', 'つぶらな瞳', 'round innocent eyes', 'misc', '笑顔', 'innocent'),
  entry('(๑°꒵°๑)', 'ぽかん顔', 'blank face', 'misc', 'ぽかん', 'blank'),
  entry('ヽ(๑◕ヮ◕๑)ﾉ', 'ハイテンション', 'high spirits', 'misc', '興奮', 'hyper'),
  entry('(◔_◔)', '半眼', 'half-lidded look', 'misc', '呆れ', 'unimpressed'),
  entry('(ㆁωㆁ)', 'まんまる目', 'wide round eyes', 'misc', '驚き', 'round'),
  entry('ʚ(ᵕ̈)ɞ', '天使', 'angel', 'misc', '天使', 'angel'),
  entry('(´ ▽｀).｡ｏ♡', '夢見心地', 'daydreaming', 'misc', '夢', 'daydream'),
  entry('( ｀ー´)ノ', '決めポーズ', 'striking a pose', 'misc', 'ポーズ', 'pose'),
  entry('ლ(´ڡ`ლ)', '食いしん坊', 'greedy for food', 'misc', '食事', 'hungry'),
  entry('(ﾉ≧∀≦)ﾉ', '飛びつく', 'pouncing', 'misc', '動作', 'pounce'),
  entry('⊂((・▽・))⊃', '大きく広げる', 'arms wide open', 'misc', '動作', 'open arms'),
]

export const kaomojiCategories: readonly (KaomojiCategory | 'all')[] = [
  'all',
  'joy',
  'love',
  'sad',
  'anger',
  'surprise',
  'greeting',
  'celebrate',
  'trouble',
  'action',
  'animal',
  'misc',
]

export const filterKaomoji = (
  entries: readonly KaomojiEntry[],
  query: string,
  category: KaomojiCategory | 'all',
) => {
  // Folding both sides to hiragana lets ネコ, ﾈｺ, and ねこ find the same entry.
  const normalizedQuery = toSearchableKana(query)
  return entries.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!normalizedQuery) return true
    const searchable = [item.kaomoji, item.name.ja, item.name.en, ...item.keywords]
      .map(toSearchableKana)
      .join(' ')
    return searchable.includes(normalizedQuery)
  })
}

/**
 * Code point ranges a CJK font renders two columns wide. East Asian Ambiguous
 * blocks (arrows, box drawing, geometric shapes) are counted as wide because
 * that is how they render beside the kana and full-width brackets around them.
 * Half-width katakana (U+FF61–U+FF9F) deliberately sits outside every range.
 */
const WIDE_RANGES: readonly (readonly [number, number])[] = [
  [0x1100, 0x115f],
  [0x2190, 0x22ff],
  [0x2460, 0x24ff],
  [0x2500, 0x257f],
  [0x25a0, 0x27bf],
  [0x2e80, 0x303e],
  [0x3041, 0x33ff],
  [0x3400, 0x4dbf],
  [0x4e00, 0x9fff],
  [0xa000, 0xa4cf],
  [0xac00, 0xd7a3],
  [0xf900, 0xfaff],
  [0xfe30, 0xfe6f],
  [0xff00, 0xff60],
  [0xffe0, 0xffe6],
]

/**
 * Approximate column count rather than character count, so a short string of
 * wide glyphs is not mistaken for a narrow one when sizing a grid cell.
 */
export const getKaomojiDisplayWidth = (value: string) =>
  Array.from(value).reduce((total, character) => {
    const point = character.codePointAt(0) ?? 0
    const wide = WIDE_RANGES.some(([start, end]) => point >= start && point <= end)
    return total + (wide ? 2 : 1)
  }, 0)

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
