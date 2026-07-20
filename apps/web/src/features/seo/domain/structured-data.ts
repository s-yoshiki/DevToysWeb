import { getDictionary, type Locale } from '@/features/i18n/domain/dictionaries'
import { type ToolDefinition, tools } from '@/features/tools/domain/catalog'
import { getToolPath } from '@/features/tools/domain/tool-path'
import { toolDescription } from './metadata'
import { absoluteUrl, siteName, siteUrl } from './site'

// Every tool is free and runs in the browser, so the same offer and platform
// apply to all of them.
const freeBrowserApp = {
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export const websiteJsonLd = (locale: Locale) => {
  const { tagline, heroDescription } = getDictionary(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    alternateName: tagline,
    url: absoluteUrl(locale),
    description: heroDescription,
    inLanguage: locale,
  }
}

export const toolListJsonLd = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: getDictionary(locale).allTools,
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: tool.title[locale],
    url: `${siteUrl}${getToolPath(locale, tool)}/`,
  })),
})

export const toolJsonLd = (tool: ToolDefinition, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  ...freeBrowserApp,
  name: tool.title[locale],
  description: toolDescription(tool, locale),
  url: `${siteUrl}${getToolPath(locale, tool)}/`,
  inLanguage: locale,
  isPartOf: { '@id': `${siteUrl}/#website` },
})

// Categories have no route of their own, so the trail stays home → tool rather
// than emitting a breadcrumb entry without a resolvable `item`.
export const breadcrumbJsonLd = (tool: ToolDefinition, locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: siteName, item: absoluteUrl(locale) },
    {
      '@type': 'ListItem',
      position: 2,
      name: tool.title[locale],
      item: `${siteUrl}${getToolPath(locale, tool)}/`,
    },
  ],
})
