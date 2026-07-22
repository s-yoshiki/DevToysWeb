'use client'

import { useMemo, useState } from 'react'
import { optimizeSvg, svgToDataUri } from '../../domain/source-formatters'

const sampleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Exported by an editor -->
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <title>Badge</title>
  <metadata>editor metadata</metadata>
  <circle cx="60" cy="60" r="52" fill="#2563eb" />
  <path d="M40 62 L54 76 L82 46" stroke="#fff" stroke-width="10" fill="none" />
</svg>`

export const useSvgOptimizer = () => {
  const [input, setInput] = useState(sampleSvg)

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', dataUri: '', error: '' }
    try {
      const output = optimizeSvg(input)
      return { output, dataUri: svgToDataUri(output), error: '' }
    } catch (reason) {
      return {
        output: '',
        dataUri: '',
        error: reason instanceof Error ? reason.message : 'Invalid SVG',
      }
    }
  }, [input])

  const saved = input.length - result.output.length

  return {
    input,
    setInput,
    ...result,
    savedRatio: input.length ? Math.max(0, (saved / input.length) * 100) : 0,
    clear: () => setInput(''),
  }
}
