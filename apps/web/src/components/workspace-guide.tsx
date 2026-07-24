'use client'

import { AlertTriangle, ChevronDown, ListChecks } from 'lucide-react'
import { useLocale } from '@/components/locale-provider'
import type { ToolDefinition } from '@/libs/domain/catalog'
import { findToolGuide } from '@/libs/domain/tool-guides'

/**
 * Collapsible "how to use" / "notes" panel shown below every workspace. Renders
 * nothing when the catalog entry carries neither list, so tools opt in simply by
 * adding `usage` and/or `notes` to their definition.
 */
export const WorkspaceGuide = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const guide = findToolGuide(tool.slug)
  const usage = guide?.usage[locale] ?? []
  const notes = guide?.notes[locale] ?? []
  if (usage.length === 0 && notes.length === 0) return null

  return (
    <details className="group mt-6 rounded-xl border border-border bg-card text-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-3 font-medium text-card-foreground select-none hover:bg-accent/50">
        <span>
          {dictionary.howToUse}
          {notes.length > 0 && ` / ${dictionary.cautions}`}
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="grid gap-6 border-t border-border px-4 py-4 sm:grid-cols-2">
        {usage.length > 0 && (
          <section aria-label={dictionary.howToUse}>
            <h2 className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
              <ListChecks className="size-4 text-primary" aria-hidden="true" />
              {dictionary.howToUse}
            </h2>
            <ol className="list-inside list-decimal space-y-1.5 text-muted-foreground marker:text-muted-foreground/60">
              {usage.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}
        {notes.length > 0 && (
          <section aria-label={dictionary.cautions}>
            <h2 className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
              <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
              {dictionary.cautions}
            </h2>
            <ul className="space-y-1.5 text-muted-foreground">
              {notes.map((note) => (
                <li key={note} className="flex gap-1.5">
                  <span aria-hidden="true" className="text-amber-500">
                    •
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </details>
  )
}
