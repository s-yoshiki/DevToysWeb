import type { MetadataRoute } from 'next'
import { absoluteUrl, alternatesFor } from '@/features/seo/domain/site'
import { tools } from '@/features/tools/domain/catalog'
import { locales } from '@/i18n/dictionaries'

// Required by `output: 'export'`: the sitemap is emitted once at build time.
export const dynamic = 'force-static'

// `''` is the locale home; the rest are the locale-less tool paths.
const paths = ['', ...tools.map((tool) => `${tool.category}/${tool.pathSlug}`)]

const sitemap = (): MetadataRoute.Sitemap =>
  paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(path ? `${locale}/${path}` : locale),
      changeFrequency: 'monthly' as const,
      priority: path ? 0.8 : 1,
      alternates: { languages: alternatesFor(locale, path).languages },
    })),
  )

export default sitemap
