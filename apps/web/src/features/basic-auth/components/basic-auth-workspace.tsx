'use client'

import { useId } from 'react'

import { CopyButton } from '@/components/copy-button'
import { SegmentedControl } from '@/components/segmented-control'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceShell } from '@/components/workspace-shell'
import { useTranslate } from '@/hooks/use-translate'
import type { WorkspaceProps } from '@/workspaces/types'
import { type BasicAuthMode, useBasicAuth } from '../hooks/use-basic-auth'

export const BasicAuthWorkspace = ({ tool }: WorkspaceProps) => {
  const fieldId = useId()
  const t = useTranslate()
  const auth = useBasicAuth()

  return (
    <WorkspaceShell tool={tool} onClear={auth.clear}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <SegmentedControl<BasicAuthMode>
            value={auth.mode}
            options={[
              { value: 'encode', label: t('生成', 'Encode') },
              { value: 'decode', label: t('解析', 'Decode') },
            ]}
            onChange={auth.setMode}
            label={t('モード', 'Mode')}
          />
          {auth.mode === 'encode' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-basic-auth-username`}>
                  {t('ユーザー名', 'Username')}
                </Label>
                <Input
                  id={`${fieldId}-basic-auth-username`}
                  value={auth.username}
                  onChange={(event) => auth.setUsername(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}-basic-auth-password`}>
                  {t('パスワード', 'Password')}
                </Label>
                <Input
                  id={`${fieldId}-basic-auth-password`}
                  value={auth.password}
                  onChange={(event) => auth.setPassword(event.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${fieldId}-basic-auth-header`}>Authorization header</Label>
              <Textarea
                id={`${fieldId}-basic-auth-header`}
                value={auth.header}
                onChange={(event) => auth.setHeader(event.target.value)}
              />
            </div>
          )}
          <div className="flex justify-end">
            <CopyButton value={auth.output} />
          </div>
          <Textarea
            readOnly
            value={auth.output}
            aria-label={t('結果', 'Result')}
            className="min-h-36 font-mono"
          />
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
