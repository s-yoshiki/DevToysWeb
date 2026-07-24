/**
 * Minimal typings for the experimental BarcodeDetector API, which is not yet
 * part of the standard DOM lib. Only the members this tool touches are declared.
 */
export type DetectedBarcode = {
  rawValue: string
  format: string
}

export type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>
}

export type BarcodeDetectorCtor = {
  new (options?: { formats?: string[] }): BarcodeDetectorLike
  getSupportedFormats?: () => Promise<string[]>
}

export const getBarcodeDetector = (): BarcodeDetectorCtor | null => {
  if (typeof window === 'undefined') return null
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector ?? null
}
