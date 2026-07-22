'use client'

import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useEffect, useState } from 'react'

const sample = '# DevToys\n\n**Developer tools** in your browser.\n\n- Fast\n- Private\n- Useful'

/** Renders Markdown in the browser and sanitises it before it reaches the DOM. */
export const useMarkdownPreview = () => {
  const [input, setInput] = useState(sample)
  const [html, setHtml] = useState('')

  useEffect(() => {
    setHtml(DOMPurify.sanitize(marked.parse(input, { async: false }) as string))
  }, [input])

  return { input, setInput, html, clear: () => setInput('') }
}
