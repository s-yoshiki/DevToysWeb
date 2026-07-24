'use client'

import { LoaderCircle, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/copy-button'
import { ErrorBanner } from '@/components/workspace-panes'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useWhois } from '../hooks/use-whois'

const summaryOrder = ['registrar', 'createdAt', 'updatedAt', 'expiresAt', 'status'] as const

export const WhoisWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const whois = useWhois()

  const summaryLabels: Record<(typeof summaryOrder)[number], string> = {
    registrar: t('レジストラ', 'Registrar'),
    createdAt: t('登録日', 'Created'),
    updatedAt: t('更新日', 'Updated'),
    expiresAt: t('有効期限', 'Expires'),
    status: t('ステータス', 'Status'),
  }

  return (
    <WorkspaceShell tool={tool} onClear={whois.clear}>
      <div className="space-y-4">
        <Card className="border-border/70">
          <CardContent className="space-y-3 p-5">
            <Label htmlFor="whois-domain">{t('ドメイン名', 'Domain name')}</Label>
            <div className="flex gap-2">
              <Input
                id="whois-domain"
                value={whois.domain}
                spellCheck={false}
                placeholder="example.com"
                onChange={(event) => whois.setDomain(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') whois.run()
                }}
                className="font-mono"
              />
              <Button onClick={whois.run} disabled={whois.loading || !whois.domain.trim()}>
                {whois.loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
                {t('照会', 'Look up')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                'IANAから各レジストリ・レジストラへ順に照会します。TLDによっては取得できる項目が異なります。',
                'The lookup follows referrals from IANA to the registry and registrar. Available fields vary by TLD.',
              )}
            </p>
          </CardContent>
        </Card>

        {whois.error && (
          <Card className="overflow-hidden border-border/70">
            <ErrorBanner message={whois.error} />
          </Card>
        )}

        {whois.report && (
          <>
            <Card className="overflow-hidden border-border/70">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b bg-muted/30 py-3">
                <CardTitle className="font-mono text-sm">{whois.report.domain}</CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  {whois.report.servers.map((server) => (
                    <Badge key={server} variant="outline" className="font-mono text-[11px]">
                      {server}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <dl className="divide-y">
                  {summaryOrder.map((key) => (
                    <div
                      key={key}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm"
                    >
                      <dt className="w-32 shrink-0 text-muted-foreground">{summaryLabels[key]}</dt>
                      <dd className="min-w-0 flex-1 break-words font-mono text-sm">
                        {whois.report?.summary[key] ?? '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/70">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-3">
                <CardTitle className="text-sm">{t('生レスポンス', 'Raw response')}</CardTitle>
                <CopyButton value={whois.report.raw} />
              </CardHeader>
              <CardContent className="p-0">
                <Textarea
                  readOnly
                  value={whois.report.raw}
                  aria-label={t('生レスポンス', 'Raw response')}
                  className="min-h-[28rem] resize-none rounded-none border-0 p-5 font-mono text-xs shadow-none focus-visible:ring-0"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </WorkspaceShell>
  )
}
