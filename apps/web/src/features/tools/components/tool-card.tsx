import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Locale } from '@/features/i18n/domain/dictionaries'
import type { ToolDefinition } from '../domain/catalog'

export const ToolCard = ({ tool, locale }: { tool: ToolDefinition; locale: Locale }) => {
  const Icon = tool.icon
  return (
    <Link href={`/${locale}/tools/${tool.slug}`} className="group block h-full">
      <Card className="h-full border-border/70 bg-card/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full gap-4 p-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold tracking-tight">{tool.title[locale]}</h3>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {tool.description[locale]}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
