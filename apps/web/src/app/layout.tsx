import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/features/theme/components/theme-provider'

export const metadata: Metadata = {
  title: { default: 'DevToys', template: '%s · DevToys' },
  description: 'A focused toolkit for everyday development.',
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
