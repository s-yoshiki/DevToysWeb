import assert from 'node:assert/strict'
import { test } from 'node:test'
import { extractMetadata, extractSignals } from './diagnostics.js'

const page = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Example &amp; Co</title>
  <meta name="description" content="A &quot;short&quot; description">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:title" content="OG title">
  <link rel="canonical" href="https://example.com/page">
  <style>h1 { color: red }</style>
</head>
<body>
  <h1>Only <em>heading</em></h1>
  <h2>Second</h2>
  <img src="a.png" alt="described">
  <img src="b.png">
  <a href="/inside">inside</a>
  <a href="https://other.example.org/out">outside</a>
  <script>document.querySelector('h1')</script>
</body>
</html>`

test('reads title, meta and canonical with entities decoded', () => {
  const metadata = extractMetadata(page)
  assert.equal(metadata.title, 'Example & Co')
  assert.equal(metadata.description, 'A "short" description')
  assert.equal(metadata.viewport, 'width=device-width, initial-scale=1')
  assert.equal(metadata['og:title'], 'OG title')
  assert.equal(metadata.canonical, 'https://example.com/page')
})

test('collects the structural signals an SEO audit needs', () => {
  const signals = extractSignals(page, 'https://example.com/page')
  assert.equal(signals.lang, 'ja')
  assert.equal(signals.charset, 'utf-8')
  assert.deepEqual(signals.h1, ['Only heading'])
  assert.deepEqual(signals.h2, ['Second'])
  assert.deepEqual(signals.images, { total: 2, missingAlt: 1 })
  assert.deepEqual(signals.links, { total: 2, external: 1, internal: 1 })
})

test('ignores markup inside script and style blocks', () => {
  const signals = extractSignals(page, 'https://example.com/page')
  assert.equal(signals.h1.length, 1)
  assert.ok(!signals.textLength.toString().startsWith('0'))
})

test('survives a page with no metadata at all', () => {
  const signals = extractSignals('<html><body></body></html>', 'not a url')
  assert.equal(signals.lang, null)
  assert.deepEqual(signals.h1, [])
  assert.deepEqual(signals.links, { total: 0, external: 0, internal: 0 })
})
