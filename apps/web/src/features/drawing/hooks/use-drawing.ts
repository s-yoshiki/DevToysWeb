'use client'

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  type Background,
  canvasHeight,
  canvasWidth,
  renderStrokes,
  type Stroke,
  toCanvasPoint,
} from '../functions/canvas'

export const brushColors = [
  '#111827',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#0ea5e9',
  '#6366f1',
  '#ec4899',
  '#ffffff',
]

/**
 * The drawing is a list of strokes, not a bitmap: undo is a pop, changing the
 * background is a repaint, and nothing has to hold a stack of full-size frames.
 */
export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [redoStack, setRedoStack] = useState<Stroke[]>([])
  const [color, setColor] = useState('#111827')
  const [size, setSize] = useState(6)
  const [erasing, setErasing] = useState(false)
  const [background, setBackground] = useState<Background>('white')
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) renderStrokes(canvas, strokes, background)
  }, [strokes, background])

  const begin = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.setPointerCapture(event.pointerId)
      drawing.current = true
      const point = toCanvasPoint(canvas, event.clientX, event.clientY)
      setRedoStack([])
      setStrokes((previous) => [...previous, { color, size, erase: erasing, points: [point] }])
    },
    [color, erasing, size],
  )

  const extend = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!drawing.current || !canvas) return
    const point = toCanvasPoint(canvas, event.clientX, event.clientY)
    setStrokes((previous) => {
      const last = previous.at(-1)
      if (!last) return previous
      return [...previous.slice(0, -1), { ...last, points: [...last.points, point] }]
    })
  }, [])

  const end = useCallback(() => {
    drawing.current = false
  }, [])

  const undo = useCallback(() => {
    setStrokes((previous) => {
      const last = previous.at(-1)
      if (!last) return previous
      setRedoStack((stack) => [...stack, last])
      return previous.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setRedoStack((stack) => {
      const last = stack.at(-1)
      if (!last) return stack
      setStrokes((previous) => [...previous, last])
      return stack.slice(0, -1)
    })
  }, [])

  const clear = useCallback(() => {
    setStrokes([])
    setRedoStack([])
  }, [])

  const download = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `drawing-${Date.now()}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [])

  return {
    canvasRef,
    canvasWidth,
    canvasHeight,
    strokes,
    color,
    setColor,
    size,
    setSize,
    erasing,
    setErasing,
    background,
    setBackground,
    canUndo: strokes.length > 0,
    canRedo: redoStack.length > 0,
    begin,
    extend,
    end,
    undo,
    redo,
    clear,
    download,
  }
}
