'use client'

import { LoaderCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { ApiResult } from '../../components/api-result'
import { WorkspaceShell } from '../../components/workspace-shell'
import type { WorkspaceProps } from '../types'
import { useSiteDiagnostics } from './use-site-diagnostics'

export const SiteDiagnosticsWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const diagnostics = useSiteDiagnostics()

  return (
    <WorkspaceShell tool={tool} onClear={diagnostics.clear}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="diagnostics-url">URL / domain</Label>
            <div className="flex gap-2">
              <Input
                id="diagnostics-url"
                value={diagnostics.url}
                onChange={(event) => diagnostics.setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') diagnostics.run()
                }}
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
                'DNS、HTTP、TLS証明書、セキュリティヘッダー、OGPをまとめて確認します。',
                'Inspect DNS, HTTP, TLS, security headers, and page metadata.',
              )}
            </p>
          </div>
          <ApiResult value={diagnostics.output} error={diagnostics.error} />
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
