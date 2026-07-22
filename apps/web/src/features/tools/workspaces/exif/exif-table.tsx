'use client'

import { useTranslate } from '@/features/i18n/hooks/use-translate'
import type { ExifEntry } from '../../domain/exif'

export const ExifTable = ({ entries }: { entries: ExifEntry[] | null }) => {
  const t = useTranslate()

  if (entries === null)
    return (
      <p className="px-5 py-24 text-center text-sm text-muted-foreground">
        {t('JPEG画像を選択すると撮影情報を表示します', 'Choose a JPEG to inspect its capture data')}
      </p>
    )

  if (entries.length === 0)
    return (
      <p className="px-5 py-24 text-center text-sm text-muted-foreground">
        {t('この画像にEXIF情報はありません', 'This image carries no EXIF data')}
      </p>
    )

  return (
    <table className="w-full text-sm">
      <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-widest text-muted-foreground">
        <tr>
          <th className="px-5 py-2 font-semibold">{t('グループ', 'Group')}</th>
          <th className="px-5 py-2 font-semibold">{t('タグ', 'Tag')}</th>
          <th className="px-5 py-2 font-semibold">{t('値', 'Value')}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={`${entry.group}-${entry.tag}`} className="border-b last:border-b-0">
            <td className="px-5 py-2 text-muted-foreground">{entry.group}</td>
            <td className="px-5 py-2 font-medium">{entry.tag}</td>
            <td className="px-5 py-2 font-mono text-xs">{entry.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
