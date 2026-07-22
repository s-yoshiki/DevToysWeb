export const canvasWidth = 1280
export const canvasHeight = 800

export type Point = { x: number; y: number }

export type Stroke = {
  color: string
  size: number
  erase: boolean
  points: Point[]
}

export type Background = 'transparent' | 'white' | 'dark'

export const backgroundFill: Record<Background, string | null> = {
  transparent: null,
  white: '#ffffff',
  dark: '#111827',
}

/** Screen coordinates mapped onto the canvas's fixed internal resolution. */
export const toCanvasPoint = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  }
}

const drawStroke = (context: CanvasRenderingContext2D, stroke: Stroke, fill: string | null) => {
  // On a transparent canvas the eraser composites a hole so the export keeps its
  // alpha; on a filled one it repaints the background, which is what the user
  // sees and expects.
  const paint = stroke.erase ? fill : stroke.color
  context.save()
  context.globalCompositeOperation = stroke.erase && !fill ? 'destination-out' : 'source-over'
  context.strokeStyle = paint ?? stroke.color
  context.fillStyle = paint ?? stroke.color
  context.lineWidth = stroke.size
  context.lineCap = 'round'
  context.lineJoin = 'round'

  const [first, ...rest] = stroke.points
  if (!first) {
    context.restore()
    return
  }
  // A tap with no movement still deserves a dot.
  if (!rest.length) {
    context.beginPath()
    context.arc(first.x, first.y, stroke.size / 2, 0, Math.PI * 2)
    context.fill()
    context.restore()
    return
  }

  context.beginPath()
  context.moveTo(first.x, first.y)
  for (const point of rest) context.lineTo(point.x, point.y)
  context.stroke()
  context.restore()
}

/** Full repaint from the stroke list — the single source of truth for the art. */
export const renderStrokes = (
  canvas: HTMLCanvasElement,
  strokes: Stroke[],
  background: Background,
) => {
  const context = canvas.getContext('2d')
  if (!context) return
  context.clearRect(0, 0, canvas.width, canvas.height)
  const fill = backgroundFill[background]
  if (fill) {
    context.fillStyle = fill
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  for (const stroke of strokes) drawStroke(context, stroke, fill)
}
