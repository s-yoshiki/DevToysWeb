export type TestDataLocale = 'ja' | 'en'
export type OutputFormat = 'json' | 'csv' | 'tsv' | 'sql' | 'markdown'

/** Deterministic PRNG (mulberry32) so a given seed reproduces the same dataset. */
const createRng = (seed: number) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rng = () => number
const pick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)]
const int = (rng: Rng, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
const pad = (n: number, len: number) => String(n).padStart(len, '0')

type NameEntry = readonly [string, string, string]

const SURNAMES: readonly NameEntry[] = [
  ['佐藤', 'さとう', 'Sato'],
  ['鈴木', 'すずき', 'Suzuki'],
  ['高橋', 'たかはし', 'Takahashi'],
  ['田中', 'たなか', 'Tanaka'],
  ['伊藤', 'いとう', 'Ito'],
  ['渡辺', 'わたなべ', 'Watanabe'],
  ['山本', 'やまもと', 'Yamamoto'],
  ['中村', 'なかむら', 'Nakamura'],
  ['小林', 'こばやし', 'Kobayashi'],
  ['加藤', 'かとう', 'Kato'],
  ['吉田', 'よしだ', 'Yoshida'],
  ['山田', 'やまだ', 'Yamada'],
  ['佐々木', 'ささき', 'Sasaki'],
  ['山口', 'やまぐち', 'Yamaguchi'],
  ['松本', 'まつもと', 'Matsumoto'],
  ['井上', 'いのうえ', 'Inoue'],
  ['木村', 'きむら', 'Kimura'],
  ['林', 'はやし', 'Hayashi'],
  ['清水', 'しみず', 'Shimizu'],
  ['森', 'もり', 'Mori'],
] as const

const GIVEN_MALE: readonly NameEntry[] = [
  ['大翔', 'ひろと', 'Hiroto'],
  ['蓮', 'れん', 'Ren'],
  ['陽翔', 'はると', 'Haruto'],
  ['悠真', 'ゆうま', 'Yuma'],
  ['湊', 'みなと', 'Minato'],
  ['颯太', 'そうた', 'Sota'],
  ['樹', 'いつき', 'Itsuki'],
  ['翔', 'しょう', 'Sho'],
  ['健太', 'けんた', 'Kenta'],
  ['大和', 'やまと', 'Yamato'],
] as const

const GIVEN_FEMALE: readonly NameEntry[] = [
  ['陽菜', 'ひな', 'Hina'],
  ['凛', 'りん', 'Rin'],
  ['結衣', 'ゆい', 'Yui'],
  ['芽依', 'めい', 'Mei'],
  ['さくら', 'さくら', 'Sakura'],
  ['美咲', 'みさき', 'Misaki'],
  ['葵', 'あおい', 'Aoi'],
  ['楓', 'かえで', 'Kaede'],
  ['莉子', 'りこ', 'Riko'],
  ['優奈', 'ゆうな', 'Yuna'],
] as const

const GIVEN_EN_MALE = [
  'James',
  'John',
  'Robert',
  'Michael',
  'David',
  'William',
  'Richard',
  'Thomas',
]
const GIVEN_EN_FEMALE = [
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Susan',
  'Emily',
  'Olivia',
]
const SURNAMES_EN = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']

const PREFECTURES = [
  '北海道',
  '東京都',
  '神奈川県',
  '大阪府',
  '愛知県',
  '福岡県',
  '京都府',
  '兵庫県',
  '埼玉県',
  '千葉県',
  '静岡県',
  '広島県',
] as const

const CITIES = [
  '中央区',
  '港区',
  '緑区',
  '西区',
  '北区',
  '南区',
  '青葉区',
  '東区',
  '中区',
  '桜区',
] as const
const TOWNS = [
  '本町',
  '栄町',
  '桜ヶ丘',
  '大手町',
  '緑が丘',
  '旭町',
  '花園',
  '若葉',
  '朝日',
  '幸町',
] as const

const US_CITIES = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Seattle',
  'Boston',
  'Denver',
]
const US_STATES = ['NY', 'CA', 'IL', 'TX', 'AZ', 'WA', 'MA', 'CO']
const STREETS = [
  'Main St',
  'Oak Ave',
  'Park Rd',
  'Elm St',
  'Maple Ave',
  'Cedar Ln',
  'Pine St',
  'Lake Dr',
]

const COMPANY_PREFIX = ['株式会社', '有限会社', '合同会社'] as const
const COMPANY_CORE = [
  'テクノ',
  'グローバル',
  'ネクスト',
  'サンライズ',
  'みらい',
  'アルファ',
  'つばさ',
  'ひかり',
]
const COMPANY_SUFFIX = [
  'システムズ',
  'ソリューションズ',
  '工業',
  '商事',
  '製作所',
  'ラボ',
  'ワークス',
]
const COMPANY_EN = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Cyberdyne']
const COMPANY_EN_SUFFIX = ['Inc.', 'LLC', 'Corp.', 'Group', 'Systems', 'Labs']

