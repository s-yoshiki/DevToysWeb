'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResultCard } from '@/features/tools/components/result-card'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useCronSchedule } from '../hooks/use-cron-schedule'

export const CronWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const cron = useCronSchedule()

  return (
    <WorkspaceShell tool={tool} onClear={cron.clear}>
      <div className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_16rem]">
            <div className="space-y-2">
              <Label htmlFor="cron-expression">Cron</Label>
              <Input
                id="cron-expression"
                value={cron.expression}
                onChange={(event) => cron.setExpression(event.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cron-timezone">{t('タイムゾーン', 'Timezone')}</Label>
              <Input
                id="cron-timezone"
                value={cron.timezone}
                onChange={(event) => cron.setTimezone(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <ResultCard
          title={t('次回の実行日時（ISO 8601）', 'Next runs (ISO 8601)')}
          value={cron.value}
          error={cron.error}
        />
      </div>
    </WorkspaceShell>
  )
}
