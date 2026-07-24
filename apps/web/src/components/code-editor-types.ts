/** Shared props for the Monaco-backed editor and its lazy wrapper. */
export type CodeEditorProps = {
  value: string
  /** Omit for read-only output panes. */
  onChange?: (value: string) => void
  /** Monaco language id, e.g. `json`, `markdown`, `xml`, `plaintext`. */
  language?: string
  readOnly?: boolean
  placeholder?: string
  ariaLabel?: string
  wordWrap?: boolean
  className?: string
}
