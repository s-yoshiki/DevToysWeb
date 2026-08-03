export const contentPageLinks = [
  { slug: 'about-app', key: 'aboutApp' },
  { slug: 'how-to-use', key: 'howToUsePage' },
  { slug: 'developer-guide', key: 'developerGuide' },
  { slug: 'operator', key: 'operator' },
  { slug: 'privacy', key: 'privacy' },
  { slug: 'terms', key: 'terms' },
  { slug: 'contact', key: 'contact' },
] as const

export type ContentPageSlug = (typeof contentPageLinks)[number]['slug']
export type ContentPageLinkKey = (typeof contentPageLinks)[number]['key']
