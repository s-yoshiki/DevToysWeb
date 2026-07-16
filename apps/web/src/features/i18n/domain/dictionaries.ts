export const locales = ['ja', 'en'] as const
export type Locale = (typeof locales)[number]

const dictionaries = {
  ja: {
    appName: 'DevToys',
    tagline: '毎日の開発を、もっと軽やかに。',
    heroDescription: '14の小さな道具を、ひとつの静かで高速なワークスペースにまとめました。',
    allTools: 'すべてのツール',
    search: 'ツールを検索',
    input: '入力',
    output: '出力',
    copy: 'コピー',
    copied: 'コピーしました',
    clear: 'クリア',
    generate: '生成',
    run: '実行',
    theme: 'テーマ',
    language: '言語',
    categories: {
      converters: '変換',
      encoders: 'エンコード',
      formatters: '整形',
      generators: '生成',
      network: 'ネットワーク',
    },
  },
  en: {
    appName: 'DevToys',
    tagline: 'A focused toolkit for everyday development.',
    heroDescription: 'Fourteen focused utilities, collected in one calm and fast workspace.',
    allTools: 'All tools',
    search: 'Search tools',
    input: 'Input',
    output: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    clear: 'Clear',
    generate: 'Generate',
    run: 'Run',
    theme: 'Theme',
    language: 'Language',
    categories: {
      converters: 'Converters',
      encoders: 'Encode & decode',
      formatters: 'Formatters',
      generators: 'Generators',
      network: 'Network',
    },
  },
} as const

export const getDictionary = (locale: Locale) => dictionaries[locale]
export type Dictionary = ReturnType<typeof getDictionary>
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale)
