'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/copy-button'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { useBase64Image } from '../hooks/use-base64-image'

const checkerboard =
  'bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px]'

export const Base64ImageWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const image = useBase64Image()

  return (
    <WorkspaceShell tool={tool} onClear={image.clear}>
      <Card>
        <CardContent className="grid gap-6 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base64-image-file">
                {t('画像ファイル（最大5MB）', 'Image file (max 5 MB)')}
              </Label>
              <Input
                id="base64-image-file"
                type="file"
                accept="image/*"
                onChange={(event) => image.loadFile(event.target.files?.[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="base64-image-data">Data URL</Label>
                <CopyButton value={image.value} />
              </div>
              <Textarea
                id="base64-image-data"
                value={image.value}
                onChange={(event) => image.setValue(event.target.value)}
                className="min-h-80 font-mono text-xs"
              />
            </div>
          </div>
          <div
            className={`flex min-h-96 items-center justify-center rounded-xl border p-6 ${checkerboard}`}
          >
            {image.valid ? (
              // biome-ignore lint/performance/noImgElement: the source is a client-side data URI
              <img src={image.value} alt="Base64 preview" className="max-h-[28rem] max-w-full" />
            ) : (
              <p className="text-sm text-destructive">
                {t(
                  '有効なBase64画像Data URLを入力してください',
                  'Enter a valid Base64 image Data URL',
                )}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </WorkspaceShell>
  )
}
