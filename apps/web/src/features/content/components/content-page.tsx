import { ArrowUpRight, Braces, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getDictionary, type Locale } from '@/i18n/dictionaries'
import { type ContentPageSlug, contentPageLinks } from '../domain/page-slugs'

export const ContentPage = ({ locale, slug }: { locale: Locale; slug: ContentPageSlug }) => {
  const dictionary = getDictionary(locale)
  const page = dictionary.contentPages[slug]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label={locale === 'ja' ? 'パンくずリスト' : 'Breadcrumb'}>
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="transition-colors hover:text-foreground">
              {dictionary.appName}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-foreground">
            {page.title}
          </li>
        </ol>
      </nav>

      <header className="mt-8 border-b border-border pb-8 sm:mt-10 sm:pb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {page.description}
        </p>
        {'action' in page && page.action && (
          <a
            href={page.action.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {page.action.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        )}
      </header>

      <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {'items' in section && section.items && (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="mr-2 text-primary" aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <nav
        className="mt-12 border-t border-border pt-8"
        aria-label={locale === 'ja' ? '関連ページ' : 'Related pages'}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {locale === 'ja' ? '関連ページ' : 'More from DevToys'}
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {contentPageLinks.map((link) => (
            <li key={link.slug}>
              <Link
                href={`/${locale}/${link.slug}`}
                aria-current={link.slug === slug ? 'page' : undefined}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:border-border-strong hover:bg-muted"
              >
                <Braces className="size-3.5 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{dictionary.sitePages[link.key]}</span>
                <ChevronRight
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
