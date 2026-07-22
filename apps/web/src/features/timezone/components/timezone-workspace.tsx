'use client'

import { Clock, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/features/tools/components/copy-button'
import { ErrorBanner } from '@/features/tools/components/workspace-panes'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { listTimeZones } from '../functions/timezone'
import { useTimezone } from '../hooks/use-timezone'

const zoneListId = 'timezone-options'

const ShiftBadge = ({ shift }: { shift: number }) => {
  const t = useTranslate()
  if (!shift) return null
  const sign = shift > 0 ? '+' : '−'
  return (
    <Badge variant="secondary" className="font-mono text-[11px]">
      {t(`${sign}${Math.abs(shift)}日`, `${sign}${Math.abs(shift)} day`)}
    </Badge>
  )
}

export const TimezoneWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const timezone = useTimezone()
  const [draft, setDraft] = useState('')

  const zones = listTimeZones()

  const submitDraft = () => {
    if (timezone.addTarget(draft.trim())) setDraft('')
  }

  return (
    <WorkspaceShell tool={tool} onClear={timezone.clear}>
      <datalist id={zoneListId}>
        {zones.map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">
              {t('基準となる日時', 'Reference date and time')}
            </CardTitle>
          </CardHeader>
          {timezone.error && <ErrorBanner message={timezone.error} />}
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="timezone-source">{t('タイムゾーン', 'Time zone')}</Label>
              <Input
                id="timezone-source"
                list={zoneListId}
                value={timezone.sourceZone}
                spellCheck={false}
                onChange={(event) => timezone.setSourceZone(event.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone-value">{t('日時', 'Date and time')}</Label>
              <Input
                id="timezone-value"
                type="datetime-local"
                step={1}
                value={timezone.wallText}
                onChange={(event) => timezone.setWallText(event.target.value)}
              />
            </div>
            <Button variant="outline" onClick={timezone.setNow}>
              <Clock className="size-4" />
              {t('現在時刻', 'Now')}
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b bg-muted/30 py-3">
            <CardTitle className="whitespace-nowrap text-sm">
              {t('各地の時刻', 'Around the world')}
            </CardTitle>
            <div className="flex flex-1 items-center justify-end gap-2">
              <Input
                list={zoneListId}
                value={draft}
                placeholder={t('タイムゾーンを追加', 'Add a time zone')}
                spellCheck={false}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  submitDraft()
                }}
                className="h-8 w-full max-w-56 font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon-sm"
                onClick={submitDraft}
                disabled={!draft.trim()}
              >
                <Plus className="size-4" />
                <span className="sr-only">{t('追加', 'Add')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {timezone.rows.length ? (
              <ul className="divide-y">
                {timezone.rows.map((row) => (
                  <li
                    key={row.zone}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-sm font-medium">{row.zone}</span>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {row.offset}
                        </Badge>
                        {row.abbreviation && (
                          <span className="text-xs text-muted-foreground">{row.abbreviation}</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{row.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShiftBadge shift={row.shift} />
                      <span className="font-mono text-xl tabular-nums">{row.time}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => timezone.removeTarget(row.zone)}
                      >
                        <X className="size-4" />
                        <span className="sr-only">{t('削除', 'Remove')}</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                {t('日時を入力してください', 'Enter a date and time to compare zones')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>ISO 8601 (UTC)</Label>
                <CopyButton value={timezone.isoString} />
              </div>
              <p className="font-mono text-sm">{timezone.isoString || '—'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label>Unix time</Label>
                <CopyButton
                  value={timezone.unixSeconds === null ? '' : String(timezone.unixSeconds)}
                />
              </div>
              <p className="font-mono text-sm tabular-nums">{timezone.unixSeconds ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
