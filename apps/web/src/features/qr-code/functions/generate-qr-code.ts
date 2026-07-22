import QRCode from 'qrcode'
import type { GenerateQrCodeOptions } from '../types/qr-code'

export const generateQrCode = (input: string, options: GenerateQrCodeOptions) =>
  QRCode.toDataURL(input, {
    width: options.size,
    margin: 2,
    errorCorrectionLevel: options.level,
  })
