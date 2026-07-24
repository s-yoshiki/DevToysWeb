'use client'

import { CopyButton } from '@/components/copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { useSubnet } from '../hooks/use-subnet'

export const SubnetWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const subnet = useSubnet()
  const { summary } = subnet

  return (
    <WorkspaceShell tool={tool} onClear={subnet.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardContent className="space-y-2 p-5">
            <Label htmlFor="subnet-cidr">IPv4 / CIDR</Label>
            <Input
              id="subnet-cidr"
              value={subnet.input}
              onChange={(event) => subnet.setInput(event.target.value)}
              className="font-mono text-base"
              placeholder="192.168.10.42/24"
            />
            {subnet.error && <p className="text-sm text-destructive">{subnet.error}</p>}
          </CardContent>
        </Card>

        {summary && (
          <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
              <CardTitle className="text-sm font-medium">
                {t('ネットワーク情報', 'Network information')}
                <span className="ml-2 rounded bg-accent px-1.5 py-0.5 font-mono text-xs text-primary">
                  {t('クラス', 'Class')} {summary.addressClass}
                </span>
              </CardTitle>
              <CopyButton value={`${summary.network}/${summary.prefix}`} />
            </CardHeader>
            <CardContent className="grid gap-px bg-border/60 p-0 sm:grid-cols-2">
              <Row
                label={t('ネットワーク', 'Network')}
                value={`${summary.network}/${summary.prefix}`}
              />
              <Row label={t('サブネットマスク', 'Subnet mask')} value={summary.subnetMask} />
              <Row label={t('ワイルドカード', 'Wildcard')} value={summary.wildcardMask} />
              <Row label={t('ブロードキャスト', 'Broadcast')} value={summary.broadcast} />
              <Row label={t('先頭ホスト', 'First host')} value={summary.firstHost} />
              <Row label={t('末尾ホスト', 'Last host')} value={summary.lastHost} />
              <Row
                label={t('総アドレス数', 'Total addresses')}
                value={summary.totalAddresses.toLocaleString()}
              />
              <Row
                label={t('利用可能ホスト', 'Usable hosts')}
                value={summary.usableHosts.toLocaleString()}
              />
              <div className="bg-card px-5 py-3 sm:col-span-2">
                <span className="text-sm text-muted-foreground">
                  {t('マスク (2進数)', 'Mask (binary)')}
                </span>
                <p className="mt-1 break-all font-mono text-sm">{summary.maskBinary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </WorkspaceShell>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className={cn('flex items-center justify-between gap-3 bg-card px-5 py-3')}>
    <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
    <div className="flex min-w-0 items-center gap-1">
      <span className="truncate font-mono text-sm font-medium">{value}</span>
      <CopyButton value={value} />
    </div>
  </div>
)
