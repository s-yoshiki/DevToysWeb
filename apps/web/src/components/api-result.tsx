'use client'

import { CircleAlert } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslate } from '@/hooks/use-translate'
import { CopyButton } from './copy-button'

/** Response body plus failure notice for the workspaces backed by the API. */
export const ApiResult = ({ value, error }: { value: string; error: string }) => {
  const t = useTranslate()
  return (
    <>
      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex justify-end">
        <CopyButton value={value} />
      </div>
      <Textarea
        readOnly
        value={value}
        aria-label={t('レスポンス', 'Response')}
        className="min-h-[30rem] font-mono text-xs"
      />
    </>
  )
}
