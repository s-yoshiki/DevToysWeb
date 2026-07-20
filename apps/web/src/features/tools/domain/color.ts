export type Rgba = { r: number; g: number; b: number; a: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const round = (value: number, digits = 0) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const expandHex = (hex: string) =>
  hex.length === 3 || hex.length === 4
    ? hex
        .split('')
        .map((char) => char + char)
        .join('')
    : hex

const hslToRgb = (h: number, s: number, l: number): Omit<Rgba, 'a'> => {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const sector = (((h % 360) + 360) % 360) / 60
  const second = chroma * (1 - Math.abs((sector % 2) - 1))
  const [r, g, b] = (
    [
      [chroma, second, 0],
      [second, chroma, 0],
      [0, chroma, second],
      [0, second, chroma],
      [second, 0, chroma],
      [chroma, 0, second],
    ] as const
  )[Math.floor(sector) % 6]
  const match = l - chroma / 2
  return { r: (r + match) * 255, g: (g + match) * 255, b: (b + match) * 255 }
}

/**
 * Accepts the CSS notations a developer is likely to paste: hex (3/4/6/8 digits),
 * `rgb()`/`rgba()` and `hsl()`/`hsla()`, with either comma or space separators.
 * Named colours are intentionally out of scope — they need a lookup table that
 * would dwarf this module.
 */
export const parseColor = (input: string): Rgba => {
  const value = input.trim().toLowerCase()
  if (!value) throw new Error('Enter a colour value')

  const hex = value.startsWith('#') ? value.slice(1) : ''
  if (hex) {
    if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(hex))
      throw new Error('Hex colours must use 3, 4, 6 or 8 digits')
    const full = expandHex(hex)
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
      a: full.length === 8 ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1,
    }
  }

  const functional = value.match(/^(rgba?|hsla?)\(([^)]+)\)$/)
  if (!functional) throw new Error('Unsupported colour format')
  const [, fn, body] = functional
  const parts = body.split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3) throw new Error('Expected at least three colour components')

  const numeric = (raw: string, scale: number) => {
    const parsed = Number.parseFloat(raw)
    if (Number.isNaN(parsed)) throw new Error(`Invalid colour component: ${raw}`)
    return raw.includes('%') ? (parsed / 100) * scale : parsed
  }
  const alpha = parts[3] === undefined ? 1 : clamp(numeric(parts[3], 1), 0, 1)

  if (fn.startsWith('rgb'))
    return {
      r: clamp(numeric(parts[0], 255), 0, 255),
      g: clamp(numeric(parts[1], 255), 0, 255),
      b: clamp(numeric(parts[2], 255), 0, 255),
      a: alpha,
    }

  return {
    ...hslToRgb(
      Number.parseFloat(parts[0]),
      clamp(numeric(parts[1], 1), 0, 1),
      clamp(numeric(parts[2], 1), 0, 1),
    ),
    a: alpha,
  }
}

export const toHex = ({ r, g, b, a }: Rgba) => {
  const pair = (channel: number) =>
    Math.round(clamp(channel, 0, 255))
      .toString(16)
      .padStart(2, '0')
  return `#${pair(r)}${pair(g)}${pair(b)}${a < 1 ? pair(a * 255) : ''}`
}

export const toRgbString = ({ r, g, b, a }: Rgba) =>
  a < 1
    ? `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${round(a, 3)})`
    : `rgb(${round(r)}, ${round(g)}, ${round(b)})`

export const toHsl = ({ r, g, b }: Rgba) => {
  const [red, green, blue] = [r / 255, g / 255, b / 255]
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  const hue =
    delta === 0
      ? 0
      : max === red
        ? 60 * (((green - blue) / delta) % 6)
        : max === green
          ? 60 * ((blue - red) / delta + 2)
          : 60 * ((red - green) / delta + 4)
  return { h: (hue + 360) % 360, s: saturation, l: lightness }
}

export const toHslString = (rgba: Rgba) => {
  const { h, s, l } = toHsl(rgba)
  const base = `${round(h)}, ${round(s * 100, 1)}%, ${round(l * 100, 1)}%`
  return rgba.a < 1 ? `hsla(${base}, ${round(rgba.a, 3)})` : `hsl(${base})`
}

const toLinear = (channel: number) => {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Converts to OKLCH, the perceptually uniform space modern CSS prefers. */
export const toOklch = ({ r, g, b }: Rgba) => {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)]
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const chroma = Math.hypot(a, bAxis)
  const hue = chroma < 1e-6 ? 0 : ((Math.atan2(bAxis, a) * 180) / Math.PI + 360) % 360
  return { l: lightness, c: chroma, h: hue }
}

export const toOklchString = (rgba: Rgba) => {
  const { l, c, h } = toOklch(rgba)
  const base = `${round(l * 100, 2)}% ${round(c, 4)} ${round(h, 2)}`
  return rgba.a < 1 ? `oklch(${base} / ${round(rgba.a, 3)})` : `oklch(${base})`
}

export const relativeLuminance = ({ r, g, b }: Rgba) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

export const contrastRatio = (foreground: Rgba, background: Rgba) => {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )
  return (light + 0.05) / (dark + 0.05)
}

/** WCAG 2.2 thresholds for normal (4.5) and large (3.0) text. */
export const wcagLevels = (ratio: number) => ({
  aaNormal: ratio >= 4.5,
  aaLarge: ratio >= 3,
  aaaNormal: ratio >= 7,
  aaaLarge: ratio >= 4.5,
})
