'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type HmacAlgorithm, hmacAlgorithms } from '@/features/hmac/functions/hmac'
import { CopyButton } from '@/features/tools/components/copy-button'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useHmac } from '../hooks/use-hmac'

const algorithmOptions = hmacAlgorithms.map((value) => ({ value, label: value }))

export const HmacWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const hmac = useHmac()

  return (
    <WorkspaceShell tool={tool} onClear={hmac.clear}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hmac-message">{t('メッセージ', 'Message')}</Label>
              <Textarea
                id="hmac-message"
                value={hmac.message}
                onChange={(event) => hmac.setMessage(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hmac-secret">Secret</Label>
              <Textarea
                id="hmac-secret"
                value={hmac.secret}
                onChange={(event) => hmac.setSecret(event.target.value)}
              />
            </div>
          </div>
          <SegmentedControl<HmacAlgorithm>
            value={hmac.algorithm}
            options={algorithmOptions}
            onChange={hmac.setAlgorithm}
            label={t('ハッシュアルゴリズム', 'Hash algorithm')}
          />
          <div className="flex justify-end">
            <CopyButton value={hmac.output} />
          </div>
          <Textarea
            readOnly
            value={hmac.output}
            aria-label={t('署名', 'Signature')}
            className="min-h-52 font-mono"
          />
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
