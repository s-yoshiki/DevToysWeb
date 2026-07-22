'use client'

import { LoaderCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ApiResult } from '@/features/tools/components/api-result'
import { SegmentedControl } from '@/features/tools/components/segmented-control'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { type KeyMode, keyModes, useJwtVerify } from '../hooks/use-jwt-verify'

const keyLabels: Record<KeyMode, string> = {
  secret: 'HMAC Secret',
  jwks: 'JWKS URL',
  publicKey: 'PEM public key',
}

const keyOptions = keyModes.map((value) => ({ value, label: keyLabels[value] }))

export const JwtWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const jwt = useJwtVerify()

  return (
    <WorkspaceShell tool={tool} onClear={jwt.clear}>
      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="jwt-token">JWT</Label>
            <Textarea
              id="jwt-token"
              value={jwt.token}
              onChange={(event) => jwt.setToken(event.target.value)}
              className="min-h-28 break-all font-mono"
            />
          </div>
          <SegmentedControl<KeyMode>
            value={jwt.mode}
            options={keyOptions}
            onChange={jwt.changeMode}
            label={t('鍵の種類', 'Key material')}
          />
          <div className="space-y-2">
            <Label htmlFor="jwt-key">{keyLabels[jwt.mode]}</Label>
            {jwt.mode === 'publicKey' ? (
              <Textarea
                id="jwt-key"
                value={jwt.key}
                onChange={(event) => jwt.setKey(event.target.value)}
                className="min-h-28 font-mono"
              />
            ) : (
              <Input
                id="jwt-key"
                type={jwt.mode === 'secret' ? 'password' : 'url'}
                value={jwt.key}
                onChange={(event) => jwt.setKey(event.target.value)}
                placeholder={jwt.mode === 'jwks' ? 'https://example.com/.well-known/jwks.json' : ''}
              />
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jwt-issuer">Issuer (optional)</Label>
              <Input
                id="jwt-issuer"
                value={jwt.issuer}
                onChange={(event) => jwt.setIssuer(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jwt-audience">Audience (optional)</Label>
              <Input
                id="jwt-audience"
                value={jwt.audience}
                onChange={(event) => jwt.setAudience(event.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={jwt.run} disabled={jwt.loading || !jwt.canSubmit}>
              {jwt.loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
              {t('署名を検証', 'Verify signature')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              '入力したJWTと鍵は保存されません。機密性の高い秘密鍵は入力しないでください。',
              'Tokens and keys are not stored. Never enter a private key.',
            )}
          </p>
          <ApiResult value={jwt.output} error={jwt.error} />
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
