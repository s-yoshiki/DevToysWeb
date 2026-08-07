export type EmojiCategory =
  | 'smileys'
  | 'people'
  | 'animals'
  | 'food'
  | 'travel'
  | 'activities'
  | 'objects'
  | 'symbols'

export type EmojiEntry = {
  emoji: string
  name: { ja: string; en: string }
  keywords: string[]
  category: EmojiCategory
}

const entry = (
  emoji: string,
  ja: string,
  en: string,
  category: EmojiCategory,
  ...keywords: string[]
): EmojiEntry => ({ emoji, name: { ja, en }, keywords, category })

/**
 * A small, browser-local emoji catalog. Names and groups follow the Unicode
 * emoji list/CLDR naming style; the reference page is useful when checking
 * the same display, text, and HTML-code fields in a browser.
 */
export const emojiCatalog: readonly EmojiEntry[] = [
  // Smileys & emotion
  entry('😀', 'にっこり笑う顔', 'grinning face', 'smileys', '笑顔', 'smile', 'happy'),
  entry('😃', '大きな目で笑う顔', 'grinning face with big eyes', 'smileys', '笑顔', 'smile'),
  entry('😄', '目が笑っている顔', 'grinning face with smiling eyes', 'smileys', '笑顔', 'smile'),
  entry('😁', '満面の笑み', 'beaming face with smiling eyes', 'smileys', '笑顔', 'smile'),
  entry('😆', '口を開けて笑う顔', 'grinning squinting face', 'smileys', '笑い', 'laugh'),
  entry('😅', '冷や汗をかいた笑顔', 'grinning face with sweat', 'smileys', '汗', 'nervous'),
  entry('😂', '嬉し泣き', 'face with tears of joy', 'smileys', '泣く', 'tears', 'lol'),
  entry('🤣', '床を転げ回って笑う', 'rolling on the floor laughing', 'smileys', '爆笑', 'rofl'),
  entry('😊', '目が笑っている笑顔', 'smiling face with smiling eyes', 'smileys', '照れ', 'blush'),
  entry('😇', '天使の輪がついた笑顔', 'smiling face with halo', 'smileys', '天使', 'angel'),
  entry('🙂', '少し笑った顔', 'slightly smiling face', 'smileys', '笑顔', 'smile'),
  entry('🙃', '逆さまの顔', 'upside-down face', 'smileys', '逆さ', 'silly'),
  entry('😉', 'ウインク', 'winking face', 'smileys', 'ウィンク', 'wink'),
  entry('😍', 'ハートの目の顔', 'smiling face with heart-eyes', 'smileys', '好き', 'love'),
  entry('🥰', 'ハートの笑顔', 'smiling face with hearts', 'smileys', '愛', 'love'),
  entry('😘', '投げキッス', 'face blowing a kiss', 'smileys', 'キス', 'kiss'),
  entry('😋', '食べ物を味わう顔', 'face savoring food', 'smileys', 'おいしい', 'yummy'),
  entry('😛', '舌を出した顔', 'face with tongue', 'smileys', '舌', 'playful'),
  entry('🤪', 'おどけた顔', 'zany face', 'smileys', '変顔', 'silly'),
  entry('🤔', '考える顔', 'thinking face', 'smileys', '考える', 'think'),
  entry('🤫', '内緒の顔', 'shushing face', 'smileys', '静かに', 'quiet'),
  entry('😎', 'サングラスの笑顔', 'smiling face with sunglasses', 'smileys', 'クール', 'cool'),
  entry('🤩', '星の目の顔', 'star-struck', 'smileys', '感動', 'excited'),
  entry('🥳', 'パーティーの顔', 'partying face', 'smileys', '祝う', 'party'),
  entry('😴', '眠っている顔', 'sleeping face', 'smileys', '眠い', 'sleep'),
  entry('😢', '泣き顔', 'crying face', 'smileys', '涙', 'sad'),
  entry('😭', '大泣き', 'loudly crying face', 'smileys', '悲しい', 'cry'),
  entry('😡', '怒った顔', 'enraged face', 'smileys', '怒り', 'angry'),
  entry('😱', '恐怖で叫ぶ顔', 'face screaming in fear', 'smileys', '怖い', 'scream'),
  entry('🤯', '頭が爆発する顔', 'exploding head', 'smileys', '驚き', 'mind blown'),
  entry('🤢', '吐き気を催す顔', 'nauseated face', 'smileys', '気持ち悪い', 'sick'),
  entry('🤮', '吐く顔', 'face vomiting', 'smileys', '嘔吐', 'vomit'),
  entry('😷', 'マスクをした顔', 'face with medical mask', 'smileys', 'マスク', 'mask'),
  entry('🤠', 'カウボーイハットの顔', 'cowboy hat face', 'smileys', '帽子', 'cowboy'),
  entry('🤖', 'ロボット', 'robot', 'smileys', '機械', 'robot'),
  entry('👻', 'おばけ', 'ghost', 'smileys', '幽霊', 'spooky'),
  entry('👽', '宇宙人', 'alien', 'smileys', 'エイリアン', 'space'),
  entry('💩', 'うんち', 'pile of poo', 'smileys', 'くそ', 'poop'),

  // People & body
  entry('👋', '手を振る', 'waving hand', 'people', '挨拶', 'hello', 'bye'),
  entry('🤚', '手の甲を上げる', 'raised back of hand', 'people', '手', 'hand'),
  entry('✋', '上げた手', 'raised hand', 'people', '手', 'stop'),
  entry('🖐️', '指を広げた手', 'hand with fingers splayed', 'people', '手', 'five'),
  entry('🤞', '指を交差した手', 'crossed fingers', 'people', '幸運', 'luck'),
  entry('✌️', 'Vサイン', 'victory hand', 'people', 'ピース', 'peace'),
  entry('🤟', '愛してるの手話', 'love-you gesture', 'people', '愛', 'ily'),
  entry('🤘', '角の指サイン', 'sign of the horns', 'people', 'ロック', 'rock'),
  entry('👌', 'OKサイン', 'OK hand', 'people', '了解', 'okay'),
  entry('🤏', 'つまむ手', 'pinching hand', 'people', '少し', 'pinch'),
  entry('👍', '親指を上げる', 'thumbs up', 'people', 'いいね', 'good', 'like'),
  entry('👎', '親指を下げる', 'thumbs down', 'people', 'だめ', 'bad', 'dislike'),
  entry('👏', '拍手', 'clapping hands', 'people', '拍手', 'applause'),
  entry('🙌', '両手を上げる', 'raising hands', 'people', '万歳', 'celebrate'),
  entry('🙏', '祈る手', 'folded hands', 'people', 'お願い', 'pray', 'thanks'),
  entry('💪', '力こぶ', 'flexed biceps', 'people', '筋肉', 'strong'),
  entry('🤝', '握手', 'handshake', 'people', '合意', 'deal'),
  entry('🫶', 'ハートの手', 'heart hands', 'people', '愛', 'heart'),
  entry('👀', '目', 'eyes', 'people', '見る', 'look'),
  entry('🧠', '脳', 'brain', 'people', '頭', 'mind'),
  entry('👶', '赤ちゃん', 'baby', 'people', '子ども', 'child'),
  entry('🧑', '大人', 'person', 'people', '人', 'adult'),
  entry('👩', '女性', 'woman', 'people', '人', 'female'),
  entry('👨', '男性', 'man', 'people', '人', 'male'),

  // Animals & nature
  entry('🐶', '犬の顔', 'dog face', 'animals', '犬', 'dog'),
  entry('🐱', '猫の顔', 'cat face', 'animals', '猫', 'cat'),
  entry('🐭', 'ネズミの顔', 'mouse face', 'animals', 'ねずみ', 'mouse'),
  entry('🐹', 'ハムスター', 'hamster', 'animals', '動物', 'pet'),
  entry('🐰', 'ウサギの顔', 'rabbit face', 'animals', 'うさぎ', 'rabbit'),
  entry('🦊', 'キツネ', 'fox', 'animals', 'きつね', 'fox'),
  entry('🐻', 'クマ', 'bear', 'animals', 'くま', 'bear'),
  entry('🐼', 'パンダ', 'panda', 'animals', '動物', 'panda'),
  entry('🐨', 'コアラ', 'koala', 'animals', '動物', 'koala'),
  entry('🐯', 'トラの顔', 'tiger face', 'animals', '虎', 'tiger'),
  entry('🦁', 'ライオン', 'lion', 'animals', '動物', 'lion'),
  entry('🐸', 'カエル', 'frog', 'animals', 'かえる', 'frog'),
  entry('🐵', 'サルの顔', 'monkey face', 'animals', '猿', 'monkey'),
  entry('🦄', 'ユニコーン', 'unicorn', 'animals', '幻想', 'fantasy'),
  entry('🐝', 'ミツバチ', 'honeybee', 'animals', '蜂', 'bee'),
  entry('🦋', 'チョウ', 'butterfly', 'animals', '蝶', 'insect'),
  entry('🐢', 'カメ', 'turtle', 'animals', '亀', 'turtle'),
  entry('🐍', 'ヘビ', 'snake', 'animals', '蛇', 'snake'),
  entry('🐙', 'タコ', 'octopus', 'animals', '海', 'octopus'),
  entry('🦑', 'イカ', 'squid', 'animals', '海', 'squid'),
  entry('🦀', 'カニ', 'crab', 'animals', '海', 'crab'),
  entry('🐠', '熱帯魚', 'tropical fish', 'animals', '魚', 'fish'),
  entry('🐬', 'イルカ', 'dolphin', 'animals', '海', 'dolphin'),
  entry('🐳', '潮を吹くクジラ', 'spouting whale', 'animals', 'くじら', 'whale'),
  entry('🌸', '桜', 'cherry blossom', 'animals', '花', 'spring'),
  entry('🌹', 'バラ', 'rose', 'animals', '花', 'flower'),
  entry('🌻', 'ひまわり', 'sunflower', 'animals', '花', 'flower'),
  entry('🌞', '顔つき太陽', 'sun with face', 'animals', '太陽', 'sun'),
  entry('⭐', '星', 'star', 'animals', '夜', 'favorite'),
  entry('🌈', '虹', 'rainbow', 'animals', '天気', 'weather'),
  entry('⚡', '稲妻', 'high voltage', 'animals', '雷', 'lightning'),
  entry('🔥', '炎', 'fire', 'animals', '火', 'hot'),
  entry('❄️', '雪の結晶', 'snowflake', 'animals', '雪', 'winter'),

  // Food & drink
  entry('🍎', '赤いリンゴ', 'red apple', 'food', '果物', 'apple'),
  entry('🍊', 'みかん', 'tangerine', 'food', '果物', 'orange'),
  entry('🍋', 'レモン', 'lemon', 'food', '果物', 'lemon'),
  entry('🍌', 'バナナ', 'banana', 'food', '果物', 'banana'),
  entry('🍉', 'スイカ', 'watermelon', 'food', '果物', 'melon'),
  entry('🍇', 'ブドウ', 'grapes', 'food', '果物', 'grape'),
  entry('🍓', 'イチゴ', 'strawberry', 'food', '果物', 'berry'),
  entry('🫐', 'ブルーベリー', 'blueberries', 'food', '果物', 'berry'),
  entry('🍒', 'サクランボ', 'cherries', 'food', '果物', 'cherry'),
  entry('🍑', '桃', 'peach', 'food', '果物', 'peach'),
  entry('🍍', 'パイナップル', 'pineapple', 'food', '果物', 'fruit'),
  entry('🍅', 'トマト', 'tomato', 'food', '野菜', 'vegetable'),
  entry('🥑', 'アボカド', 'avocado', 'food', '野菜', 'vegetable'),
  entry('🥕', 'ニンジン', 'carrot', 'food', '野菜', 'vegetable'),
  entry('🍞', 'パン', 'bread', 'food', '食事', 'bakery'),
  entry('🧀', 'チーズ', 'cheese wedge', 'food', '食事', 'cheese'),
  entry('🍔', 'ハンバーガー', 'hamburger', 'food', '食事', 'burger'),
  entry('🍕', 'ピザ', 'pizza', 'food', '食事', 'pizza'),
  entry('🍣', '寿司', 'sushi', 'food', '日本食', 'japanese'),
  entry('🍜', 'ラーメン', 'steaming bowl', 'food', '麺', 'noodles'),
  entry('🍙', 'おにぎり', 'rice ball', 'food', '日本食', 'rice'),
  entry('🍦', 'ソフトクリーム', 'soft ice cream', 'food', '甘い', 'dessert'),
  entry('🍩', 'ドーナツ', 'doughnut', 'food', '甘い', 'dessert'),
  entry('🍪', 'クッキー', 'cookie', 'food', '甘い', 'dessert'),
  entry('🎂', 'バースデーケーキ', 'birthday cake', 'food', '誕生日', 'cake'),
  entry('🍫', 'チョコレート', 'chocolate bar', 'food', '甘い', 'sweet'),
  entry('☕', 'ホットドリンク', 'hot beverage', 'food', '飲み物', 'coffee', 'tea'),
  entry('🍵', '湯飲み', 'teacup without handle', 'food', 'お茶', 'tea'),
  entry('🍺', 'ビール', 'beer mug', 'food', 'お酒', 'drink'),
  entry('🍷', 'ワイン', 'wine glass', 'food', 'お酒', 'drink'),

  // Travel & places
  entry('🚗', '自動車', 'automobile', 'travel', '車', 'car'),
  entry('🚕', 'タクシー', 'taxi', 'travel', '車', 'taxi'),
  entry('🚌', 'バス', 'bus', 'travel', '乗り物', 'transport'),
  entry('🚓', 'パトカー', 'police car', 'travel', '警察', 'car'),
  entry('🚑', '救急車', 'ambulance', 'travel', '病院', 'emergency'),
  entry('🚒', '消防車', 'fire engine', 'travel', '消防', 'emergency'),
  entry('🚲', '自転車', 'bicycle', 'travel', '乗り物', 'bike'),
  entry('✈️', '飛行機', 'airplane', 'travel', '空港', 'flight'),
  entry('🚀', 'ロケット', 'rocket', 'travel', '宇宙', 'space'),
  entry('🚢', '客船', 'passenger ship', 'travel', '船', 'ship'),
  entry('⚓', '錨', 'anchor', 'travel', '港', 'ship'),
  entry('🗺️', '世界地図', 'world map', 'travel', '地図', 'map'),
  entry('🏠', '家', 'house', 'travel', '建物', 'home'),
  entry('🏢', 'オフィスビル', 'office building', 'travel', '建物', 'office'),
  entry('🏫', '学校', 'school', 'travel', '建物', 'education'),
  entry('🏥', '病院', 'hospital', 'travel', '建物', 'medical'),
  entry('🏨', 'ホテル', 'hotel', 'travel', '宿泊', 'travel'),
  entry('⛺', 'テント', 'tent', 'travel', 'キャンプ', 'camping'),
  entry('🏖️', '砂浜', 'beach with umbrella', 'travel', '海', 'vacation'),
  entry('🗽', '自由の女神', 'Statue of Liberty', 'travel', '観光', 'landmark'),
  entry('🏰', '城', 'castle', 'travel', '観光', 'fairytale'),

  // Activities
  entry('⚽', 'サッカー', 'soccer ball', 'activities', 'スポーツ', 'football'),
  entry('🏀', 'バスケットボール', 'basketball', 'activities', 'スポーツ', 'sport'),
  entry('🏈', 'アメリカンフットボール', 'american football', 'activities', 'スポーツ', 'sport'),
  entry('⚾', '野球', 'baseball', 'activities', 'スポーツ', 'sport'),
  entry('🎾', 'テニス', 'tennis', 'activities', 'スポーツ', 'sport'),
  entry('🏐', 'バレーボール', 'volleyball', 'activities', 'スポーツ', 'sport'),
  entry('🏆', 'トロフィー', 'trophy', 'activities', '賞', 'winner'),
  entry('🥇', '金メダル', '1st place medal', 'activities', '賞', 'gold'),
  entry('🎯', '的', 'bullseye', 'activities', '目標', 'target'),
  entry('🎮', 'ゲームコントローラー', 'video game', 'activities', 'ゲーム', 'game'),
  entry('🎲', 'サイコロ', 'game die', 'activities', 'ゲーム', 'dice'),
  entry('🎨', 'パレット', 'artist palette', 'activities', '絵', 'art'),
  entry('🎬', 'カチンコ', 'clapper board', 'activities', '映画', 'movie'),
  entry('🎸', 'ギター', 'guitar', 'activities', '音楽', 'music'),
  entry('🎹', '鍵盤', 'musical keyboard', 'activities', '音楽', 'piano'),
  entry('🎺', 'トランペット', 'trumpet', 'activities', '音楽', 'music'),

  // Objects
  entry('👓', 'めがね', 'glasses', 'objects', '衣類', 'clothing'),
  entry('🕶️', 'サングラス', 'sunglasses', 'objects', '衣類', 'clothing'),
  entry('👔', 'ネクタイ', 'necktie', 'objects', '衣類', 'clothing'),
  entry('👗', 'ドレス', 'dress', 'objects', '衣類', 'clothing'),
  entry('👠', 'ハイヒール', 'high-heeled shoe', 'objects', '靴', 'shoes'),
  entry('👟', 'スニーカー', 'running shoe', 'objects', '靴', 'shoes'),
  entry('🎩', 'シルクハット', 'top hat', 'objects', '帽子', 'hat'),
  entry('💄', '口紅', 'lipstick', 'objects', '化粧', 'makeup'),
  entry('💍', '指輪', 'ring', 'objects', '宝石', 'jewelry'),
  entry('💎', '宝石', 'gem stone', 'objects', '宝石', 'jewel'),
  entry('🔇', 'ミュートスピーカー', 'muted speaker', 'objects', '音', 'sound'),
  entry('🔊', '大音量スピーカー', 'speaker high volume', 'objects', '音', 'sound'),
  entry('📢', '拡声器', 'loudspeaker', 'objects', '音', 'announcement'),
  entry('📣', 'メガホン', 'megaphone', 'objects', '音', 'announcement'),
  entry('🔔', 'ベル', 'bell', 'objects', '通知', 'notification'),
  entry('🎵', '音符', 'musical note', 'objects', '音楽', 'music'),
  entry('🎶', '複数の音符', 'musical notes', 'objects', '音楽', 'music'),
  entry('🎤', 'マイク', 'microphone', 'objects', '音楽', 'music'),
  entry('🎧', 'ヘッドホン', 'headphone', 'objects', '音楽', 'audio'),
  entry('📻', 'ラジオ', 'radio', 'objects', '音楽', 'audio'),
  entry('📱', '携帯電話', 'mobile phone', 'objects', '電話', 'phone'),
  entry('☎️', '電話', 'telephone', 'objects', '電話', 'phone'),
  entry('💻', 'ノートパソコン', 'laptop', 'objects', 'コンピューター', 'computer'),
  entry('🖥️', 'デスクトップパソコン', 'desktop computer', 'objects', 'コンピューター', 'computer'),
  entry('🖨️', 'プリンター', 'printer', 'objects', 'コンピューター', 'office'),
  entry('⌨️', 'キーボード', 'keyboard', 'objects', 'コンピューター', 'computer'),
  entry('🖱️', 'コンピューターマウス', 'computer mouse', 'objects', 'コンピューター', 'computer'),
  entry('📷', 'カメラ', 'camera', 'objects', '写真', 'photo'),
  entry('📸', 'フラッシュを焚いたカメラ', 'camera with flash', 'objects', '写真', 'photo'),
  entry('🎥', 'ビデオカメラ', 'movie camera', 'objects', '動画', 'video'),
  entry('📺', 'テレビ', 'television', 'objects', '動画', 'tv'),
  entry('🔍', '左向き虫眼鏡', 'magnifying glass tilted left', 'objects', '検索', 'search'),
  entry('🔦', '懐中電灯', 'flashlight', 'objects', '光', 'light'),
  entry('💡', '電球', 'light bulb', 'objects', '光', 'idea'),
  entry('📚', '複数の本', 'books', 'objects', '本', 'reading'),
  entry('📖', '開いた本', 'open book', 'objects', '本', 'reading'),
  entry('✏️', '鉛筆', 'pencil', 'objects', '文房具', 'stationery'),
  entry('📝', 'メモ', 'memo', 'objects', '文房具', 'note'),
  entry('📌', '押しピン', 'pushpin', 'objects', '文房具', 'pin'),
  entry('📎', 'クリップ', 'paperclip', 'objects', '文房具', 'office'),
  entry('✂️', 'はさみ', 'scissors', 'objects', '工具', 'cut'),
  entry('🔒', '閉じた錠', 'locked', 'objects', 'セキュリティ', 'security'),
  entry('🔑', '鍵', 'key', 'objects', 'セキュリティ', 'security'),
  entry('🔨', 'ハンマー', 'hammer', 'objects', '工具', 'tool'),
  entry('🧰', '工具箱', 'toolbox', 'objects', '工具', 'tool'),
  entry('⚙️', '歯車', 'gear', 'objects', '設定', 'settings'),
  entry('💊', '錠剤', 'pill', 'objects', '医療', 'medicine'),
  entry('🩺', '聴診器', 'stethoscope', 'objects', '医療', 'medical'),
  entry('🧪', '試験管', 'test tube', 'objects', '科学', 'science'),
  entry('🔬', '顕微鏡', 'microscope', 'objects', '科学', 'science'),
  entry('🛏️', 'ベッド', 'bed', 'objects', '家庭', 'home'),
  entry('🛒', 'ショッピングカート', 'shopping cart', 'objects', '買い物', 'shopping'),
  entry('🎁', 'プレゼント', 'wrapped gift', 'objects', '贈り物', 'gift'),
  entry('💰', 'お金の袋', 'money bag', 'objects', 'お金', 'money'),
  entry('💳', 'クレジットカード', 'credit card', 'objects', 'お金', 'payment'),
  entry('📦', '荷物', 'package', 'objects', '配送', 'shipping'),
  entry('✉️', '封筒', 'envelope', 'objects', 'メール', 'mail'),
  entry('🗑️', 'ゴミ箱', 'wastebasket', 'objects', '削除', 'delete'),

  // Symbols & flags
  entry('❤️', '赤いハート', 'red heart', 'symbols', '愛', 'love'),
  entry('🧡', 'オレンジ色のハート', 'orange heart', 'symbols', '愛', 'love'),
  entry('💛', '黄色いハート', 'yellow heart', 'symbols', '愛', 'love'),
  entry('💚', '緑のハート', 'green heart', 'symbols', '愛', 'love'),
  entry('💙', '青いハート', 'blue heart', 'symbols', '愛', 'love'),
  entry('💜', '紫のハート', 'purple heart', 'symbols', '愛', 'love'),
  entry('🖤', '黒いハート', 'black heart', 'symbols', '愛', 'love'),
  entry('🤍', '白いハート', 'white heart', 'symbols', '愛', 'love'),
  entry('💔', '割れたハート', 'broken heart', 'symbols', '失恋', 'sad'),
  entry('💯', '100点', 'hundred points', 'symbols', '満点', 'perfect'),
  entry('✅', 'チェックマークボタン', 'check mark button', 'symbols', '完了', 'done'),
  entry('❌', 'バツ印', 'cross mark', 'symbols', '間違い', 'no'),
  entry('⚠️', '警告', 'warning', 'symbols', '注意', 'caution'),
  entry('❗', '赤いビックリマーク', 'exclamation mark', 'symbols', '重要', 'important'),
  entry('❓', '赤いはてなマーク', 'question mark', 'symbols', '疑問', 'question'),
  entry('💬', '吹き出し', 'speech balloon', 'symbols', '会話', 'chat'),
  entry('💭', '思考の吹き出し', 'thought balloon', 'symbols', '考え', 'thought'),
  entry('🔴', '赤い丸', 'red circle', 'symbols', '色', 'red'),
  entry('🟢', '緑の丸', 'green circle', 'symbols', '色', 'green'),
  entry('🔵', '青い丸', 'blue circle', 'symbols', '色', 'blue'),
  entry('⚫', '黒い丸', 'black circle', 'symbols', '色', 'black'),
  entry('⚪', '白い丸', 'white circle', 'symbols', '色', 'white'),
  entry('▶️', '再生ボタン', 'play button', 'symbols', '再生', 'play'),
  entry('⏸️', '一時停止ボタン', 'pause button', 'symbols', '停止', 'pause'),
  entry('🔄', '反時計回りの矢印', 'counterclockwise arrows button', 'symbols', '更新', 'refresh'),
  entry('♻️', 'リサイクルマーク', 'recycling symbol', 'symbols', '環境', 'recycle'),
  entry('🇯🇵', '日本の国旗', 'flag: Japan', 'symbols', '日本', 'flag'),
  entry('🇺🇸', 'アメリカ合衆国の国旗', 'flag: United States', 'symbols', 'アメリカ', 'flag'),
  entry('🇬🇧', 'イギリスの国旗', 'flag: United Kingdom', 'symbols', 'イギリス', 'flag'),
  entry('🇨🇳', '中国の国旗', 'flag: China', 'symbols', '中国', 'flag'),
  entry('🇰🇷', '韓国の国旗', 'flag: South Korea', 'symbols', '韓国', 'flag'),
]

