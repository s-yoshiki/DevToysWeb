import assert from 'node:assert/strict'
import test from 'node:test'
import { type BadgeOptions, buildBadgeOutputs, buildBadgeUrl } from './badge'

const base: BadgeOptions = {
  provider: 'shields',
  label: 'build',
  message: 'passing',
  color: '#22c55e',
  labelColor: '',
  logo: 'github',
  logoColor: 'white',
  style: 'flat-square',
  link: 'https://example.com',
}

test('builds a Shields.io static badge URL and escapes literal dashes', () => {
  assert.equal(
    buildBadgeUrl({ ...base, label: 'CI-CD' }),
    'https://img.shields.io/badge/CI--CD-passing-22c55e?style=flat-square&logo=github&logoColor=white',
  )
})

test('builds a Badgen URL with supported options', () => {
  assert.equal(
    buildBadgeUrl({
      ...base,
      provider: 'badgen',
      label: 'test suite',
      labelColor: '#333333',
    }),
    'https://badgen.net/badge/test%20suite/passing/22c55e?icon=github&labelColor=333333',
  )
})

test('wraps Markdown and HTML output in the optional destination link', () => {
  const output = buildBadgeOutputs(base)
  assert.match(output.markdown, /^\[!\[build\]\(.+\)\]\(https:\/\/example.com\)$/)
  assert.match(output.html, /^<a href="https:\/\/example.com"><img .+ \/><\/a>$/)
})
