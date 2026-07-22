export const correctionLevels = ['L', 'M', 'Q', 'H'] as const

export type CorrectionLevel = (typeof correctionLevels)[number]

export type GenerateQrCodeOptions = {
  size: number
  level: CorrectionLevel
}
