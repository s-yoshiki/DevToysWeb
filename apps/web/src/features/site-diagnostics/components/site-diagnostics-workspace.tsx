'use client'

import { LoaderCircle, Play, ShieldCheck, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { useSiteDiagnostics } from '../hooks/use-site-diagnostics'
import { type FullSiteReport, isOk, type Settled, type TlsCertificate } from '../types'

export const SiteDiagnosticsWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const diagnostics = useSiteDiagnostics()
  const { report } = diagnostics

  return (
    <WorkspaceShell tool={tool} onClear={diagnostics.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardContent className="space-y-2 p-5">
            <Label htmlFor="diagnostics-url">URL / domain</Label>
            <div className="flex gap-2">
              <Input
                id="diagnostics-url"
                value={diagnostics.url}
                onChange={(event) => diagnostics.setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') diagnostics.run()
                }}
                className="font-mono"
                placeholder="https://example.com"
              />
              <Button
                onClick={diagnostics.run}
                disabled={diagnostics.loading || !diagnostics.url.trim()}
              >
                {diagnostics.loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {t('診断', 'Inspect')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                'DNS、HTTP、TLS証明書、セキュリティヘッダー、ページ情報をまとめて確認します。',
                'Inspect DNS, HTTP, TLS, security headers and page metadata.',
              )}
            </p>
            {diagnostics.error && (
              <p className="pt-1 text-sm text-destructive">{diagnostics.error}</p>
            )}
          </CardContent>
        </Card>

        {report && <Report report={report} t={t} />}
      </div>
    </WorkspaceShell>
  )
}

type T = (ja: string, en: string) => string

const Report = ({ report, t }: { report: FullSiteReport; t: T }) => (
  <>
    <Section title={t('概要', 'Overview')}>
      <KV label={t('対象', 'Target')} value={report.target} />
      <KV label={t('最終URL', 'Final URL')} value={report.http.finalUrl} />
      <div className="flex items-center justify-between gap-3 bg-card px-5 py-3">
        <span className="text-sm text-muted-foreground">{t('ステータス', 'Status')}</span>
        <StatusPill status={report.http.status} />
      </div>
      <KV label={t('応答時間', 'Response time')} value={`${report.http.durationMs} ms`} />
      <KV label={t('リダイレクト', 'Redirects')} value={String(report.http.redirects.length)} />
    </Section>

    {report.http.redirects.length > 0 && (
      <Section title={t('リダイレクト経路', 'Redirect chain')}>
        <ul className="space-y-1 bg-card px-5 py-3 font-mono text-xs">
          {report.http.redirects.map((url, index) => (
            <li key={url} className="truncate">
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {url}
            </li>
          ))}
        </ul>
      </Section>
    )}

    <Section title="DNS">
      <DnsRow label="A" record={report.dns.a} render={(v) => v} />
      <DnsRow label="AAAA" record={report.dns.aaaa} render={(v) => v} />
      <DnsRow label="CNAME" record={report.dns.cname} render={(v) => v} />
      <DnsRow
        label="MX"
        record={report.dns.mx}
        render={(v) => v.map((mx) => `${mx.priority} ${mx.exchange}`)}
      />
      <DnsRow
        label="TXT"
        record={report.dns.txt}
        render={(v) => v.map((parts) => parts.join(''))}
      />
      <DnsRow label="NS" record={report.dns.ns} render={(v) => v} />
    </Section>

    <TlsSection tls={report.tls} t={t} />

    <Section title={t('セキュリティヘッダー', 'Security headers')}>
      {Object.entries(report.http.securityHeaders).map(([name, value]) => (
        <div key={name} className="flex items-start justify-between gap-3 bg-card px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {value ? (
              <ShieldCheck className="size-4 shrink-0 text-success" />
            ) : (
              <ShieldX className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate font-mono text-xs">{name}</span>
          </div>
          <span
            className={cn(
              'max-w-[55%] truncate text-right text-xs',
              value ? 'font-mono' : 'text-muted-foreground',
            )}
          >
            {value ?? t('未設定', 'not set')}
          </span>
        </div>
      ))}
    </Section>

    <PageSection page={report.page} t={t} />

    <Section title={t('コンテンツ', 'Content signals')}>
      <KV label={t('言語', 'Language')} value={report.signals.lang ?? '—'} />
      <KV label={t('文字コード', 'Charset')} value={report.signals.charset ?? '—'} />
      <KV label="H1 / H2" value={`${report.signals.h1.length} / ${report.signals.h2.length}`} />
      <KV
        label={t('画像 (alt欠落)', 'Images (missing alt)')}
        value={`${report.signals.images.total} (${report.signals.images.missingAlt})`}
      />
      <KV
        label={t('リンク (外部/内部)', 'Links (ext/int)')}
        value={`${report.signals.links.total} (${report.signals.links.external}/${report.signals.links.internal})`}
      />
      <KV
        label={t('本文文字数', 'Text length')}
        value={report.signals.textLength.toLocaleString()}
      />
    </Section>
  </>
)

