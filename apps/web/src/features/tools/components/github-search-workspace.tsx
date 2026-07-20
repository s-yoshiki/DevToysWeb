'use client'

import { useMemo, useState } from 'react'
import type { ToolDefinition } from '../domain/catalog'
import {
  buildGithubSearchQuery,
  buildGithubSearchUrl,
  emptyGithubSearchCondition,
  type GithubAccountType,
  type GithubInclusion,
  type GithubIssueState,
  type GithubOwnerKind,
  type GithubRepoField,
  type GithubReviewState,
  type GithubSearchCondition,
  type GithubSearchType,
} from '../domain/github-search'
import {
  type Bilingual,
  DateField,
  FiltersCard,
  NumberField,
  OptionGroup,
  SearchPreview,
  SectionHeading,
  SelectField,
  TextField,
  useTranslate,
} from './search-fields'
import { SpecializedShell } from './specialized-workspaces'

const searchTypes: { value: GithubSearchType; label: Bilingual }[] = [
  { value: 'repositories', label: { ja: 'リポジトリ', en: 'Repositories' } },
  { value: 'code', label: { ja: 'コード', en: 'Code' } },
  { value: 'issues', label: { ja: 'Issue', en: 'Issues' } },
  { value: 'pullrequests', label: { ja: 'プルリク', en: 'Pull requests' } },
  { value: 'users', label: { ja: 'ユーザー', en: 'Users' } },
  { value: 'discussions', label: { ja: 'Discussion', en: 'Discussions' } },
]

const ownerKinds: { value: GithubOwnerKind; label: Bilingual }[] = [
  { value: 'user', label: { ja: 'ユーザー', en: 'User' } },
  { value: 'org', label: { ja: 'Organization', en: 'Organization' } },
]

const repoFields: { value: GithubRepoField; label: Bilingual }[] = [
  { value: '', label: { ja: 'すべて', en: 'Anywhere' } },
  { value: 'name', label: { ja: 'リポジトリ名', en: 'Name' } },
  { value: 'description', label: { ja: '説明', en: 'Description' } },
  { value: 'readme', label: { ja: 'README', en: 'README' } },
  { value: 'topics', label: { ja: 'トピック', en: 'Topics' } },
]

const inclusions: { value: GithubInclusion; label: Bilingual }[] = [
  { value: 'default', label: { ja: '既定', en: 'Default' } },
  { value: 'exclude', label: { ja: '除外', en: 'Exclude' } },
  { value: 'only', label: { ja: 'のみ', en: 'Only' } },
]

const issueStates: { value: GithubIssueState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any state' } },
  { value: 'open', label: { ja: 'オープン', en: 'Open' } },
  { value: 'closed', label: { ja: 'クローズ', en: 'Closed' } },
  { value: 'merged', label: { ja: 'マージ済み', en: 'Merged' } },
  { value: 'draft', label: { ja: 'ドラフト', en: 'Draft' } },
]

const reviewStates: { value: GithubReviewState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any review' } },
  { value: 'none', label: { ja: 'レビューなし', en: 'No review' } },
  { value: 'required', label: { ja: 'レビュー待ち', en: 'Review required' } },
  { value: 'approved', label: { ja: '承認済み', en: 'Approved' } },
  { value: 'changes_requested', label: { ja: '変更要求', en: 'Changes requested' } },
]

const accountTypes: { value: GithubAccountType; label: Bilingual }[] = [
  { value: '', label: { ja: 'すべて', en: 'Any account' } },
  { value: 'user', label: { ja: 'ユーザー', en: 'User' } },
  { value: 'org', label: { ja: 'Organization', en: 'Organization' } },
]