const JOBS_JA = [
  'エンジニア',
  '営業',
  'デザイナー',
  'マネージャー',
  '事務',
  '企画',
  'マーケター',
  'コンサルタント',
]
const JOBS_EN = [
  'Engineer',
  'Sales',
  'Designer',
  'Manager',
  'Analyst',
  'Marketer',
  'Consultant',
  'Developer',
]
const DOMAINS = ['example.com', 'example.net', 'example.org', 'test.co.jp', 'sample.io', 'demo.dev']

const uuidFromRng = (rng: Rng): string => {
  const bytes = Array.from({ length: 16 }, () => int(rng, 0, 255))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex
    .slice(8, 10)
    .join('')}-${hex.slice(10, 16).join('')}`
}

export type FieldKey =
  | 'id'
  | 'uuid'
  | 'fullName'
  | 'fullNameKana'
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'email'
  | 'username'
  | 'phone'
  | 'postalCode'
  | 'prefecture'
  | 'address'
  | 'company'
  | 'jobTitle'
  | 'age'
  | 'birthday'
  | 'datetime'
  | 'boolean'
  | 'url'
  | 'ipv4'
  | 'price'
  | 'color'

export type FieldDef = {
  key: FieldKey
  label: { ja: string; en: string }
  gen: (rng: Rng, index: number, locale: TestDataLocale) => string | number | boolean
}

// A per-row identity, so name/kana/email stay consistent within a record.
const buildPerson = (rng: Rng, locale: TestDataLocale) => {
  const female = rng() < 0.5
  if (locale === 'ja') {
    const surname = pick(rng, SURNAMES)
    const given = pick(rng, female ? GIVEN_FEMALE : GIVEN_MALE)
    return {
      lastName: surname[0],
      firstName: given[0],
      fullName: `${surname[0]} ${given[0]}`,
      fullNameKana: `${surname[1]} ${given[1]}`,
      romaji: `${given[2]}.${surname[2]}`.toLowerCase(),
      gender: female ? '女性' : '男性',
    }
  }
  const surname = pick(rng, SURNAMES_EN)
  const first = pick(rng, female ? GIVEN_EN_FEMALE : GIVEN_EN_MALE)
  return {
    lastName: surname,
    firstName: first,
    fullName: `${first} ${surname}`,
    fullNameKana: `${first} ${surname}`,
    romaji: `${first}.${surname}`.toLowerCase(),
    gender: female ? 'Female' : 'Male',
  }
}

export const FIELD_DEFS: FieldDef[] = [
  { key: 'id', label: { ja: 'ID', en: 'ID' }, gen: (_r, i) => i + 1 },
  { key: 'uuid', label: { ja: 'UUID', en: 'UUID' }, gen: (r) => uuidFromRng(r) },
  {
    key: 'fullName',
    label: { ja: '氏名', en: 'Full name' },
    gen: (r, _i, l) => buildPerson(r, l).fullName,
  },
  {
    key: 'fullNameKana',
    label: { ja: '氏名カナ', en: 'Name (kana)' },
    gen: (r, _i, l) => buildPerson(r, l).fullNameKana,
  },
  {
    key: 'lastName',
    label: { ja: '姓', en: 'Last name' },
    gen: (r, _i, l) => buildPerson(r, l).lastName,
  },
  {
    key: 'firstName',
    label: { ja: '名', en: 'First name' },
    gen: (r, _i, l) => buildPerson(r, l).firstName,
  },
  {
    key: 'gender',
    label: { ja: '性別', en: 'Gender' },
    gen: (r, _i, l) => buildPerson(r, l).gender,
  },
  {
    key: 'email',
    label: { ja: 'メール', en: 'Email' },
    gen: (r, _i, l) => `${buildPerson(r, l).romaji}${int(r, 1, 99)}@${pick(r, DOMAINS)}`,
  },
  {
    key: 'username',
    label: { ja: 'ユーザー名', en: 'Username' },
    gen: (r, _i, l) => `${buildPerson(r, l).romaji.replace('.', '_')}${int(r, 1, 999)}`,
  },
  {
    key: 'phone',
    label: { ja: '電話番号', en: 'Phone' },
    gen: (r, _i, l) =>
      l === 'ja'
        ? `0${int(r, 70, 90)}-${pad(int(r, 0, 9999), 4)}-${pad(int(r, 0, 9999), 4)}`
        : `+1 (${int(r, 200, 999)}) ${pad(int(r, 0, 999), 3)}-${pad(int(r, 0, 9999), 4)}`,
  },
  {
    key: 'postalCode',
    label: { ja: '郵便番号', en: 'Postal code' },
    gen: (r, _i, l) =>
      l === 'ja'
        ? `${pad(int(r, 100, 999), 3)}-${pad(int(r, 0, 9999), 4)}`
        : pad(int(r, 10000, 99999), 5),
  },
  {
    key: 'prefecture',
    label: { ja: '都道府県', en: 'State' },
    gen: (r, _i, l) => (l === 'ja' ? pick(r, PREFECTURES) : pick(r, US_STATES)),
  },
  {
    key: 'address',
    label: { ja: '住所', en: 'Address' },
    gen: (r, _i, l) =>
      l === 'ja'
        ? `${pick(r, PREFECTURES)}${pick(r, CITIES)}${pick(r, TOWNS)}${int(r, 1, 9)}-${int(r, 1, 30)}-${int(r, 1, 20)}`
        : `${int(r, 1, 9999)} ${pick(r, STREETS)}, ${pick(r, US_CITIES)}`,
  },
  {
    key: 'company',
    label: { ja: '会社名', en: 'Company' },
    gen: (r, _i, l) =>
      l === 'ja'
        ? `${pick(r, COMPANY_PREFIX)}${pick(r, COMPANY_CORE)}${pick(r, COMPANY_SUFFIX)}`
        : `${pick(r, COMPANY_EN)} ${pick(r, COMPANY_EN_SUFFIX)}`,
  },
  {
    key: 'jobTitle',
    label: { ja: '職種', en: 'Job title' },
    gen: (r, _i, l) => (l === 'ja' ? pick(r, JOBS_JA) : pick(r, JOBS_EN)),
  },
  { key: 'age', label: { ja: '年齢', en: 'Age' }, gen: (r) => int(r, 18, 79) },
  {
    key: 'birthday',
    label: { ja: '生年月日', en: 'Birthday' },
    gen: (r) => `${int(r, 1955, 2006)}-${pad(int(r, 1, 12), 2)}-${pad(int(r, 1, 28), 2)}`,
  },
  {
    key: 'datetime',
    label: { ja: '日時', en: 'Datetime' },
    gen: (r) =>
      `${int(r, 2020, 2025)}-${pad(int(r, 1, 12), 2)}-${pad(int(r, 1, 28), 2)}T${pad(
        int(r, 0, 23),
        2,
      )}:${pad(int(r, 0, 59), 2)}:${pad(int(r, 0, 59), 2)}Z`,
  },
  { key: 'boolean', label: { ja: '真偽値', en: 'Boolean' }, gen: (r) => r() < 0.5 },
  {
    key: 'url',
    label: { ja: 'URL', en: 'URL' },
    gen: (r) =>
      `https://${pick(r, DOMAINS)}/${pick(r, ['users', 'posts', 'items', 'p'])}/${int(r, 1, 9999)}`,
  },
  {
    key: 'ipv4',
    label: { ja: 'IPアドレス', en: 'IPv4' },
    gen: (r) => `${int(r, 1, 223)}.${int(r, 0, 255)}.${int(r, 0, 255)}.${int(r, 1, 254)}`,
  },
  { key: 'price', label: { ja: '金額', en: 'Price' }, gen: (r) => int(r, 1, 200) * 100 },
  {
    key: 'color',
    label: { ja: 'カラー', en: 'Color' },
    gen: (r) => `#${int(r, 0, 0xffffff).toString(16).padStart(6, '0')}`,
  },
]

