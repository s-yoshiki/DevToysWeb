/** Left/right labels shown around the conversion arrow, keyed by tool slug. */
export const formatNames: Record<string, [string, string]> = {
  'yaml-json': ['YAML', 'JSON'],
  'json-csv': ['JSON', 'CSV'],
  'json-toml': ['JSON', 'TOML'],
  'json-xml': ['JSON', 'XML'],
  'date-time': ['ISO 8601', 'Unix time'],
  base64: ['Text', 'Base64'],
  url: ['Text', 'URL encoded'],
  html: ['HTML', 'Escaped HTML'],
  'json-format': ['JSON', 'Formatted JSON'],
  'sql-format': ['SQL', 'Formatted SQL'],
  'xml-format': ['XML', 'Formatted XML'],
  'yaml-format': ['YAML', 'Formatted YAML'],
  'css-format': ['CSS', 'Formatted CSS'],
  'html-format': ['HTML', 'Formatted HTML'],
  hash: ['Text', 'SHA-256'],
}

/** Tools whose transformation can also run backwards. */
export const reversibleSlugs = [
  'yaml-json',
  'json-csv',
  'json-toml',
  'json-xml',
  'date-time',
  'base64',
  'url',
  'html',
]

export const sampleInputs: Record<string, string> = {
  'yaml-json': `name: DevToys
features:
  - fast
  - private
enabled: true`,
  'json-csv': `[
  { "name": "Alice", "role": "Developer", "active": true },
  { "name": "Bob", "role": "Designer", "active": false }
]`,
  'json-toml': `{
  "package": { "name": "devtoys", "version": "1.0.0" },
  "features": ["convert", "format"]
}`,
  'json-xml': `{
  "project": {
    "@id": "devtoys",
    "name": "DevToys",
    "features": { "feature": ["convert", "format"] }
  }
}`,
  'number-base': '255',
  'date-time': '2026-07-16T12:00:00+09:00',
  base64: 'Hello, DevToys! こんにちは',
  url: 'https://example.com/search?q=DevToys&lang=ja',
  html: '<section class="hero">DevToys & Web</section>',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldlRveXMgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  'json-format': '{"name":"DevToys","version":1,"features":["format","convert"]}',
  'sql-format':
    'SELECT users.id, users.name FROM users WHERE users.active = true ORDER BY users.name;',
  'xml-format':
    '<project><name>DevToys</name><features><feature>format</feature><feature>convert</feature></features></project>',
  hash: 'Hello, DevToys!',
  'yaml-format': 'name:   DevToys\nfeatures: [format, convert]\nnested: {enabled: true}',
  'css-format':
    '.hero{color:#fff;background:#111}.hero h1{font-size:2rem;margin:0 0 1rem}@media (width>=48rem){.hero{padding:4rem}}',
  'html-format':
    '<section class="hero"><h1>DevToys</h1><p>Web tools</p><img src="a.png" alt=""><ul><li>one</li><li>two</li></ul></section>',
}
