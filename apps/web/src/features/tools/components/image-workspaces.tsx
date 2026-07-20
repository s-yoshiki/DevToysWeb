'use client'

import { Download, MapPin, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import type { ToolDefinition } from '../domain/catalog'
import { type ExifEntry, hasLocationData, readExif } from '../domain/exif'
import { optimizeSvg, svgToDataUri } from '../domain/source-formatters'
import { CopyButton, SpecializedShell } from './specialized-workspaces'

const maxFileSize = 15 * 1024 * 1024

const formatBytes = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`

/* ------------------------------------------------------------------- svg -- */

const sampleSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Exported by an editor -->
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <title>Badge</title>
  <metadata>editor metadata</metadata>
  <circle cx="60" cy="60" r="52" fill="#2563eb" />
  <path d="M40 62 L54 76 L82 46" stroke="#fff" stroke-width="10" fill="none" />
</svg>`

export const SvgWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale, dictionary } = useLocale()
  const [input, setInput] = useState(sampleSvg)

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', dataUri: '', error: '' }
    try {
      const output = optimizeSvg(input)
      return { output, dataUri: svgToDataUri(output), error: '' }
    } catch (reason) {
      return {
        output: '',
        dataUri: '',
        error: reason instanceof Error ? reason.message : 'Invalid SVG',
      }
    }
  }, [input])

  const saved = input.length - result.output.length
  const ratio = input.length ? Math.max(0, (saved / input.length) * 100) : 0

  return (
    <SpecializedShell tool={tool} onClear={() => setInput('')}>
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium">
              {locale === 'ja' ? 'SVGを最適化' : 'Optimise SVG'}
            </CardTitle>
            {result.output && (
              <Badge variant="secondary" className="font-mono">
                {formatBytes(input.length)} → {formatBytes(result.output.length)} (−
                {ratio.toFixed(1)}%)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {result.error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 font-mono text-xs text-destructive">
              {result.error}
            </p>
          )}
          <div className="grid lg:grid-cols-2">
            <div className="flex min-h-[320px] flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center border-b px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {dictionary.input}
              </div>
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label={dictionary.input}
                className="min-h-72 flex-1 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-xs shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex min-h-[320px] items-center justify-center border-b bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px] p-6 lg:border-b-0">
              {result.dataUri && (
                // biome-ignore lint/performance/noImgElement: the source is a client-side data URI
                <img
                  src={result.dataUri}
                  alt={locale === 'ja' ? 'SVGプレビュー' : 'SVG preview'}
                  className="max-h-72 max-w-full"
                />
              )}
            </div>
          </div>
          <div className="border-t">
            <div className="flex h-11 items-center justify-between border-b bg-muted/30 px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {locale === 'ja' ? '最適化後のSVG' : 'Optimised SVG'}
              </span>
              <CopyButton value={result.output} />
            </div>
            <Textarea
              readOnly
              value={result.output}
              aria-label={locale === 'ja' ? '最適化後のSVG' : 'Optimised SVG'}
              className="min-h-32 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-xs shadow-none focus-visible:ring-0"
            />
            <div className="flex h-11 items-center justify-between border-y bg-muted/30 px-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                CSS data URI
              </span>
              <CopyButton value={result.dataUri} />
            </div>
            <Textarea
              readOnly
              value={result.dataUri}
              aria-label="CSS data URI"
              className="min-h-24 resize-none rounded-none border-0 bg-transparent p-5 font-mono text-xs shadow-none focus-visible:ring-0"
            />
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

/* --------------------------------------------------------- image convert -- */

type OutputFormat = 'image/webp' | 'image/avif' | 'image/jpeg' | 'image/png'

const formatLabels: Record<OutputFormat, string> = {
  'image/webp': 'WebP',
  'image/avif': 'AVIF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
}

type ConvertedImage = { url: string; size: number; width: number; height: number; type: string }

export const ImageConvertWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [source, setSource] = useState<{ file: File; url: string } | null>(null)
  const [format, setFormat] = useState<OutputFormat>('image/webp')
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1600)
  const [result, setResult] = useState<ConvertedImage | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Object URLs are retained by the browser until explicitly revoked.
  useEffect(() => {
    if (!source) return
    return () => URL.revokeObjectURL(source.url)
  }, [source])
  useEffect(() => {
    if (!result) return
    return () => URL.revokeObjectURL(result.url)
  }, [result])

  const loadFile = (file?: File) => {
    setError('')
    setResult(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(locale === 'ja' ? '画像ファイルを選択してください' : 'Select an image file')
      return
    }
    if (file.size > maxFileSize) {
      setError(locale === 'ja' ? '15MB以下の画像を選択してください' : 'Choose an image under 15 MB')
      return
    }
    // The effect above owns revocation, so this only has to publish the new URL.
    setSource({ file, url: URL.createObjectURL(file) })
  }

  const convert = async () => {
    if (!source) return
    setBusy(true)
    setError('')
    try {
      const bitmap = await createImageBitmap(source.file)
      const scale = maxWidth > 0 && bitmap.width > maxWidth ? maxWidth / bitmap.width : 1
      const width = Math.round(bitmap.width * scale)
      const height = Math.round(bitmap.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas 2D is unavailable in this browser')
      context.drawImage(bitmap, 0, 0, width, height)
      bitmap.close()

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, quality / 100),
      )
      // Safari silently falls back to PNG for formats it cannot encode.
      if (!blob) throw new Error(`${formatLabels[format]} encoding is not supported here`)
      if (blob.type !== format)
        throw new Error(
          `${formatLabels[format]} is not supported by this browser (got ${blob.type})`,
        )

      setResult({ url: URL.createObjectURL(blob), size: blob.size, width, height, type: blob.type })
    } catch (reason) {
      setResult(null)
      setError(reason instanceof Error ? reason.message : 'Conversion failed')
    } finally {
      setBusy(false)
    }
  }

  const saved = source && result ? source.file.size - result.size : 0

  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setSource(null)
        setResult(null)
        setError('')
      }}
    >
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {locale === 'ja' ? '変換設定' : 'Conversion settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image-file">
                {locale === 'ja' ? '画像ファイル（最大15MB）' : 'Image file (max 15 MB)'}
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(event) => loadFile(event.target.files?.[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>{locale === 'ja' ? '出力形式' : 'Output format'}</Label>
              <fieldset
                className="flex flex-wrap gap-1 rounded-lg border bg-background p-1"
                aria-label={locale === 'ja' ? '出力形式' : 'Output format'}
              >
                {(Object.keys(formatLabels) as OutputFormat[]).map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={format === value ? 'default' : 'ghost'}
                    onClick={() => setFormat(value)}
                    className="h-7 px-2.5"
                  >
                    {formatLabels[value]}
                  </Button>
                ))}
              </fieldset>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-quality">
                {locale === 'ja' ? `品質 (${quality}%)` : `Quality (${quality}%)`}
              </Label>
              <Input
                id="image-quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                disabled={format === 'image/png'}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-width">
                {locale === 'ja' ? '最大幅 (px, 0で無効)' : 'Max width (px, 0 disables)'}
              </Label>
              <Input
                id="image-width"
                type="number"
                min={0}
                max={10000}
                value={maxWidth}
                onChange={(event) => setMaxWidth(Number(event.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={convert} disabled={!source || busy}>
                {busy
                  ? locale === 'ja'
                    ? '変換中…'
                    : 'Converting…'
                  : locale === 'ja'
                    ? '変換する'
                    : 'Convert'}
              </Button>
            </div>
          </div>
          {error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="grid min-h-[340px] lg:grid-cols-2">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {locale === 'ja' ? '元画像' : 'Original'}
                </span>
                {source && (
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {formatBytes(source.file.size)}
                  </Badge>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center p-6">
                {source ? (
                  // biome-ignore lint/performance/noImgElement: the source is a local object URL
                  <img
                    src={source.url}
                    alt={locale === 'ja' ? '元画像' : 'Original image'}
                    className="max-h-72 max-w-full"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja' ? '画像を選択してください' : 'Choose an image to start'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col bg-muted/15">
              <div className="flex h-11 items-center justify-between border-b px-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {locale === 'ja' ? '変換後' : 'Converted'}
                </span>
                {result && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {result.width}×{result.height} · {formatBytes(result.size)}
                      {saved > 0 && ` (−${((saved / (source?.file.size ?? 1)) * 100).toFixed(0)}%)`}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <a
                          href={result.url}
                          download={`converted.${formatLabels[format].toLowerCase()}`}
                        />
                      }
                    >
                      <Download className="size-4" />
                      {locale === 'ja' ? '保存' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center p-6">
                {result ? (
                  // biome-ignore lint/performance/noImgElement: the source is a local object URL
                  <img
                    src={result.url}
                    alt={locale === 'ja' ? '変換後の画像' : 'Converted image'}
                    className="max-h-72 max-w-full"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'ja' ? '結果がここに表示されます' : 'The result will appear here'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}

/* ------------------------------------------------------------------ exif -- */

export const ExifWorkspace = ({ tool }: { tool: ToolDefinition }) => {
  const { locale } = useLocale()
  const [fileName, setFileName] = useState('')
  const [entries, setEntries] = useState<ExifEntry[] | null>(null)
  const [cleaned, setCleaned] = useState<{ url: string; size: number } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cleaned) return
    return () => URL.revokeObjectURL(cleaned.url)
  }, [cleaned])

  const loadFile = async (file?: File) => {
    setError('')
    setEntries(null)
    setCleaned(null)
    if (!file) return
    if (file.size > maxFileSize) {
      setError(locale === 'ja' ? '15MB以下の画像を選択してください' : 'Choose an image under 15 MB')
      return
    }
    setFileName(file.name)
    try {
      setEntries(readExif(await file.arrayBuffer()))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read EXIF')
    }
  }

  /** Re-encoding through a canvas drops every metadata segment by construction. */
  const strip = async (file?: File) => {
    if (!file) return
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas 2D is unavailable in this browser')
      context.drawImage(bitmap, 0, 0)
      bitmap.close()
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.92),
      )
      if (!blob) throw new Error('Could not re-encode the image')
      setCleaned({ url: URL.createObjectURL(blob), size: blob.size })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not strip metadata')
    }
  }

  const [file, setFile] = useState<File | null>(null)
  const located = entries ? hasLocationData(entries) : false

  return (
    <SpecializedShell
      tool={tool}
      onClear={() => {
        setEntries(null)
        setCleaned(null)
        setFile(null)
        setError('')
      }}
    >
      <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03]">
        <CardHeader className="border-b bg-muted/30 py-4">
          <CardTitle className="text-sm font-medium">
            {locale === 'ja' ? 'EXIFを読み取る' : 'Read EXIF'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-5 border-b bg-muted/20 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="exif-file">
                {locale === 'ja' ? 'JPEG画像（最大15MB）' : 'JPEG image (max 15 MB)'}
              </Label>
              <Input
                id="exif-file"
                type="file"
                accept="image/jpeg,image/jpg"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null
                  setFile(selected)
                  void loadFile(selected ?? undefined)
                }}
              />
            </div>
            <Button
              variant="outline"
              disabled={!file}
              onClick={() => void strip(file ?? undefined)}
            >
              <ShieldCheck className="size-4" />
              {locale === 'ja' ? 'メタデータを削除' : 'Strip metadata'}
            </Button>
          </div>
          {error && (
            <p className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          {located && (
            <p className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-700 dark:text-amber-400">
              <MapPin className="size-4 shrink-0" />
              {locale === 'ja'
                ? 'この画像には位置情報が含まれています。共有前に削除を検討してください。'
                : 'This image carries GPS coordinates. Consider stripping them before sharing.'}
            </p>
          )}
          {cleaned && (
            <div className="flex flex-wrap items-center gap-3 border-b bg-emerald-500/10 px-5 py-3 text-sm">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>
                {locale === 'ja'
                  ? `メタデータを除去しました（${formatBytes(cleaned.size)}）`
                  : `Metadata removed (${formatBytes(cleaned.size)})`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<a href={cleaned.url} download={`clean-${fileName || 'image.jpg'}`} />}
              >
                <Download className="size-4" />
                {locale === 'ja' ? '保存' : 'Save'}
              </Button>
            </div>
          )}
          <div className="min-h-[340px]">
            {entries === null ? (
              <p className="px-5 py-24 text-center text-sm text-muted-foreground">
                {locale === 'ja'
                  ? 'JPEG画像を選択すると撮影情報を表示します'
                  : 'Choose a JPEG to inspect its capture data'}
              </p>
            ) : entries.length === 0 ? (
              <p className="px-5 py-24 text-center text-sm text-muted-foreground">
                {locale === 'ja'
                  ? 'この画像にEXIF情報はありません'
                  : 'This image carries no EXIF data'}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2 font-semibold">
                      {locale === 'ja' ? 'グループ' : 'Group'}
                    </th>
                    <th className="px-5 py-2 font-semibold">{locale === 'ja' ? 'タグ' : 'Tag'}</th>
                    <th className="px-5 py-2 font-semibold">{locale === 'ja' ? '値' : 'Value'}</th>
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
            )}
          </div>
        </CardContent>
      </Card>
    </SpecializedShell>
  )
}
