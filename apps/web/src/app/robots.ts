import type { MetadataRoute } from 'next'
import { absoluteUrl, siteUrl } from '@/features/seo/domain/site'

// Required by `output: 'export'`: robots.txt is emitted once at build time.
export const dynamic = 'force-static'

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: `${siteUrl}/sitemap.xml`,
  host: absoluteUrl('/'),
})

export default robots