const fieldByKey = new Map(FIELD_DEFS.map((f) => [f.key, f]))

export type Row = Record<string, string | number | boolean>

export const generateRows = (
  keys: FieldKey[],
  count: number,
  locale: TestDataLocale,
  seed: number,
): Row[] => {
  const rng = createRng(seed)
  const rows: Row[] = []
  const n = Math.max(1, Math.min(count, 1000))
  for (let i = 0; i < n; i++) {
    const row: Row = {}
    for (const key of keys) {
      const def = fieldByKey.get(key)
      if (def) row[key] = def.gen(rng, i, locale)
    }
    rows.push(row)
  }
  return rows
}

// ---- Formatters ----

const csvCell = (value: string | number | boolean, delimiter: string) => {
  const s = String(value)
  return s.includes(delimiter) || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

const sqlValue = (value: string | number | boolean) => {
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  return `'${String(value).replace(/'/g, "''")}'`
}

export const formatRows = (rows: Row[], keys: FieldKey[], format: OutputFormat): string => {
  if (rows.length === 0 || keys.length === 0) return ''
  switch (format) {
    case 'json':
      return JSON.stringify(rows, null, 2)
    case 'csv':
    case 'tsv': {
      const d = format === 'csv' ? ',' : '\t'
      const header = keys.join(d)
      const body = rows.map((row) => keys.map((k) => csvCell(row[k], d)).join(d))
      return [header, ...body].join('\n')
    }
    case 'sql': {
      const cols = keys.map((k) => `\`${k}\``).join(', ')
      return rows
        .map(
          (row) =>
            `INSERT INTO test_data (${cols}) VALUES (${keys.map((k) => sqlValue(row[k])).join(', ')});`,
        )
        .join('\n')
    }
    case 'markdown': {
      const header = `| ${keys.join(' | ')} |`
      const divider = `| ${keys.map(() => '---').join(' | ')} |`
      const body = rows.map((row) => `| ${keys.map((k) => String(row[k])).join(' | ')} |`)
      return [header, divider, ...body].join('\n')
    }
  }
}
