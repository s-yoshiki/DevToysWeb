'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { useDeviceInfo } from '../hooks/use-device-info'

export const DeviceInfoWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const { locale } = useLocale()
  const groups = useDeviceInfo()

  return (
    <WorkspaceShell tool={tool} onClear={() => {}}>
      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            {t('読み込み中…', 'Loading…')}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.title.en}>
              <CardHeader className="border-b border-border py-3">
                <CardTitle className="text-sm">{group.title[locale]}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <dl>
                  {group.rows.map((row) => (
                    <div
                      key={row.label.en}
                      className="flex items-start justify-between gap-4 border-b border-border px-5 py-2.5 last:border-b-0"
                    >
                      <dt className="shrink-0 text-sm text-muted-foreground">
                        {row.label[locale]}
                      </dt>
                      <dd className="break-all text-right font-mono text-sm">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </WorkspaceShell>
  )
}
