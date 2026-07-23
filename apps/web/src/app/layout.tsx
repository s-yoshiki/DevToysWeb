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
  // The .ico carries 16/32/48 for legacy browsers; the SVG scales everywhere else.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  // `.json` rather than `.webmanifest`: `aws s3 sync` only guesses a usable
  // content type for extensions it knows, and browsers accept application/json.
  manifest: '/manifest.json',
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