export const emojiCategories: readonly (EmojiCategory | 'all')[] = [
  'all',
  'smileys',
  'people',
  'animals',
  'food',
  'travel',
  'activities',
  'objects',
  'symbols',
]

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim()

export const filterEmojis = (
  entries: readonly EmojiEntry[],
  query: string,
  category: EmojiCategory | 'all',
) => {
  const normalizedQuery = normalize(query)
  return entries.filter((item) => {
    if (category !== 'all' && item.category !== category) return false
    if (!normalizedQuery) return true
    const searchable = [item.emoji, item.name.ja, item.name.en, ...item.keywords]
      .map(normalize)
      .join(' ')
    return searchable.includes(normalizedQuery)
  })
}

export const getEmojiCodePoints = (value: string) =>
  Array.from(value)
    .map((character) => `U+${character.codePointAt(0)?.toString(16).toUpperCase()}`)
    .join(' ')

export const getEmojiHtml = (value: string) =>
  Array.from(value)
    .map((character) => `&#x${character.codePointAt(0)?.toString(16)};`)
    .join('')

export const generateEmojis = (
  entries: readonly EmojiEntry[],
  count: number,
  random: () => number = Math.random,
) => {
  const total = Math.max(1, Math.min(30, Math.floor(count) || 1))
  if (entries.length === 0) return []
  return Array.from({ length: total }, () => entries[Math.floor(random() * entries.length)])
}
