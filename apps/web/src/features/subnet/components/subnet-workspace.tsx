'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResultCard } from '@/features/tools/components/result-card'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useSubnet } from '../hooks/use-subnet'

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
