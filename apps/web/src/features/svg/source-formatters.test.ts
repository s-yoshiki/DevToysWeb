import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatCss, formatHtml, optimizeSvg, svgToDataUri } from './source-formatters'

describe('formatCss', () => {
  it('puts one declaration per line and indents the block', () => {
    assert.equal(
      formatCss('.a{color:red;background:blue}'),
      '.a {\n  color: red;\n  background: blue;\n}',
    )
  })

  it('nests at-rules', () => {
    const output = formatCss('@media (width>=48rem){.a{padding:1rem}}')
    assert.equal(output, '@media (width>=48rem) {\n  .a {\n    padding: 1rem;\n  }\n}')
  })

  it('leaves braces and semicolons inside strings alone', () => {
    const output = formatCss(`.a{content:"a;b{c}"}`)
    assert.ok(output.includes('content: "a;b{c}";'), output)
  })

  it('does not duplicate an existing trailing semicolon', () => {
    assert.ok(!formatCss('.a{color:red;}').includes(';;'))
  })
})

describe('formatHtml', () => {
  it('indents nested elements', () => {
    assert.equal(formatHtml('<ul><li>a</li></ul>'), '<ul>\n  <li>\n    a\n  </li>\n</ul>')
  })

  it('does not open an indent level for void elements', () => {
    assert.equal(formatHtml('<p><img src="a.png"><br>x</p>').split('\n').at(-1), '</p>')
  })

  it('keeps script contents verbatim', () => {
    const output = formatHtml('<script>if (a) { b() }</script>')
    assert.ok(output.includes('if (a) { b() }'), output)
  })

  it('preserves comments as single nodes', () => {
    assert.ok(formatHtml('<div><!-- keep me --></div>').includes('<!-- keep me -->'))
  })
})

describe('optimizeSvg', () => {
  const source = `<?xml version="1.0"?>
<!-- comment -->
<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
  <title>t</title>
  <metadata>m</metadata>
  <rect width="10" height="10" />
</svg>`

  it('drops the prolog, comments and editor metadata', () => {
    const output = optimizeSvg(source)
    assert.ok(!output.includes('<?xml'))
    assert.ok(!output.includes('<!--'))
    assert.ok(!output.includes('<metadata>'))
    assert.ok(!output.includes('<title>'))
  })

  it('keeps the drawing instructions', () => {
    assert.ok(optimizeSvg(source).includes('<rect width="10" height="10" />'))
  })

  it('rejects input that is not an SVG', () => {
    assert.throws(() => optimizeSvg('<div>hi</div>'), /svg/)
  })
})

describe('svgToDataUri', () => {
  it('percent-encodes without Base64 and keeps the payload readable', () => {
    const uri = svgToDataUri('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>')
    assert.ok(uri.startsWith('data:image/svg+xml,'))
    assert.ok(!uri.includes(';base64'))
    assert.ok(uri.includes("xmlns='http://www.w3.org/2000/svg'"), uri)
  })

  it('escapes the single quotes it would otherwise collide with', () => {
    assert.ok(svgToDataUri("<svg a='b'></svg>").includes('%27'))
  })
})
