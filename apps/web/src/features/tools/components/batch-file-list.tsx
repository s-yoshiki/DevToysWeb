'use client'

import { CircleAlert, Download, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslate } from '@/hooks/use-translate'
import { formatBytes } from '../domain/bytes'
import type { BatchItem } from '../hooks/use-image-batch'

/** Per-file outcome list shared by the batch image tools. */
export const BatchFileList = ({
  items,
  rejected,
  emptyMessage,
}: {
  items: BatchItem[]
  rejected: { name: string; reason: string }[]
  emptyMessage: string
}) => {
  const t = useTranslate()

  if (!items.length && !rejected.length)
    return <p className="px-5 py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>

  return (
    <ul className="divide-y">
      {items.map((item) => {
        const saved = item.result ? item.file.size - item.result.size : 0
        return (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(item.file.size)}
                {item.result && ` → ${formatBytes(item.result.size)}`}
                {item.result && saved > 0 && ` (−${Math.round((saved / item.file.size) * 100)}%)`}
              </p>
              {item.error && <p className="mt-1 text-xs text-destructive">{item.error}</p>}
            </div>
            <div className="flex items-center gap-2">
              {item.status === 'working' && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
              {item.status === 'pending' && (
                <Badge variant="outline" className="text-[11px]">
                  {t('待機中', 'Queued')}
                </Badge>
              )}
              {item.status === 'error' && <CircleAlert className="size-4 text-destructive" />}
              {item.result && (
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href={item.result.url} download={item.result.name} />}
                >
                  <Download className="size-4" />
                  {t('保存', 'Save')}
                </Button>
              )}
            </div>
          </li>
        )
      })}
      {rejected.map((entry) => (
        <li key={entry.name} className="flex items-center gap-3 px-5 py-3">
          <CircleAlert className="size-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{entry.name}</p>
            <p className="text-xs text-destructive">{entry.reason}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
