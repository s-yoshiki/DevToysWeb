import {
  Braces,
  CalendarClock,
  Code2,
  Fingerprint,
  Hash,
  KeyRound,
  Link2,
  LockKeyhole,
  type LucideIcon,
  Network,
  Sigma,
  Sparkles,
  TextQuote,
} from 'lucide-react'
import type { Locale } from '@/features/i18n/domain/dictionaries'

export type ToolCategory = 'converters' | 'encoders' | 'formatters' | 'generators' | 'network'
export type ToolDefinition = {
  slug: string
  pathSlug: string
  category: ToolCategory
  icon: LucideIcon
  title: Record<Locale, string>
  description: Record<Locale, string>
  mode: 'convert' | 'generate' | 'inspect'
}

export const tools: ToolDefinition[] = [
  {
    slug: 'yaml-json',
    pathSlug: 'yaml-to-json',
    category: 'converters',
    icon: Braces,
    title: { ja: 'YAML ↔ JSON', en: 'YAML ↔ JSON' },
    description: { ja: 'YAMLとJSONを相互変換', en: 'Convert between YAML and JSON' },
    mode: 'convert',
  },
  {
    slug: 'number-base',
    pathSlug: 'number-base-converter',
    category: 'converters',
    icon: Sigma,
    title: { ja: '基数変換', en: 'Number base' },
    description: { ja: '2〜36進数を自在に変換', en: 'Convert bases from 2 to 36' },
    mode: 'convert',
  },
  {
    slug: 'date-time',
    pathSlug: 'unix-time-converter',
    category: 'converters',
    icon: CalendarClock,
    title: { ja: '日時変換', en: 'Date & time' },
    description: { ja: '日時とUnix timeを変換', en: 'Convert dates and Unix time' },
    mode: 'convert',
  },
  {
    slug: 'base64',
    pathSlug: 'base64-encoder-decoder',
    category: 'encoders',
    icon: LockKeyhole,
    title: { ja: 'Base64', en: 'Base64' },
    description: { ja: 'UTF-8文字列を安全に変換', en: 'Encode and decode UTF-8 text' },
    mode: 'convert',
  },
  {
    slug: 'url',
    pathSlug: 'url-encoder-decoder',
    category: 'encoders',
    icon: Link2,
    title: { ja: 'URL', en: 'URL' },
    description: { ja: 'URLコンポーネントを変換', en: 'Encode and decode URL components' },
    mode: 'convert',
  },
  {
    slug: 'html',
    pathSlug: 'html-escape',
    category: 'encoders',
    icon: TextQuote,
    title: { ja: 'HTMLエスケープ', en: 'HTML escape' },
    description: { ja: 'HTML特殊文字をエスケープ', en: 'Escape HTML special characters' },
    mode: 'convert',
  },
  {
    slug: 'jwt',
    pathSlug: 'jwt-decoder',
    category: 'encoders',
    icon: KeyRound,
    title: { ja: 'JWT解析', en: 'JWT decoder' },
    description: { ja: 'JWTのheaderとpayloadを確認', en: 'Inspect JWT headers and payloads' },
    mode: 'inspect',
  },
  {
    slug: 'json-format',
    pathSlug: 'json-formatter',
    category: 'formatters',
    icon: Braces,
    title: { ja: 'JSON整形', en: 'JSON formatter' },
    description: { ja: 'JSONを読みやすく整形', en: 'Format and validate JSON' },
    mode: 'convert',
  },
  {
    slug: 'sql-format',
    pathSlug: 'sql-formatter',
    category: 'formatters',
    icon: Code2,
    title: { ja: 'SQL整形', en: 'SQL formatter' },
    description: { ja: 'SQLクエリを整形', en: 'Format SQL queries' },
    mode: 'convert',
  },
  {
    slug: 'xml-format',
    pathSlug: 'xml-formatter',
    category: 'formatters',
    icon: Code2,
    title: { ja: 'XML整形', en: 'XML formatter' },
    description: { ja: 'XMLを読みやすく整形', en: 'Format XML documents' },
    mode: 'convert',
  },
  {
    slug: 'uuid',
    pathSlug: 'uuid-generator',
    category: 'generators',
    icon: Fingerprint,
    title: { ja: 'UUID生成', en: 'UUID generator' },
    description: { ja: 'UUID v4をまとめて生成', en: 'Generate UUID v4 values' },
    mode: 'generate',
  },
  {
    slug: 'password',
    pathSlug: 'password-generator',
    category: 'generators',
    icon: Sparkles,
    title: { ja: 'パスワード生成', en: 'Password generator' },
    description: { ja: '安全なパスワードを生成', en: 'Generate secure passwords' },
    mode: 'generate',
  },
  {
    slug: 'hash',
    pathSlug: 'hash-generator',
    category: 'generators',
    icon: Hash,
    title: { ja: 'ハッシュ', en: 'Hash' },
    description: { ja: 'SHAハッシュを計算', en: 'Calculate SHA hashes' },
    mode: 'generate',
  },
  {
    slug: 'network-info',
    pathSlug: 'connection-info',
    category: 'network',
    icon: Network,
    title: { ja: 'ネットワーク情報', en: 'Network info' },
    description: { ja: 'ブラウザの接続情報を確認', en: 'Inspect browser network details' },
    mode: 'inspect',
  },
]

export const findTool = (slug: string) => tools.find((tool) => tool.slug === slug)
export const findToolByPath = (category: string, pathSlug: string) =>
  tools.find((tool) => tool.category === category && tool.pathSlug === pathSlug)
export const toolsByCategory = (category: ToolCategory) =>
  tools.filter((tool) => tool.category === category)
