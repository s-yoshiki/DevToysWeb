import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { tools } from './catalog'

const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' })
const graphemeCount = (value: string) => [...segmenter.segment(value)].length

describe('tool catalog', () => {
  /*
   * The sidebar renders `emoji` into a fixed 20px slot, so anything wider than
   * one grapheme spills over the tool name next to it.
   */
  it('gives every tool a single-grapheme emoji', () => {
    for (const tool of tools) {
      assert.equal(graphemeCount(tool.emoji), 1, `${tool.slug} has a multi-character emoji`)
    }
  })

  it('keeps slugs and paths unique', () => {
    const slugs = tools.map((tool) => tool.slug)
    const paths = tools.map((tool) => `${tool.category}/${tool.pathSlug}`)
    assert.equal(new Set(slugs).size, slugs.length)
    assert.equal(new Set(paths).size, paths.length)
  })

  it('supplies both locales for every tool', () => {
    for (const tool of tools) {
      assert.ok(tool.title.ja.length > 0, `${tool.slug} has no Japanese title`)
      assert.ok(tool.title.en.length > 0, `${tool.slug} has no English title`)
      assert.ok(tool.description.ja.length > 0, `${tool.slug} has no Japanese description`)
      assert.ok(tool.description.en.length > 0, `${tool.slug} has no English description`)
    }
  })

  it('uses lowercase kebab-case path slugs', () => {
    for (const tool of tools) {
      assert.match(tool.pathSlug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${tool.slug} has an odd path slug`)
    }
  })
})
