'use client'

import { Moon, Plus, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { WorkspaceShell } from '@/components/workspace-shell'
import { listTimeZones } from '@/features/timezone/functions/timezone'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/libs/utils'
import type { WorkspaceProps } from '@/workspaces/types'
import { useWorldClock } from '../hooks/use-world-clock'

const zoneListId = 'world-clock-options'

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

export const WorldClockWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const clock = useWorldClock()
  const [draft, setDraft] = useState('')

  const zones = listTimeZones()

  const submitDraft = () => {
    if (clock.addZone(draft)) setDraft('')
  }

  return (
    <WorkspaceShell tool={tool} onClear={clock.clear}>
      <datalist id={zoneListId}>
        {zones.map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>

      <Card className="overflow-hidden border-border/70">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b bg-muted/30 py-3">
          <CardTitle className="whitespace-nowrap text-sm">
            {t('各地の時計', 'Clocks around the world')}
          </CardTitle>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={clock.toggleHour12}>
              {clock.hour12 ? t('12時間', '12-hour') : t('24時間', '24-hour')}
            </Button>
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
            <Button variant="outline" size="icon-sm" onClick={submitDraft} disabled={!draft.trim()}>
              <Plus className="size-4" />
              <span className="sr-only">{t('追加', 'Add')}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {clock.rows.length ? (
            <ul className="grid gap-px bg-border/70 sm:grid-cols-2">
              {clock.rows.map((row) => (
                <li
                  key={row.zone}
                  className={cn(
                    'group relative flex items-center justify-between gap-4 bg-card px-5 py-4',
                    row.isLocal && 'bg-accent/40',
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {row.isDay ? (
                        <Sun className="size-4 shrink-0 text-amber-500" aria-hidden />
                      ) : (
                        <Moon className="size-4 shrink-0 text-indigo-400" aria-hidden />
                      )}
                      <span className="truncate text-sm font-medium">{row.city}</span>
                      {row.isLocal && (
                        <Badge variant="outline" className="text-[10px]">
                          {t('現在地', 'Local')}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{row.date}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {row.offset}
                      </Badge>
                      {row.abbreviation && <span>{row.abbreviation}</span>}
                      <ShiftBadge shift={row.shift} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-2xl tabular-nums">{row.time}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                      onClick={() => clock.removeZone(row.zone)}
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
              {clock.ready
                ? t('タイムゾーンを追加してください', 'Add a time zone to start')
                : t('読み込み中…', 'Loading…')}
            </p>
          )}
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
