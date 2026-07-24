'use client'

import { Check, X } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { useCidr } from '../hooks/use-cidr'

export const CidrWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const cidr = useCidr()
  const { result } = cidr

  return (
    <WorkspaceShell tool={tool} onClear={cidr.clear}>
      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-sm font-medium">
              {t('CIDR / IPアドレス', 'CIDR / IP address')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="cidr-input">{t('CIDR表記', 'CIDR notation')}</Label>
              <Input
                id="cidr-input"
                value={cidr.input}
                onChange={(event) => cidr.setInput(event.target.value)}
                className="font-mono text-base"
                placeholder="192.168.10.0/24  ·  2001:db8::/48"
              />
              {cidr.input.trim() && !cidr.parsed && (
                <p className="text-sm text-destructive">
                  {t('CIDR表記を解釈できません', 'Could not parse this CIDR/IP')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <>
            <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-medium">
                  {t('計算結果', 'Results')}
                  <span className="ml-2 rounded bg-accent px-1.5 py-0.5 font-mono text-xs text-primary">
                    IPv{result.version}
                  </span>
                </CardTitle>
                <CopyButton value={result.networkCidr} />
              </CardHeader>
              <CardContent className="grid gap-px bg-border/60 p-0 sm:grid-cols-2">
                <Row label={t('ネットワーク', 'Network')} value={result.networkCidr} />
                <Row label={t('種別', 'Type')} value={result.addressType} mono={false} />
                <Row label={t('サブネットマスク', 'Netmask')} value={result.netmask} />
                <Row label={t('ワイルドカード', 'Wildcard')} value={result.wildcard} />
                {result.broadcast && (
                  <Row label={t('ブロードキャスト', 'Broadcast')} value={result.broadcast} />
                )}
                <Row label={t('プレフィックス', 'Prefix')} value={`/${result.prefix}`} />
                <Row label={t('先頭ホスト', 'First host')} value={result.firstHost} />
                <Row label={t('末尾ホスト', 'Last host')} value={result.lastHost} />
                <Row label={t('総アドレス数', 'Total addresses')} value={result.totalAddresses} />
                <Row label={t('利用可能ホスト', 'Usable hosts')} value={result.usableHosts} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-medium">
                  {t('包含チェック', 'Contains check')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5">
                <div className="space-y-2">
                  <Label htmlFor="cidr-probe">{t('IP / CIDR', 'IP / CIDR')}</Label>
                  <Input
                    id="cidr-probe"
                    value={cidr.probe}
                    onChange={(event) => cidr.setProbe(event.target.value)}
                    className="font-mono"
                    placeholder="192.168.10.42"
                  />
                </div>
                {cidr.probe.trim() && (
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium',
                      cidr.contains === true && 'border-success/40 bg-success/10 text-success',
                      cidr.contains === false &&
                        'border-destructive/40 bg-destructive/10 text-destructive',
                      cidr.contains === null && 'border-border bg-muted/20 text-muted-foreground',
                    )}
                  >
                    {cidr.contains === true && <Check className="size-4" />}
                    {cidr.contains === false && <X className="size-4" />}
                    {cidr.contains === true && t('範囲に含まれます', 'Inside the network range')}
                    {cidr.contains === false &&
                      t('範囲に含まれません', 'Outside the network range')}
                    {cidr.contains === null &&
                      t('IPバージョンが一致しません', 'IP version mismatch')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b bg-muted/30 py-4">
                <CardTitle className="text-sm font-medium">
                  {t('サブネット分割', 'Split into subnets')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="cidr-split" className="text-xs text-muted-foreground">
                    {t('新しいプレフィックス', 'New prefix')}
                  </Label>
                  <span className="font-mono text-sm">/</span>
                  <Input
                    id="cidr-split"
                    type="number"
                    min={result.prefix}
                    max={cidr.parsed?.bits}
                    value={cidr.splitPrefix}
                    onChange={(event) => cidr.setSplitPrefix(Number(event.target.value))}
                    className="h-8 w-20"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {cidr.split && cidr.split.length > 0 ? (
                  <ul className="max-h-72 divide-y divide-border/60 overflow-auto">
                    {cidr.split.map((row) => (
                      <li
                        key={row.cidr}
                        className="flex items-center justify-between gap-3 px-5 py-2 font-mono text-sm"
                      >
                        <span className="text-primary">{row.cidr}</span>
                        <span className="truncate text-muted-foreground">{row.range}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-5 text-sm text-muted-foreground">
                    {t(
                      '新しいプレフィックスは元の値以上にしてください',
                      'New prefix must be larger than the current prefix',
                    )}
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

const Row = ({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center justify-between gap-3 bg-card px-5 py-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={cn('truncate text-sm font-medium', mono && 'font-mono')}>{value}</span>
  </div>
)
