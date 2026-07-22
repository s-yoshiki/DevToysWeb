import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/i18n/dictionaries'
import type { ToolDefinition } from '../domain/catalog'
import { getToolPath } from '../domain/tool-path'

export const ToolCard = ({ tool, locale }: { tool: ToolDefinition; locale: Locale }) => {
  return (
    <Link
      href={getToolPath(locale, tool)}
      className="group flex h-full gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-muted"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-lg transition-colors group-hover:bg-card"
        aria-hidden="true"
      >
        {tool.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight">{tool.title[locale]}</h3>
          <ArrowUpRight
            className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {tool.description[locale]}
        </p>
      </div>
    </Link>
  )
}
