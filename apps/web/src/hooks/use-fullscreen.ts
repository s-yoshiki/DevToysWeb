'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Two independent "fullscreen" affordances that a workspace can offer:
 *
 * - `maximized` is an in-app mode. It hides the app chrome (header, sidebar,
 *   footer) via a `data-maximized` attribute on the root element, styled in
 *   globals.css, so the tool alone fills the window. It is purely visual and
 *   leaves the browser untouched.
 * - `browserFullscreen` drives the native Fullscreen API on the document, so the
 *   browser's own UI and the OS chrome disappear too.
 *
 * The two are deliberately separable — callers can enter either, both, or
 * neither — but both need to be undone when the component using them unmounts
 * (e.g. navigating to another tool), which this hook handles.
 */
const rootAttribute = 'data-maximized'

const isBrowserFullscreen = () =>
  typeof document !== 'undefined' && document.fullscreenElement !== null

export const useFullscreen = () => {
  const [maximized, setMaximized] = useState(false)
  const [browserFullscreen, setBrowserFullscreen] = useState(false)

  // The native fullscreen state can change without us (Esc, F11, the browser's
  // own control), so mirror the API rather than trusting our own toggles.
  useEffect(() => {
    const sync = () => setBrowserFullscreen(isBrowserFullscreen())
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  // Reflect the maximize state onto the root element for the CSS to key off,
  // and always clear it when the owning component goes away.
  useEffect(() => {
    const root = document.documentElement
    if (maximized) root.setAttribute(rootAttribute, '')
    else root.removeAttribute(rootAttribute)
    return () => root.removeAttribute(rootAttribute)
  }, [maximized])

  // Esc leaves the in-app maximized mode, matching the native fullscreen gesture.
  useEffect(() => {
    if (!maximized) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMaximized(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [maximized])

  const toggleMaximized = useCallback(() => setMaximized((value) => !value), [])

  const toggleBrowserFullscreen = useCallback(async () => {
    try {
      if (isBrowserFullscreen()) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Denied (permissions/policy) or unsupported — the sync listener keeps the
      // button state honest, so there is nothing to recover here.
    }
  }, [])

  return {
    maximized,
    browserFullscreen,
    toggleMaximized,
    toggleBrowserFullscreen,
  }
}
