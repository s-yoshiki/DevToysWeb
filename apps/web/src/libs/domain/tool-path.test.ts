import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { findTool } from './catalog'
import { getToolPath, isSamePath } from './tool-path'

describe('tool paths', () => {
  it('emits the trailing-slash URL used by the static export', () => {
    const tool = findTool('qr-code')
    assert.ok(tool)
    assert.equal(getToolPath('en', tool), '/en/generators/qr-code-generator/')
  })

  it('matches paths with or without a trailing slash', () => {
    assert.equal(
      isSamePath('/en/generators/qr-code-generator/', '/en/generators/qr-code-generator'),
      true,
    )
  })
})
