'use client'

import { CopyButton } from '@/components/copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useUrlParser } from '../hooks/use-url-parser'

export const UrlParserWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const parser = useUrlParser()
  const { parts } = parser

  return (
    <WorkspaceShell tool={tool} onClear={parser.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardContent className="space-y-2 p-5">
            <Label htmlFor="url-input">URL</Label>
            <Input
              id="url-input"
              value={parser.input}
              onChange={(event) => parser.setInput(event.target.value)}
              className="font-mono"
              placeholder="https://example.com/path?key=value#hash"
            />
            {parser.error && <p className="text-sm text-destructive">{parser.error}</p>}
          </CardContent>
        </Card>

        {parts && (
          <>
            <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-medium">{t('構成要素', 'Components')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-px bg-border/60 p-0">
                <Row label="origin" value={parts.origin} />
                <Row label="protocol" value={parts.protocol} />
                <Row label="username" value={parts.username} />
                <Row label="password" value={parts.password} />
                <Row label="hostname" value={parts.hostname} />
                <Row label="port" value={parts.port} />
                <Row label="pathname" value={parts.pathname} />
                <Row label="search" value={parts.search} />
                <Row label="hash" value={parts.hash} />
              </CardContent>
            </Card>

            {parts.segments.length > 0 && (
              <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
                <CardHeader className="border-b bg-muted/30 py-4">
                  <CardTitle className="text-sm font-medium">
                    {t('パスセグメント', 'Path segments')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 p-5">
                  {parts.segments.map((segment, index) => (
                    <span
                      key={segment.key}
                      className="rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-sm"
                    >
                      <span className="mr-1.5 text-muted-foreground">{index}</span>
                      {segment.value}
                    </span>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-medium">
                  {t('クエリパラメータ', 'Query parameters')}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {parts.query.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {parts.query.length > 0 ? (
                  <div className="grid gap-px bg-border/60">
                    {parts.query.map((param) => (
                      <div
                        key={param.key}
                        className="flex items-center justify-between gap-3 bg-card px-5 py-2.5"
                      >
                        <span className="shrink-0 font-mono text-sm font-medium text-primary">
                          {param.name}
                        </span>
                        <div className="flex min-w-0 items-center gap-1">
                          <span className="truncate font-mono text-sm">{param.value}</span>
                          <CopyButton value={param.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-5 text-sm text-muted-foreground">
                    {t('クエリパラメータはありません', 'No query parameters')}
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </WorkspaceShell>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 bg-card px-5 py-2.5">
    <span className="shrink-0 font-mono text-sm text-muted-foreground">{label}</span>
    <div className="flex min-w-0 items-center gap-1">
      <span className="truncate font-mono text-sm">{value || '—'}</span>
      {value && <CopyButton value={value} />}
    </div>
  </div>
)
