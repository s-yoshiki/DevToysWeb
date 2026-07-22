import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Locale } from '@/i18n/dictionaries'
import type { ToolDefinition } from '../domain/catalog'
import { getToolPath } from '../domain/tool-path'

export const ToolCard = ({ tool, locale }: { tool: ToolDefinition; locale: Locale }) => {
  return (
    <Link href={getToolPath(locale, tool)} className="group block h-full">
      <Card className="h-full border-border/70 bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full gap-3 p-4">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-xl shadow-sm ring-1 ring-primary/10"
            aria-hidden="true"
          >
            {tool.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight">{tool.title[locale]}</h3>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {tool.description[locale]}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
