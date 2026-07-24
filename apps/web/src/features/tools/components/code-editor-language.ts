/**
 * Maps a converter's human-facing format label (e.g. `JSON`, `YAML`) to a
 * Monaco language id. Falls back to `plaintext` for anything without a grammar.
 */
const FORMAT_TO_LANGUAGE: Record<string, string> = {
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  html: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  sql: 'sql',
  toml: 'ini',
  ini: 'ini',
  markdown: 'markdown',
  md: 'markdown',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  shell: 'shell',
  bash: 'shell',
  python: 'python',
  go: 'go',
}

export const languageForFormat = (format: string): string =>
  FORMAT_TO_LANGUAGE[format.trim().toLowerCase()] ?? 'plaintext'
