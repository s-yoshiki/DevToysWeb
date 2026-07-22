import type { Locale } from '@/i18n/dictionaries'
import type { ToolDefinition } from './catalog'

export const getToolPath = (locale: Locale, tool: ToolDefinition) =>
  `/${locale}/${tool.category}/${tool.pathSlug}`

/**
 * Compares two route paths ignoring a trailing slash.
 *
 * The app is exported with `trailingSlash: true`, so `usePathname()` reports
 * `/ja/converters/color-converter/` while `getToolPath` builds the same route
 * without the slash. Comparing them directly is always false, which silently
 * disables every active-nav highlight and `aria-current="page"`.
 */
export const isSamePath = (a: string, b: string) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')
