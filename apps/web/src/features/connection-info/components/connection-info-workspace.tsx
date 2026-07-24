'use client'

import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { type ConnectionInfo, useConnectionInfo } from '../hooks/use-connection-info'

export const ConnectionInfoWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { info, refresh } = useConnectionInfo()

  return (
    <WorkspaceShell tool={tool} onClear={refresh}>
      {info ? (
        <div className="space-y-4">
          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-11 items-center justify-center rounded-xl',
                    info.online
                      ? 'bg-success/15 text-success'
                      : 'bg-destructive/15 text-destructive',
                  )}
                >
                  {info.online ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {info.online ? t('オンライン', 'Online') : t('オフライン', 'Offline')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.connectionType
                      ? t(
                          `実効回線: ${info.connectionType}`,
                          `Effective type: ${info.connectionType}`,
                        )
                      : t('回線種別は取得できません', 'Connection type unavailable')}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={refresh}>
                <RefreshCw className="size-4" />
                {t('更新', 'Refresh')}
              </Button>
            </CardContent>
          </Card>

          <Section title={t('回線', 'Connection')}>
            <KV label={t('実効回線種別', 'Effective type')} value={info.connectionType ?? '—'} />
            <KV
              label={t('推定下り速度', 'Downlink')}
              value={info.downlink !== null ? `${info.downlink} Mbps` : '—'}
            />
            <KV
              label={t('推定RTT', 'Round-trip time')}
              value={info.rtt !== null ? `${info.rtt} ms` : '—'}
            />
            <KV
              label={t('データ節約', 'Save-Data')}
              value={info.saveData === null ? '—' : info.saveData ? 'on' : 'off'}
            />
          </Section>

          <Section title={t('環境', 'Environment')}>
            <KV label={t('言語', 'Language')} value={info.language} />
            <KV label={t('優先言語', 'Languages')} value={info.languages} />
            <KV
              label={t('タイムゾーン', 'Time zone')}
              value={`${info.timezone} (${info.timezoneOffset})`}
            />
            <KV label={t('プラットフォーム', 'Platform')} value={info.platform} />
            <KV label={t('ベンダー', 'Vendor')} value={info.vendor} />
            <KV
              label="Cookie"
              value={info.cookieEnabled ? t('有効', 'enabled') : t('無効', 'disabled')}
            />
            <KV label="Do Not Track" value={info.doNotTrack} />
            <KV
              label={t('論理CPU数', 'CPU threads')}
              value={info.hardwareConcurrency !== null ? String(info.hardwareConcurrency) : '—'}
            />
            <KV
              label={t('端末メモリ', 'Device memory')}
              value={info.deviceMemory !== null ? `${info.deviceMemory} GB` : '—'}
            />
          </Section>

          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
              <CardTitle className="text-sm font-medium">User Agent</CardTitle>
              <CopyButton value={info.userAgent} />
            </CardHeader>
            <CardContent className="p-5">
              <p className="break-all font-mono text-xs text-muted-foreground">{info.userAgent}</p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <CopyButton value={toJson(info)} />
          </div>
        </div>
      ) : (
        <Card className="border-border/70">
          <CardContent className="p-5 text-sm text-muted-foreground">
            {t('接続情報を取得中…', 'Reading connection info…')}
          </CardContent>
        </Card>
      )}
    </WorkspaceShell>
  )
}

const toJson = (info: ConnectionInfo) => JSON.stringify(info, null, 2)

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
