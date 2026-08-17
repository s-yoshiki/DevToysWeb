import type { Locale } from '@/i18n/dictionaries'
import type { ToolDefinition } from './catalog'

export const getToolPath = (locale: Locale, tool: ToolDefinition) =>
  `/${locale}/${tool.category}/${tool.pathSlug}/`

/**
 * Compares two route paths ignoring a trailing slash.
 *
 * The app is exported with `trailingSlash: true`; keeping the generated path
 * in the same form also prevents internal navigation from going through a
 * redirect before reaching the static page.
 */
export const isSamePath = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')
