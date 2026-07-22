'use client'

import { useMemo, useState } from 'react'
import { querySelectorAll, type SelectorMode } from '@/features/selector/functions/selector'

const sampleHtml = `<section class="hero" id="top">
  <h1 data-role="title">DevToys</h1>
  <ul class="links">
    <li><a href="/ja/">日本語</a></li>
    <li><a href="/en/">English</a></li>
  </ul>
</section>`

const sampleSelectors: Record<SelectorMode, string> = { css: '.links a', xpath: '//a[@href]' }

export const useSelector = () => {
  const [mode, setMode] = useState<SelectorMode>('css')
  const [selector, setSelector] = useState(sampleSelectors.css)
  const [html, setHtml] = useState(sampleHtml)

  const result = useMemo(() => {
    if (!selector.trim() || !html.trim()) return { matches: [] as string[], error: '' }
    try {
      return { matches: querySelectorAll(html, selector, mode), error: '' }
    } catch (reason) {
      return {
        matches: [] as string[],
        error: reason instanceof Error ? reason.message : 'Invalid selector',
      }
    }
  }, [html, mode, selector])

  /** Swapping the language keeps the workspace usable by seeding an example. */
  const changeMode = (next: SelectorMode) => {
    setMode(next)
    setSelector(sampleSelectors[next])
  }

  return {
    mode,
    changeMode,
    selector,
    setSelector,
    html,
    setHtml,
    ...result,
    output: result.matches.join('\n\n'),
    clear: () => setSelector(''),
  }
}
