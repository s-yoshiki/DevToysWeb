import type { Locale } from '@/features/i18n/domain/dictionaries'
import type { ToolDefinition } from './catalog'

export const getToolPath = (locale: Locale, tool: ToolDefinition) =>
  `/${locale}/${tool.category}/${tool.pathSlug}`
