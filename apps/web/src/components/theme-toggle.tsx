'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useLocale } from '@/components/locale-provider'
import { Button } from '@/components/ui/button'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const { dictionary } = useLocale()
  // The theme is only known on the client, so the label — unlike the icons —
  // cannot be resolved until after hydration.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        mounted ? (isDark ? dictionary.switchToLight : dictionary.switchToDark) : dictionary.theme
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {/* Swapped by CSS rather than state, so the served markup already matches
          the theme `next-themes` applies before paint. */}
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  )
}
