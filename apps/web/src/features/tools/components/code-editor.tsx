'use client'

import dynamic from 'next/dynamic'
import type { CodeEditorProps } from './code-editor-types'

export type { CodeEditorProps }

/*
 * Monaco pulls in `window`/`self`, so it must never load during the Node
 * prerender of the static export. `ssr: false` keeps the heavy bundle and its
 * language workers strictly client-side; the fallback matches an empty pane so
 * there is no layout shift when the editor mounts.
 */
const CodeEditorImpl = dynamic(() => import('./code-editor-impl'), {
  ssr: false,
  loading: () => <div className="min-h-0 flex-1 bg-transparent" />,
})

/** Monaco-backed editor used by the code-oriented tool workspaces. */
export const CodeEditor = (props: CodeEditorProps) => <CodeEditorImpl {...props} />
