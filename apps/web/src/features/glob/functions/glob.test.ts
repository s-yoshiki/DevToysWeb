import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { defaultGlobOptions, globToRegExp, matchPaths } from './glob'

const matches = (pattern: string, path: string, options = defaultGlobOptions) =>
  globToRegExp(pattern, options).test(path)

describe('globToRegExp', () => {
  it('keeps a single star inside one path segment', () => {
    assert.ok(matches('src/*.ts', 'src/index.ts'))
    assert.ok(!matches('src/*.ts', 'src/features/index.ts'))
  })

  it('crosses separators with a double star', () => {
    assert.ok(matches('src/**/*.ts', 'src/features/tools/catalog.ts'))
    assert.ok(matches('src/**/*.ts', 'src/index.ts'), 'a/**/b should also match a/b')
  })

  it('matches exactly one character for ?', () => {
    assert.ok(matches('a?.ts', 'ab.ts'))
    assert.ok(!matches('a?.ts', 'abc.ts'))
  })

  it('expands brace alternation', () => {
    assert.ok(matches('src/**/*.{ts,tsx}', 'src/a/b.tsx'))
    assert.ok(!matches('src/**/*.{ts,tsx}', 'src/a/b.js'))
  })

  it('supports negated character classes', () => {
    assert.ok(matches('file[!0-9].ts', 'filea.ts'))
    assert.ok(!matches('file[!0-9].ts', 'file1.ts'))
  })

  it('hides dotfiles unless the pattern opts in', () => {
    assert.ok(!matches('**/*.yml', '.github/workflows/deploy.yml'))
    assert.ok(
      matches('**/*.yml', '.github/workflows/deploy.yml', { ...defaultGlobOptions, dot: true }),
    )
    assert.ok(matches('.github/**/*.yml', '.github/workflows/deploy.yml'))
  })

  it('honours the case sensitivity flag', () => {
    assert.ok(!matches('src/*.TS', 'src/a.ts'))
    assert.ok(matches('src/*.TS', 'src/a.ts', { ...defaultGlobOptions, caseSensitive: false }))
  })

  it('treats regex metacharacters in the pattern as literals', () => {
    assert.ok(matches('a.b+c', 'a.b+c'))
    assert.ok(!matches('a.b+c', 'axbbc'))
  })

  it('reports unterminated syntax', () => {
    assert.throws(() => globToRegExp('src/[abc'), /\]/)
    assert.throws(() => globToRegExp('src/{a,b'), /\}/)
    assert.throws(() => globToRegExp('src/\\'), /backslash/)
  })
})

describe('matchPaths', () => {
  it('reports every candidate with its verdict, preserving order', () => {
    const result = matchPaths('src/**/*.ts', ['src/a.ts', 'docs/b.md'])
    assert.deepEqual(result, [
      { path: 'src/a.ts', matched: true },
      { path: 'docs/b.md', matched: false },
    ])
  })
})
