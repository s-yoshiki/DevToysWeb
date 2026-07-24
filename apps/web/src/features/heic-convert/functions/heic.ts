/**
 * HEIC/HEIF handling. Detection reads the ISO base media `ftyp` box directly so
 * the page never pays for the decoder just to look at a file, and decoding is
 * loaded on demand because libheif is several megabytes of WebAssembly.
 */

import type { ImageFormat } from '@/libs/domain/image'

/** Brands that mean "HEVC-coded still image". `avif` is deliberately absent. */
const heicBrands = new Set(['heic', 'heix', 'heim', 'heis', 'hevc', 'hevx', 'hevm', 'hevs', 'heif'])

/** Container brands that only say "ISO still image"; the sub-brands decide. */
const genericBrands = new Set(['mif1', 'msf1', 'miaf'])

const readBrand = (bytes: Uint8Array, offset: number) =>
  String.fromCharCode(...bytes.subarray(offset, offset + 4))

/**
 * Reads the leading `ftyp` box: major brand at byte 8, compatible brands from
 * byte 16 on. Generic containers count only when a HEVC brand is listed too.
 */
export const isHeicHeader = (bytes: Uint8Array) => {
  if (bytes.length < 12 || readBrand(bytes, 4) !== 'ftyp') return false

  const major = readBrand(bytes, 8)
  if (heicBrands.has(major)) return true
  if (!genericBrands.has(major)) return false

  for (let offset = 16; offset + 4 <= bytes.length; offset += 4)
    if (heicBrands.has(readBrand(bytes, offset))) return true
  return false
}

export const heicFileExtension = /\.(heic|heif|hif)$/i

export const isHeicFile = async (file: File) => {
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer())
  return isHeicHeader(header) || heicFileExtension.test(file.name)
}

/**
 * Decodes with libheif and re-encodes to a canvas-supported format. The CSP
 * build is used so the tool keeps working if the site ever adopts a policy
 * without `unsafe-eval`.
 */
export const convertHeic = async (file: File, format: ImageFormat, quality: number) => {
  const { heicTo } = await import('heic-to/csp')
  return heicTo({ blob: file, type: format, quality: quality / 100 })
}
