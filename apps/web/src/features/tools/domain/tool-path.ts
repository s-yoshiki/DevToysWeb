import type { Locale } from '@/i18n/dictionaries'
import type { ToolDefinition } from './catalog'

export const getToolPath = (locale: Locale, tool: ToolDefinition) =>
  `/${locale}/${tool.category}/${tool.pathSlug}`
