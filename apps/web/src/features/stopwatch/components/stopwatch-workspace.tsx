'use client'

import { Flag, Pause, Play, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CopyButton } from '@/features/tools/components/copy-button'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import { formatPrecise } from '@/features/tools/domain/duration'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { useStopwatch } from '../hooks/use-stopwatch'

export const StopwatchWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const stopwatch = useStopwatch()

  const lapsAsText = stopwatch.laps
    .map((lap) => `${lap.index}\t${formatPrecise(lap.split)}\t${formatPrecise(lap.total)}`)
    .reverse()
    .join('\n')

  return (
    <WorkspaceShell tool={tool} onClear={stopwatch.reset}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border-border/70">
          <CardContent className="flex flex-col items-center gap-8 px-6 py-12">
            <span
              className="font-mono text-5xl font-semibold tabular-nums sm:text-7xl"
              aria-live="off"
            >
              {formatPrecise(stopwatch.elapsed)}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button size="lg" onClick={stopwatch.toggle}>
                {stopwatch.running ? <Pause className="size-4" /> : <Play className="size-4" />}
                {stopwatch.running
                  ? t('ストップ', 'Stop')
                  : stopwatch.elapsed
                    ? t('再開', 'Resume')
                    : t('スタート', 'Start')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={stopwatch.recordLap}
                disabled={!stopwatch.running && !stopwatch.elapsed}
              >
                <Flag className="size-4" />
                {t('ラップ', 'Lap')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={stopwatch.reset}
                disabled={!stopwatch.elapsed && !stopwatch.laps.length}
              >
                <RotateCcw className="size-4" />
                {t('リセット', 'Reset')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-3">
            <CardTitle className="text-sm">
              {t(`ラップ (${stopwatch.laps.length})`, `Laps (${stopwatch.laps.length})`)}
            </CardTitle>
            <CopyButton value={lapsAsText} />
          </CardHeader>
          <CardContent className="p-0">
            {stopwatch.laps.length ? (
              <ul className="max-h-[26rem] divide-y overflow-y-auto">
                {stopwatch.laps.map((lap) => (
                  <li key={lap.index} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                      #{lap.index}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        lap.split === stopwatch.fastest && 'text-emerald-600 dark:text-emerald-400',
                        lap.split === stopwatch.slowest && 'text-destructive',
                      )}
                    >
                      {formatPrecise(lap.split)}
                    </span>
                    {lap.split === stopwatch.fastest && (
                      <Badge variant="secondary" className="text-[10px]">
                        {t('最速', 'Fastest')}
                      </Badge>
                    )}
                    <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                      {formatPrecise(lap.total)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                {t('ラップを押すと記録されます', 'Press Lap to record a split')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </WorkspaceShell>
  )
}
