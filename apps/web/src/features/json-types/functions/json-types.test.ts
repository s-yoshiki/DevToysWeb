import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { generateTypeDefinitions, inferNode, mergeNodes } from './json-types'

const generate = (json: unknown, target: 'typescript' | 'go' | 'python', name = 'Root') =>
  generateTypeDefinitions(JSON.stringify(json), target, name)

describe('inferNode', () => {
  it('separates integers from floats', () => {
    assert.equal(inferNode(1).kind, 'integer')
    assert.equal(inferNode(1.5).kind, 'number')
  })

  it('merges array elements into a single shape', () => {
    const node = inferNode([{ a: 1 }, { a: 2, b: 'x' }])
    assert.equal(node.kind, 'array')
    const element = node.kind === 'array' ? node.element : null
    assert.equal(element?.kind, 'object')
    const fields = element?.kind === 'object' ? element.fields : []
    assert.deepEqual(
      fields.map((field) => [field.key, field.optional]),
      [
        ['a', false],
        ['b', true],
      ],
    )
  })

  it('widens an integer observed alongside a float', () => {
    assert.equal(mergeNodes(inferNode(1), inferNode(1.5)).kind, 'number')
  })

  it('unions genuinely different types', () => {
    assert.equal(mergeNodes(inferNode('a'), inferNode(1)).kind, 'union')
  })
})

describe('TypeScript output', () => {
  it('names nested objects after their key and declares them first', () => {
    const { output } = generate({ id: 1, profile: { city: 'Tokyo' } }, 'typescript')
    assert.match(output, /export interface Profile \{\n {2}city: string\n\}/)
    assert.match(output, /export interface Root \{/)
    assert.match(output, /profile: Profile/)
    assert.ok(output.indexOf('interface Profile') < output.indexOf('interface Root'))
  })

  it('disambiguates a nested key that collides with the root name', () => {
    const { output } = generate({ root: { a: 1 } }, 'typescript')
    assert.match(output, /export interface Root2 \{/)
  })

  it('singularises array element type names', () => {
    const { output } = generate({ users: [{ name: 'a' }] }, 'typescript')
    assert.match(output, /export interface User \{/)
    assert.match(output, /users: User\[\]/)
  })

  it('marks missing keys optional and nullable values as a union', () => {
    const { output } = generate({ items: [{ a: 1 }, { a: 1, b: null }] }, 'typescript')
    assert.match(output, /b\?: null/)
  })

  it('quotes keys that are not valid identifiers', () => {
    const { output } = generate({ 'content-type': 'json' }, 'typescript')
    assert.match(output, /"content-type": string/)
  })

  it('emits a type alias when the root is not an object', () => {
    const { output } = generate([1, 2, 3], 'typescript')
    assert.equal(output, 'export type Root = number[]')
  })
})

describe('Go output', () => {
  it('exports fields with json tags and upper-cases initialisms', () => {
    const { output } = generate({ id: 1, api_url: 'https://example.com' }, 'go')
    assert.match(output, /type Root struct \{/)
    assert.match(output, /ID\s+int64\s+`json:"id"`/)
    assert.match(output, /APIURL\s+string\s+`json:"api_url"`/)
  })

  it('uses a pointer and omitempty for optional fields', () => {
    const { output } = generate({ items: [{ a: 1 }, { a: 1, b: 'x' }] }, 'go')
    assert.match(output, /B\s+\*string\s+`json:"b,omitempty"`/)
  })

  it('maps floats and slices', () => {
    const { output } = generate({ ratio: 1.5, tags: ['a'] }, 'go')
    assert.match(output, /Ratio\s+float64/)
    assert.match(output, /Tags\s+\[\]string/)
  })
})

describe('Python output', () => {
  it('emits dataclasses with snake_case fields', () => {
    const { output } = generate({ userName: 'a', profile: { city: 'Tokyo' } }, 'python')
    assert.match(output, /@dataclass\nclass Profile:\n {4}city: str/)
    assert.match(output, /user_name: str/)
  })

  it('sorts optional fields last so defaults stay valid', () => {
    const { output } = generate({ items: [{ a: 1 }, { a: 1, b: 'x' }] }, 'python')
    const body = output.slice(output.indexOf('class Item:'))
    assert.ok(body.indexOf('a: int') < body.indexOf('b: str | None = None'))
  })

  it('includes the imports the output depends on', () => {
    const { output } = generate({ a: 1 }, 'python')
    assert.match(output, /from dataclasses import dataclass/)
  })
})

describe('generateTypeDefinitions', () => {
  it('returns an empty result for empty input', () => {
    assert.deepEqual(generateTypeDefinitions('   ', 'typescript', 'Root'), { output: '' })
  })

  it('reports a parse error instead of throwing', () => {
    const result = generateTypeDefinitions('{ oops', 'typescript', 'Root')
    assert.equal(result.output, '')
    assert.ok(result.error)
  })

  it('falls back to Root when the given name is unusable', () => {
    const { output } = generateTypeDefinitions('{"a":1}', 'typescript', '   ')
    assert.match(output, /export interface Root \{/)
  })

  it('reuses one type name for two identical shapes', () => {
    const { output } = generate({ from: { city: 'a' }, to: { city: 'b' } }, 'typescript')
    assert.equal(output.match(/export interface/g)?.length, 2)
  })
})
