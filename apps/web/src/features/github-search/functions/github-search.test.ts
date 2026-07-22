import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildGithubSearchQuery,
  buildGithubSearchUrl,
  emptyGithubSearchCondition,
  type GithubSearchCondition,
} from './github-search'

const condition = (overrides: Partial<GithubSearchCondition>): GithubSearchCondition => ({
  ...emptyGithubSearchCondition,
  ...overrides,
})

describe('buildGithubSearchQuery', () => {
  it('returns an empty query for the empty condition', () => {
    assert.equal(buildGithubSearchQuery(emptyGithubSearchCondition), '')
  })

  it('combines word operators in form order', () => {
    assert.equal(
      buildGithubSearchQuery(
        condition({
          allWords: 'static site',
          exactPhrase: 'design system',
          anyWords: 'react vue',
          noneWords: 'template',
        }),
      ),
      'static site "design system" (react OR vue) -template',
    )
  })

  it('scopes by owner kind and groups multiple owners', () => {
    assert.equal(
      buildGithubSearchQuery(condition({ owner: 'vercel, facebook', ownerKind: 'org' })),
      '(org:vercel OR org:facebook)',
    )
    assert.equal(buildGithubSearchQuery(condition({ owner: 'torvalds' })), 'user:torvalds')
  })

  it('lets an explicit repository replace the owner qualifier', () => {
    assert.equal(
      buildGithubSearchQuery(condition({ repo: 'facebook/react', owner: 'vercel' })),
      'repo:facebook/react',
    )
  })

  it('expresses minimums as GitHub range qualifiers', () => {
    assert.equal(
      buildGithubSearchQuery(condition({ minStars: '100', minForks: '10' })),
      'stars:>=100 forks:>=10',
    )
    assert.equal(buildGithubSearchQuery(condition({ minStars: 'many' })), '')
  })

  it('adds repository qualifiers only for a repository search', () => {
    const repositories = condition({
      repoField: 'name',
      topic: 'design system',
      license: 'mit',
      archived: 'exclude',
      forks: 'only',
      pushedAfter: '2026-01-01',
    })
    assert.equal(
      buildGithubSearchQuery(repositories),
      'in:name topic:"design system" license:mit pushed:>=2026-01-01 archived:false fork:true',
    )
    assert.equal(buildGithubSearchQuery({ ...repositories, searchType: 'code' }), '')
  })

  it('adds code qualifiers only for a code search', () => {
    const code = condition({ searchType: 'code', path: 'src/**/*.ts', symbol: 'buildQuery' })
    assert.equal(buildGithubSearchQuery(code), 'path:src/**/*.ts symbol:buildQuery')
    assert.equal(buildGithubSearchQuery({ ...code, searchType: 'repositories' }), '')
  })

  it('adds issue qualifiers for issues and pull requests', () => {
    const issues = condition({
      searchType: 'issues',
      state: 'open',
      author: 'octocat',
      label: 'good first issue',
      minComments: '5',
    })
    assert.equal(
      buildGithubSearchQuery(issues),
      'is:open author:octocat label:"good first issue" comments:>=5',
    )
    assert.equal(
      buildGithubSearchQuery({ ...issues, searchType: 'pullrequests', review: 'required' }),
      'is:open author:octocat label:"good first issue" comments:>=5 review:required',
    )
  })

  it('adds user qualifiers without repeating the language qualifier', () => {
    assert.equal(
      buildGithubSearchQuery(
        condition({
          searchType: 'users',
          accountType: 'org',
          language: 'typescript',
          location: 'Tokyo',
          minFollowers: '100',
        }),
      ),
      'language:typescript type:org location:Tokyo followers:>=100',
    )
  })

  it('ignores the owner qualifier for a user search', () => {
    assert.equal(buildGithubSearchQuery(condition({ searchType: 'users', owner: 'vercel' })), '')
  })

  it('bounds the creation date from both sides', () => {
    assert.equal(
      buildGithubSearchQuery(
        condition({ allWords: 'x', createdAfter: '2026-01-01', createdBefore: '2026-06-30' }),
      ),
      'x created:>=2026-01-01 created:<=2026-06-30',
    )
  })
})

describe('buildGithubSearchUrl', () => {
  it('returns an empty string when there is no query', () => {
    assert.equal(buildGithubSearchUrl(emptyGithubSearchCondition), '')
  })

  it('encodes the query and carries the result type', () => {
    assert.equal(
      buildGithubSearchUrl(condition({ allWords: 'devtools', minStars: '500' })),
      'https://github.com/search?q=devtools+stars%3A%3E%3D500&type=repositories',
    )
  })

  it('switches the result type for pull requests', () => {
    assert.equal(
      buildGithubSearchUrl(condition({ searchType: 'pullrequests', state: 'merged' })),
      'https://github.com/search?q=is%3Amerged&type=pullrequests',
    )
  })
})