export const GithubSearchWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const t = useTranslate()
  const [condition, setCondition] = useState<GithubSearchCondition>(emptyGithubSearchCondition)

  const set = <Key extends keyof GithubSearchCondition>(
    key: Key,
    value: GithubSearchCondition[Key],
  ) => setCondition((current) => ({ ...current, [key]: value }))

  const query = useMemo(() => buildGithubSearchQuery(condition), [condition])
  const url = useMemo(() => buildGithubSearchUrl(condition), [condition])

  const { searchType } = condition
  const isIssueSearch = searchType === 'issues' || searchType === 'pullrequests'

  return (
    <SpecializedShell tool={tool} onClear={() => setCondition(emptyGithubSearchCondition)}>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <FiltersCard>
          <section className="space-y-4">
            <SectionHeading>{t('検索対象', 'Search type')}</SectionHeading>
            <OptionGroup
              label={t('結果の種類', 'Result type')}
              value={searchType}
              options={searchTypes}
              onChange={(value) => set('searchType', value)}
            />
            <p className="text-xs text-muted-foreground">
              {t(
                '種類によって使える条件が変わるため、該当する項目だけを表示します',
                'GitHub accepts different qualifiers per type, so only the relevant fields are shown',
              )}
            </p>
          </section>
          <section className="space-y-4">
            <SectionHeading>{t('キーワード', 'Words')}</SectionHeading>
            <TextField
              id="gh-all-words"
              label={t('次のキーワードをすべて含む', 'All of these words')}
              placeholder={t('例: 静的サイト ジェネレーター', 'e.g. static site generator')}
              value={condition.allWords}
              onChange={(value) => set('allWords', value)}
            />
            <TextField
              id="gh-exact-phrase"
              label={t('次のフレーズを含む', 'This exact phrase')}
              placeholder={t('例: design system', 'e.g. design system')}
              value={condition.exactPhrase}
              onChange={(value) => set('exactPhrase', value)}
            />
            <TextField
              id="gh-any-words"
              label={t('次のキーワードのいずれかを含む', 'Any of these words')}
              placeholder={t('例: react vue', 'e.g. react vue')}
              value={condition.anyWords}
              onChange={(value) => set('anyWords', value)}
            />
            <TextField
              id="gh-none-words"
              label={t('次のキーワードを含まない', 'None of these words')}
              placeholder={t('例: template', 'e.g. template')}
              value={condition.noneWords}
              onChange={(value) => set('noneWords', value)}
            />
            {searchType === 'repositories' && (
              <SelectField
                id="gh-repo-field"
                label={t('キーワードの検索範囲', 'Search words in')}
                value={condition.repoField}
                options={repoFields}
                onChange={(value) => set('repoField', value)}
              />
            )}
          </section>
          {searchType !== 'users' && (
            <section className="space-y-4">
              <SectionHeading>{t('対象の絞り込み', 'Scope')}</SectionHeading>
              <OptionGroup
                inline
                label={t('所有者の種類', 'Owner type')}
                value={condition.ownerKind}
                options={ownerKinds}
                onChange={(value) => set('ownerKind', value)}
              />
              <TextField
                id="gh-owner"
                label={t('所有者', 'Owner')}
                placeholder="vercel"
                hint={t(
                  '複数はスペースかカンマで区切り、いずれかに一致します',
                  'Separate multiple owners with spaces or commas',
                )}
                value={condition.owner}
                onChange={(value) => set('owner', value)}
              />
              <TextField
                id="gh-repo"
                label={t('リポジトリ', 'Repository')}
                placeholder="facebook/react"
                hint={t(
                  '指定すると所有者より優先されます',
                  'Takes precedence over the owner when set',
                )}
                value={condition.repo}
                onChange={(value) => set('repo', value)}
              />
              {searchType !== 'discussions' && (
                <TextField
                  id="gh-language"
                  label={t('言語', 'Language')}
                  placeholder="typescript"
                  value={condition.language}
                  onChange={(value) => set('language', value)}
                />
              )}
            </section>
          )}
          {searchType === 'repositories' && (
            <section className="space-y-4">
              <SectionHeading>{t('リポジトリの条件', 'Repository filters')}</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="gh-min-stars"
                  label={t('スターの最小数', 'Minimum stars')}
                  placeholder="100"
                  value={condition.minStars}
                  onChange={(value) => set('minStars', value)}
                />
                <NumberField
                  id="gh-min-forks"
                  label={t('フォークの最小数', 'Minimum forks')}
                  placeholder="10"
                  value={condition.minForks}
                  onChange={(value) => set('minForks', value)}
                />
              </div>
              <TextField
                id="gh-topic"
                label={t('トピック', 'Topic')}
                placeholder="design-system"
                value={condition.topic}
                onChange={(value) => set('topic', value)}
              />
              <TextField
                id="gh-license"
                label={t('ライセンス', 'License')}
                placeholder="mit"
                value={condition.license}
                onChange={(value) => set('license', value)}
              />
              <DateField
                id="gh-pushed-after"
                label={t('最終更新がこの日以降', 'Pushed after')}
                value={condition.pushedAfter}
                onChange={(value) => set('pushedAfter', value)}
              />
              <OptionGroup
                inline
                label={t('アーカイブ済み', 'Archived')}
                value={condition.archived}
                options={inclusions}
                onChange={(value) => set('archived', value)}
              />
              <OptionGroup
                inline
                label={t('フォーク', 'Forks')}
                value={condition.forks}
                options={inclusions}
                onChange={(value) => set('forks', value)}
              />
            </section>
          )}
          {searchType === 'code' && (
            <section className="space-y-4">
              <SectionHeading>{t('コードの条件', 'Code filters')}</SectionHeading>
              <TextField
                id="gh-path"
                label={t('パス', 'Path')}
                placeholder="src/**/*.ts"
                hint={t(
                  'globが使えるため、拡張子の絞り込みもここで指定します',
                  'Globs are supported, so filter by extension here too',
                )}
                value={condition.path}
                onChange={(value) => set('path', value)}
              />
              <TextField
                id="gh-symbol"
                label={t('シンボル名', 'Symbol')}
                placeholder="buildQuery"
                hint={t(
                  '関数やクラスなどの定義名に一致します',
                  'Matches definitions such as functions and classes',
                )}
                value={condition.symbol}
                onChange={(value) => set('symbol', value)}
              />
            </section>
          )}
          {isIssueSearch && (
            <section className="space-y-4">
              <SectionHeading>
                {t('IssueとPRの条件', 'Issue and pull request filters')}
              </SectionHeading>
              <SelectField
                id="gh-state"
                label={t('状態', 'State')}
                value={condition.state}
                options={issueStates}
                onChange={(value) => set('state', value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="gh-author"
                  label={t('作成者', 'Author')}
                  placeholder="octocat"
                  value={condition.author}
                  onChange={(value) => set('author', value)}
                />
                <TextField
                  id="gh-assignee"
                  label={t('担当者', 'Assignee')}
                  placeholder="octocat"
                  value={condition.assignee}
                  onChange={(value) => set('assignee', value)}
                />
              </div>
              <TextField
                id="gh-mentions"
                label={t('メンションされている', 'Mentions')}
                placeholder="octocat"
                value={condition.mentions}
                onChange={(value) => set('mentions', value)}
              />
              <TextField
                id="gh-label"
                label={t('ラベル', 'Label')}
                placeholder="good first issue"
                value={condition.label}
                onChange={(value) => set('label', value)}
              />
              <TextField
                id="gh-milestone"
                label={t('マイルストーン', 'Milestone')}
                placeholder="v2.0"
                value={condition.milestone}
                onChange={(value) => set('milestone', value)}
              />
              <NumberField
                id="gh-min-comments"
                label={t('コメントの最小数', 'Minimum comments')}
                placeholder="5"
                value={condition.minComments}
                onChange={(value) => set('minComments', value)}
              />
              {searchType === 'pullrequests' && (
                <SelectField
                  id="gh-review"
                  label={t('レビュー状態', 'Review state')}
                  value={condition.review}
                  options={reviewStates}
                  onChange={(value) => set('review', value)}
                />
              )}
            </section>
          )}
          {searchType === 'discussions' && (
            <section className="space-y-4">
              <SectionHeading>{t('Discussionの条件', 'Discussion filters')}</SectionHeading>
              <TextField
                id="gh-discussion-author"
                label={t('作成者', 'Author')}
                placeholder="octocat"
                value={condition.author}
                onChange={(value) => set('author', value)}
              />
            </section>
          )}
          {searchType === 'users' && (
            <section className="space-y-4">
              <SectionHeading>{t('ユーザーの条件', 'User filters')}</SectionHeading>
              <SelectField
                id="gh-account-type"
                label={t('アカウントの種類', 'Account type')}
                value={condition.accountType}
                options={accountTypes}
                onChange={(value) => set('accountType', value)}
              />
              <TextField
                id="gh-user-language"
                label={t('主な言語', 'Language')}
                placeholder="typescript"
                value={condition.language}
                onChange={(value) => set('language', value)}
              />
              <TextField
                id="gh-location"
                label={t('場所', 'Location')}
                placeholder="Tokyo"
                value={condition.location}
                onChange={(value) => set('location', value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="gh-min-followers"
                  label={t('フォロワーの最小数', 'Minimum followers')}
                  placeholder="100"
                  value={condition.minFollowers}
                  onChange={(value) => set('minFollowers', value)}
                />
                <NumberField
                  id="gh-min-repos"
                  label={t('リポジトリの最小数', 'Minimum repositories')}
                  placeholder="10"
                  value={condition.minRepos}
                  onChange={(value) => set('minRepos', value)}
                />
              </div>
            </section>
          )}
          <section className="space-y-4">
            <SectionHeading>{t('作成日', 'Creation date')}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="gh-created-after"
                label={t('次の日付以降', 'After date')}
                value={condition.createdAfter}
                onChange={(value) => set('createdAfter', value)}
              />
              <DateField
                id="gh-created-before"
                label={t('次の日付以前', 'Before date')}
                value={condition.createdBefore}
                onChange={(value) => set('createdBefore', value)}
              />
            </div>
          </section>
        </FiltersCard>
        <SearchPreview
          query={query}
          url={url}
          queryId="gh-query"
          actionLabel={t('GitHubで検索', 'Search on GitHub')}
        />
      </div>
    </SpecializedShell>
  )
}
