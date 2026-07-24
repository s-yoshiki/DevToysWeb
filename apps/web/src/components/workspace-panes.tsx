'use client'

import { CircleAlert } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/libs/utils'

/** Two-up editor layout: source on the left, result on the right. */
export const PaneGrid = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => <div className={cn('grid min-h-[400px] lg:grid-cols-2', className)}>{children}</div>

export const Pane = ({
  variant = 'source',
  className,
  children,
}: {
  variant?: 'source' | 'result'
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      'flex flex-col',
      variant === 'source' ? 'border-b border-border lg:border-b-0 lg:border-r' : 'bg-muted/40',
      className,
    )}
  >
    {children}
  </div>
)

export const PaneHeader = ({
  title,
  actions,
}: {
  title: React.ReactNode
  actions?: React.ReactNode
}) => (
  <div className="flex h-11 items-center justify-between gap-3 border-b border-border px-5">
    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {title}
    </span>
    {actions}
  </div>
)

/** Borderless monospace editor that fills the remaining height of a pane. */
export const CodeArea = ({
  className,
  ...props
}: React.ComponentProps<typeof Textarea> & { className?: string }) => (
  <Textarea
    {...props}
    className={cn(
      'min-h-52 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-sm shadow-none focus-visible:ring-0 lg:min-h-0',
      className,
    )}
  />
)

/** Inline failure notice used above or between panes. */
export const ErrorBanner = ({ title, message }: { title?: string; message: string }) => (
  <div
    className="flex items-start gap-2 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive"
    role="alert"
  >
    <CircleAlert className="mt-0.5 size-4 shrink-0" />
    <div>
      {title && <span className="font-semibold">{title}</span>}
      <p className={cn('font-mono text-xs', title && 'mt-0.5')}>{message}</p>
    </div>
  </div>
)
