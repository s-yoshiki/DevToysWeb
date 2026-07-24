'use client'

import Editor, { loader, type OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { cn } from '@/libs/utils'
import type { CodeEditorProps } from './code-editor-types'

/*
 * Self-hosted Monaco. `output: 'export'` ships to CloudFront under a strict CSP,
 * so nothing may come from a CDN. We bundle the full `monaco-editor` package and
 * hand its language workers to the bundler via `new Worker(new URL(...))`, a
 * pattern both webpack and Turbopack turn into local static chunks. This module
 * is only ever loaded in the browser (via a `ssr: false` dynamic import), so the
 * top-level `monaco` import never runs during the Node prerender.
 */
if (typeof window !== 'undefined') {
  const monacoEnvironment: monaco.Environment = {
    getWorker(_workerId: string, label: string) {
      switch (label) {
        case 'json':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
          )
        case 'css':
        case 'scss':
        case 'less':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url),
          )
        case 'html':
        case 'handlebars':
        case 'razor':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url),
          )
        case 'typescript':
        case 'javascript':
          return new Worker(
            new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
          )
        default:
          return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          )
      }
    },
  }
  ;(window as typeof window & { MonacoEnvironment: monaco.Environment }).MonacoEnvironment =
    monacoEnvironment
  // Register the bundled instance so the loader never reaches for the CDN copy.
  loader.config({ monaco })
}

const CodeEditorImpl = ({
  value,
  onChange,
  language = 'plaintext',
  readOnly = false,
  placeholder,
  ariaLabel,
  wordWrap = false,
  className,
}: CodeEditorProps) => {
  const { resolvedTheme } = useTheme()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor
    if (ariaLabel) editor.updateOptions({ ariaLabel })
  }

  useEffect(() => {
    if (ariaLabel) editorRef.current?.updateOptions({ ariaLabel })
  }, [ariaLabel])

  return (
    <div className={cn('min-h-0 flex-1', className)}>
      <Editor
        language={language}
        value={value}
        onChange={(next) => onChange?.(next ?? '')}
        onMount={handleMount}
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        height="100%"
        loading={<div className="size-full bg-transparent" />}
        options={{
          readOnly,
          placeholder,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: wordWrap ? 'on' : 'off',
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
          padding: { top: 12, bottom: 12 },
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  )
}

export default CodeEditorImpl
