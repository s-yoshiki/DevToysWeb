export type Rgb = { r: number; g: number; b: number }

/** Longest possible distance between two colours in RGB space. */
const maxDistance = Math.sqrt(3 * 255 ** 2)

export const parseHexColor = (value: string): Rgb | null => {
  const hex = value.trim().replace(/^#/, '')
  const full = hex.length === 3 ? [...hex].map((char) => char + char).join('') : hex
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  }
}

export const toHexColor = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('')}`

export const colorDistance = (a: Rgb, b: Rgb) =>
  Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)

export type KnockoutOptions = {
  /** 0–100. At 0 only exact matches go transparent. */
  tolerance: number
  /**
   * Fades pixels near the edge of the tolerance instead of cutting them, which
   * keeps anti-aliased outlines from turning into a jagged halo.
   */
  soften: boolean
}

/**
 * Clears every pixel close enough to `target`, in place, and reports how many
 * were affected. Works on a raw RGBA buffer so it stays testable without a DOM.
 */
export const knockOutColor = (
  pixels: Uint8ClampedArray,
  target: Rgb,
  { tolerance, soften }: KnockoutOptions,
) => {
  const threshold = (Math.min(100, Math.max(0, tolerance)) / 100) * maxDistance
  let cleared = 0

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue
    const distance = colorDistance(
      { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] },
      target,
    )
    if (distance > threshold) continue

    if (soften && threshold > 0) {
      // Alpha ramps from fully clear at the exact colour to untouched at the edge.
      const ratio = distance / threshold
      const alpha = Math.round(pixels[index + 3] * ratio)
      if (alpha < pixels[index + 3]) cleared += 1
      pixels[index + 3] = alpha
      continue
    }

    pixels[index + 3] = 0
    cleared += 1
  }

  return cleared
}
