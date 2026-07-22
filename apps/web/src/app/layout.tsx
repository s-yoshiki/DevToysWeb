import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ogImage, siteName, siteUrl } from '@/features/seo/domain/site'
import { ApiMockProvider } from '@/mocks/api-mock-provider'

export const metadata: Metadata = {
  // Lets every page declare canonical and Open Graph URLs as relative paths.
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s · ${siteName}` },
  description: 'A focused toolkit for everyday development.',
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.ico' },
  openGraph: { type: 'website', siteName, images: [ogImage] },
  twitter: { card: 'summary_large_image', images: [ogImage] },
  formatDetection: { telephone: false, email: false, address: false },
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ApiMockProvider>{children}</ApiMockProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
