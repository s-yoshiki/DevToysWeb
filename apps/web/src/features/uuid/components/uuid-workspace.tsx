'use client'

import { RefreshCw } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { useLocale } from '@/components/locale-provider'
import { SegmentedControl, ToggleRow } from '@/components/segmented-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import type { NamedUuidVersion, NamespacePreset, UuidVersion } from '../functions/uuid'
import { useUuid } from '../hooks/use-uuid'

export const UuidWorkspace = ({ tool }: WorkspaceProps) => {
  const { dictionary } = useLocale()
  const t = useTranslate()
  const uuid = useUuid()

  return (
    <WorkspaceShell tool={tool} onClear={uuid.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">
                {t('生成設定', 'Generator settings')}
              </CardTitle>
              <Button size="sm" onClick={uuid.regenerate}>
                <RefreshCw className="size-4" />
                {t('再生成', 'Regenerate')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>{t('形式', 'Format')}</Label>
                <SegmentedControl<UuidVersion>
                  value={uuid.version}
                  onChange={uuid.changeVersion}
                  label={t('形式', 'Format')}
                  options={[
                    { value: 'v4', label: 'UUID v4' },
                    { value: 'v7', label: 'UUID v7' },
                    { value: 'v1', label: 'UUID v1' },
                    { value: 'ulid', label: 'ULID' },
                    { value: 'nil', label: 'Nil' },
                    { value: 'max', label: 'Max' },
                  ]}
                />
                <p className="text-xs text-muted-foreground">{versionHint(uuid.version, t)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uuid-count">{t('個数', 'Count')}</Label>
                <Input
                  id="uuid-count"
                  type="number"
                  min={1}
                  max={1000}
                  value={uuid.count}
                  onChange={(event) => uuid.changeCount(Number(event.target.value))}
                />
              </div>
              <div className="flex flex-col justify-end gap-3 pb-1">
                <ToggleRow
                  id="uuid-uppercase"
                  label={t('大文字', 'Uppercase')}
                  checked={uuid.uppercase}
                  onChange={uuid.setUppercase}
                />
                {!uuid.isUlid && (
                  <ToggleRow
                    id="uuid-hyphens"
                    label={t('ハイフンを含める', 'Include hyphens')}
                    checked={uuid.hyphens}
                    onChange={uuid.setHyphens}
                  />
                )}
              </div>
            </div>
            <div className="flex h-11 items-center justify-between border-b px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.output}
                <span className="ml-2 font-mono normal-case tracking-normal text-muted-foreground/70">
                  {uuid.list.length}
                </span>
              </span>
              <CopyButton value={uuid.output} />
            </div>
            <ul className="max-h-[420px] divide-y divide-border/60 overflow-auto bg-muted/10">
              {uuid.list.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 px-5 py-2 font-mono text-sm"
                >
                  <span className="truncate">{item.value}</span>
                  <CopyButton value={item.value} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">
              {t('名前ベース (v3・v5)', 'Name-based (v3 & v5)')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('バージョン', 'Version')}</Label>
                <SegmentedControl<NamedUuidVersion>
                  value={uuid.namedVersion}
                  onChange={uuid.setNamedVersion}
                  label={t('バージョン', 'Version')}
                  options={[
                    { value: 'v5', label: 'v5 (SHA-1)' },
                    { value: 'v3', label: 'v3 (MD5)' },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('名前空間', 'Namespace')}</Label>
                <SegmentedControl<NamespacePreset>
                  value={uuid.preset}
                  onChange={uuid.setPreset}
                  label={t('名前空間', 'Namespace')}
                  options={[
                    { value: 'dns', label: 'DNS' },
                    { value: 'url', label: 'URL' },
                    { value: 'oid', label: 'OID' },
                    { value: 'x500', label: 'X500' },
                    { value: 'custom', label: t('カスタム', 'Custom') },
                  ]}
                />
              </div>
            </div>
            {uuid.preset === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="uuid-namespace">{t('名前空間 UUID', 'Namespace UUID')}</Label>
                <Input
                  id="uuid-namespace"
                  value={uuid.customNamespace}
                  onChange={(event) => uuid.setCustomNamespace(event.target.value)}
                  className="font-mono"
                  placeholder="6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="uuid-name">{t('名前', 'Name')}</Label>
              <Input
                id="uuid-name"
                value={uuid.name}
                onChange={(event) => uuid.setName(event.target.value)}
                className="font-mono"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
              {uuid.namedResult.error ? (
                <span className="font-mono text-sm text-destructive">
                  {t('名前空間 UUID が不正です', 'Invalid namespace UUID')}
                </span>
              ) : (
                <span className="truncate font-mono text-sm">{uuid.namedResult.value}</span>
              )}
              <CopyButton value={uuid.namedResult.value} />
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}

const versionHint = (version: UuidVersion, t: (ja: string, en: string) => string) => {
  switch (version) {
    case 'v4':
      return t(
        'ランダムな122ビット。最も一般的な形式。',
        'Random 122 bits. The most common format.',
      )
    case 'v7':
      return t(
        'Unixミリ秒のタイムスタンプ順にソート可能。',
        'Sortable by embedded Unix-millisecond timestamp.',
      )
    case 'v1':
      return t('タイムスタンプとノードに基づく形式。', 'Timestamp and node based.')
    case 'ulid':
      return t(
        '26文字・Crockford Base32。生成順にソート可能。',
        '26-char Crockford Base32, sortable by creation time.',
      )
    case 'nil':
      return t('すべて0の特殊なUUID。', 'The all-zero special UUID.')
    case 'max':
      return t('すべてfの特殊なUUID。', 'The all-f special UUID.')
  }
}
