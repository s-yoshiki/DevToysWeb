'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/libs/utils'
import { CopyButton } from './copy-button'

/** Read-only result panel with a copy action, used by the single-output tools. */
export const ResultCard = ({
  title,
  value,
  error = false,
}: {
  title: string
  value: string
  error?: boolean
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/50 py-3">
      <CardTitle className="text-sm">{title}</CardTitle>
      <CopyButton value={value} />
    </CardHeader>
    <CardContent className="p-0">
      <Textarea
        readOnly
        aria-label={title}
        value={value}
        className={cn(
          'min-h-60 resize-none rounded-none border-0 p-5 font-mono shadow-none focus-visible:ring-0',
          error && 'text-destructive',
        )}
      />
    </CardContent>
  </Card>
)
