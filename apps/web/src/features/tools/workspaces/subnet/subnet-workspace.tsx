'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslate } from '@/features/i18n/hooks/use-translate'
import { ResultCard } from '../../components/result-card'
import { WorkspaceShell } from '../../components/workspace-shell'
import type { WorkspaceProps } from '../types'
import { useSubnet } from './use-subnet'

export const SubnetWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const subnet = useSubnet()

  return (
    <WorkspaceShell tool={tool} onClear={subnet.clear}>
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-2 p-5">
            <Label htmlFor="subnet-cidr">IPv4 / CIDR</Label>
            <Input
              id="subnet-cidr"
              value={subnet.input}
              onChange={(event) => subnet.setInput(event.target.value)}
              className="font-mono"
            />
          </CardContent>
        </Card>
        <ResultCard
          title={t('ネットワーク情報', 'Network information')}
          value={subnet.value}
          error={subnet.error}
        />
      </div>
    </WorkspaceShell>
  )
}
