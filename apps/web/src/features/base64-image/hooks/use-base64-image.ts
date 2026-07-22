'use client'

import { useState } from 'react'

const maxFileSize = 5 * 1024 * 1024
const dataUrlPattern = /^data:image\/[a-zA-Z0-9.+-]+;base64,/

const sample =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMzIwIDE4MCI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIHJ4PSIyNCIgZmlsbD0iIzI1NjNlYiIvPjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZmlsbD0id2hpdGUiPkRldlRveXM8L3RleHQ+PC9zdmc+'

export const useBase64Image = () => {
  const [value, setValue] = useState(sample)

  const loadFile = (file?: File) => {
    if (!file?.type.startsWith('image/') || file.size > maxFileSize) return
    const reader = new FileReader()
    reader.onload = () => setValue(String(reader.result))
    reader.readAsDataURL(file)
  }

  return { value, setValue, loadFile, valid: dataUrlPattern.test(value), clear: () => setValue('') }
}
