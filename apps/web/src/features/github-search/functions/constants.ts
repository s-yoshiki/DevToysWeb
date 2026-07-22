import type {
  GithubAccountType,
  GithubInclusion,
  GithubIssueState,
  GithubOwnerKind,
  GithubRepoField,
  GithubReviewState,
  GithubSearchType,
} from '@/features/github-search/functions/github-search'
import type { Bilingual } from '@/features/tools/components/search/types'

export const searchTypes: { value: GithubSearchType; label: Bilingual }[] = [
  { value: 'repositories', label: { ja: 'リポジトリ', en: 'Repositories' } },
  { value: 'code', label: { ja: 'コード', en: 'Code' } },
  { value: 'issues', label: { ja: 'Issue', en: 'Issues' } },
  { value: 'pullrequests', label: { ja: 'プルリク', en: 'Pull requests' } },
  { value: 'users', label: { ja: 'ユーザー', en: 'Users' } },
  { value: 'discussions', label: { ja: 'Discussion', en: 'Discussions' } },
]

export const ownerKinds: { value: GithubOwnerKind; label: Bilingual }[] = [
  { value: 'user', label: { ja: 'ユーザー', en: 'User' } },
  { value: 'org', label: { ja: 'Organization', en: 'Organization' } },
]

export const repoFields: { value: GithubRepoField; label: Bilingual }[] = [
  { value: '', label: { ja: 'すべて', en: 'Anywhere' } },
  { value: 'name', label: { ja: 'リポジトリ名', en: 'Name' } },
  { value: 'description', label: { ja: '説明', en: 'Description' } },
  { value: 'readme', label: { ja: 'README', en: 'README' } },
  { value: 'topics', label: { ja: 'トピック', en: 'Topics' } },
]

export const inclusions: { value: GithubInclusion; label: Bilingual }[] = [
  { value: 'default', label: { ja: '既定', en: 'Default' } },
  { value: 'exclude', label: { ja: '除外', en: 'Exclude' } },
  { value: 'only', label: { ja: 'のみ', en: 'Only' } },
]

export const issueStates: { value: GithubIssueState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any state' } },
  { value: 'open', label: { ja: 'オープン', en: 'Open' } },
  { value: 'closed', label: { ja: 'クローズ', en: 'Closed' } },
  { value: 'merged', label: { ja: 'マージ済み', en: 'Merged' } },
  { value: 'draft', label: { ja: 'ドラフト', en: 'Draft' } },
]

export const reviewStates: { value: GithubReviewState; label: Bilingual }[] = [
  { value: '', label: { ja: '指定しない', en: 'Any review' } },
  { value: 'none', label: { ja: 'レビューなし', en: 'No review' } },
  { value: 'required', label: { ja: 'レビュー待ち', en: 'Review required' } },
  { value: 'approved', label: { ja: '承認済み', en: 'Approved' } },
  { value: 'changes_requested', label: { ja: '変更要求', en: 'Changes requested' } },
]

export const accountTypes: { value: GithubAccountType; label: Bilingual }[] = [
  { value: '', label: { ja: 'すべて', en: 'Any account' } },
  { value: 'user', label: { ja: 'ユーザー', en: 'User' } },
  { value: 'org', label: { ja: 'Organization', en: 'Organization' } },
]
