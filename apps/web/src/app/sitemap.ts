import type { MetadataRoute } from 'next'
import { contentPageLinks } from '@/features/content/domain/page-slugs'
import { absoluteUrl, alternatesFor } from '@/features/seo/domain/site'
import { locales } from '@/i18n/dictionaries'
import { tools } from '@/libs/domain/catalog'

// Required by `output: 'export'`: the sitemap is emitted once at build time.
export const dynamic = 'force-static'

// `''` is the locale home; the rest are locale-less content and tool paths.
const paths = [
  '',
  ...contentPageLinks.map(({ slug }) => slug),
  ...tools.map((tool) => `${tool.category}/${tool.pathSlug}`),
]

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
