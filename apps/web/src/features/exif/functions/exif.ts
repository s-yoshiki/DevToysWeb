export type ExifEntry = { group: string; tag: string; value: string }

/** Only the tags a developer usually cares about; unknown ids are reported by number. */
const tagNames: Record<number, string> = {
  270: 'ImageDescription',
  271: 'Make',
  272: 'Model',
  274: 'Orientation',
  282: 'XResolution',
  283: 'YResolution',
  305: 'Software',
  306: 'DateTime',
  315: 'Artist',
  33432: 'Copyright',
  33434: 'ExposureTime',
  33437: 'FNumber',
  34855: 'ISOSpeedRatings',
  36867: 'DateTimeOriginal',
  36868: 'DateTimeDigitized',
  37377: 'ShutterSpeedValue',
  37378: 'ApertureValue',
  37386: 'FocalLength',
  40962: 'PixelXDimension',
  40963: 'PixelYDimension',
  42032: 'CameraOwnerName',
  42033: 'BodySerialNumber',
  42035: 'LensMake',
  42036: 'LensModel',
  42037: 'LensSerialNumber',
}

const gpsTagNames: Record<number, string> = {
  1: 'GPSLatitudeRef',
  2: 'GPSLatitude',
  3: 'GPSLongitudeRef',
  4: 'GPSLongitude',
  5: 'GPSAltitudeRef',
  6: 'GPSAltitude',
  7: 'GPSTimeStamp',
  29: 'GPSDateStamp',
}

const orientationLabels: Record<number, string> = {
  1: '1 (normal)',
  2: '2 (flipped horizontally)',
  3: '3 (rotated 180°)',
  4: '4 (flipped vertically)',
  5: '5 (transposed)',
  6: '6 (rotated 90° CW)',
  7: '7 (transverse)',
  8: '8 (rotated 270° CW)',
}

/** Bytes per component, indexed by the TIFF type code. */
const typeSizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

type Reader = { view: DataView; little: boolean; tiffStart: number }

const readValue = (reader: Reader, type: number, count: number, offset: number): string => {
  const { view, little } = reader
  const values: (number | string)[] = []

  for (let index = 0; index < count; index += 1) {
    const at = offset + index * (typeSizes[type] ?? 1)
    if (at + (typeSizes[type] ?? 1) > view.byteLength) break
    switch (type) {
      case 1:
      case 7:
        values.push(view.getUint8(at))
        break
      case 2:
        values.push(String.fromCharCode(view.getUint8(at)))
        break
      case 3:
        values.push(view.getUint16(at, little))
        break
      case 4:
        values.push(view.getUint32(at, little))
        break
      case 5: {
        const denominator = view.getUint32(at + 4, little)
        values.push(denominator ? view.getUint32(at, little) / denominator : 0)
        break
      }
      case 9:
        values.push(view.getInt32(at, little))
        break
      case 10: {
        const denominator = view.getInt32(at + 4, little)
        values.push(denominator ? view.getInt32(at, little) / denominator : 0)
        break
      }
      default:
        values.push(view.getUint8(at))
    }
  }

  // ASCII strings are NUL-terminated and should read as one value, not a list.
  if (type === 2) return values.join('').replace(/\0+$/, '').trim()
  return values
    .map((value) => (typeof value === 'number' ? Number(value.toFixed(6)) : value))
    .join(', ')
}

const readIfd = (
  reader: Reader,
  ifdOffset: number,
  group: string,
  names: Record<number, string>,
  entries: ExifEntry[],
) => {
  const { view, little, tiffStart } = reader
  const base = tiffStart + ifdOffset
  if (base + 2 > view.byteLength) return { subIfd: 0, gpsIfd: 0 }

  const count = view.getUint16(base, little)
  let subIfd = 0
  let gpsIfd = 0

  for (let index = 0; index < count; index += 1) {
    const entry = base + 2 + index * 12
    if (entry + 12 > view.byteLength) break

    const tag = view.getUint16(entry, little)
    const type = view.getUint16(entry + 2, little)
    const components = view.getUint32(entry + 4, little)
    const byteLength = (typeSizes[type] ?? 1) * components
    const valueOffset = byteLength <= 4 ? entry + 8 : tiffStart + view.getUint32(entry + 8, little)

    if (tag === 0x8769) {
      subIfd = view.getUint32(entry + 8, little)
      continue
    }
    if (tag === 0x8825) {
      gpsIfd = view.getUint32(entry + 8, little)
      continue
    }

    const name = names[tag]
    if (!name) continue

    const raw = readValue(reader, type, components, valueOffset)
    entries.push({
      group,
      tag: name,
      value: name === 'Orientation' ? (orientationLabels[Number(raw)] ?? raw) : raw,
    })
  }

  return { subIfd, gpsIfd }
}

/**
 * Reads EXIF out of the JPEG APP1 segment. Returns an empty list for images that
 * carry no EXIF at all (PNG, WebP and most exported JPEGs).
 */
export const readExif = (buffer: ArrayBuffer): ExifEntry[] => {
  const view = new DataView(buffer)
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8)
    throw new Error('EXIF can only be read from JPEG files')

  let offset = 2
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break
    const marker = view.getUint8(offset + 1)
    const size = view.getUint16(offset + 2)

    if (marker === 0xe1) {
      const app1 = offset + 4
      // "Exif\0\0" identifies the payload; other APP1 blocks hold XMP.
      if (view.getUint32(app1) !== 0x45786966) {
        offset += 2 + size
        continue
      }
      const tiffStart = app1 + 6
      const endian = view.getUint16(tiffStart)
      if (endian !== 0x4949 && endian !== 0x4d4d) throw new Error('Malformed TIFF header in EXIF')

      const reader: Reader = { view, little: endian === 0x4949, tiffStart }
      const entries: ExifEntry[] = []
      const ifd0 = view.getUint32(tiffStart + 4, reader.little)
      const { subIfd, gpsIfd } = readIfd(reader, ifd0, 'Image', tagNames, entries)
      if (subIfd) readIfd(reader, subIfd, 'Exif', tagNames, entries)
      if (gpsIfd) readIfd(reader, gpsIfd, 'GPS', gpsTagNames, entries)
      return entries
    }

    if (marker === 0xda) break // Start of scan: no metadata follows.
    offset += 2 + size
  }

  return []
}

export const hasLocationData = (entries: ExifEntry[]) =>
  entries.some((entry) => entry.group === 'GPS')