const StatusPill = ({ status }: { status: number }) => {
  const tone =
    status >= 200 && status < 300
      ? 'bg-success/15 text-success'
      : status >= 300 && status < 400
        ? 'bg-primary/15 text-primary'
        : 'bg-destructive/15 text-destructive'
  return (
    <span className={cn('rounded px-2 py-0.5 font-mono text-sm font-medium', tone)}>{status}</span>
  )
}

const TlsSection = ({ tls, t }: { tls: Settled<TlsCertificate | null>; t: T }) => {
  if (!isOk(tls)) {
    return (
      <Section title="TLS">
        <p className="bg-card px-5 py-3 text-sm text-destructive">{tls.error}</p>
      </Section>
    )
  }
  if (tls.value === null) {
    return (
      <Section title="TLS">
        <p className="bg-card px-5 py-3 text-sm text-muted-foreground">
          {t(
            'HTTPS ではないため TLS 情報はありません',
            'No TLS — the target is not served over HTTPS',
          )}
        </p>
      </Section>
    )
  }
  const cert = tls.value
  const daysLeft = Math.floor((new Date(cert.validTo).getTime() - Date.now()) / 86_400_000)
  return (
    <Section title="TLS">
      <KV label={t('発行者', 'Issuer')} value={cert.issuer.O ?? cert.issuer.CN ?? '—'} />
      <KV label={t('コモンネーム', 'Common name')} value={cert.subject.CN ?? '—'} />
      <KV label={t('プロトコル', 'Protocol')} value={cert.protocol ?? '—'} />
      <KV label={t('暗号', 'Cipher')} value={cert.cipher?.name ?? '—'} />
      <KV label={t('有効期間の開始', 'Valid from')} value={cert.validFrom} />
      <div className="flex items-center justify-between gap-3 bg-card px-5 py-3">
        <span className="text-sm text-muted-foreground">{t('有効期限', 'Valid to')}</span>
        <span className="text-sm">
          <span className="font-mono">{cert.validTo}</span>
          <span
            className={cn('ml-2 font-medium', daysLeft < 14 ? 'text-destructive' : 'text-success')}
          >
            ({t(`残り${daysLeft}日`, `${daysLeft}d left`)})
          </span>
        </span>
      </div>
    </Section>
  )
}

// The page-metadata section deliberately omits Open Graph / X (Twitter) card
// tags — those live in the dedicated OGP checker tool.
const PageSection = ({ page, t }: { page: Record<string, string>; t: T }) => {
  const entries = Object.entries(page).filter(
    ([key]) => !key.startsWith('og:') && !key.startsWith('twitter:'),
  )
  if (entries.length === 0) return null
  return (
    <Section title={t('ページ情報', 'Page metadata')}>
      {entries.map(([key, value]) => (
        <KV key={key} label={key} value={value} />
      ))}
    </Section>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
    <CardHeader className="border-b bg-muted/30 py-4">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-px bg-border/60 p-0">{children}</CardContent>
  </Card>
)

const KV = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-3 bg-card px-5 py-3">
    <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
    <span className="max-w-[65%] break-words text-right text-sm font-medium">{value}</span>
  </div>
)

function DnsRow<T>({
  label,
  record,
  render,
}: {
  label: string
  record: Settled<T[]>
  render: (value: T[]) => string[]
}) {
  return (
    <div className="flex items-start justify-between gap-3 bg-card px-5 py-3">
      <span className="shrink-0 font-mono text-xs text-muted-foreground">{label}</span>
      <div className="max-w-[75%] text-right">
        {isOk(record) ? (
          record.value.length > 0 ? (
            render(record.value).map((line) => (
              <div key={line} className="break-all font-mono text-xs">
                {line}
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )
        ) : (
          <span className="text-xs text-muted-foreground">{record.error}</span>
        )}
      </div>
    </div>
  )
}
