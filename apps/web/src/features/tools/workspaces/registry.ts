import type { ComponentType } from 'react'
import { Base64ImageWorkspace } from '@/features/base64-image'
import { BasicAuthWorkspace } from '@/features/basic-auth'
import { CalculatorWorkspace, ScientificCalculatorWorkspace } from '@/features/calculator'
import { ColorWorkspace } from '@/features/color'
import { ConverterWorkspace } from '@/features/converter'
import { CronWorkspace } from '@/features/cron'
import { CurlWorkspace } from '@/features/curl'
import { DrawingWorkspace } from '@/features/drawing'
import { ExifWorkspace } from '@/features/exif'
import { GithubSearchWorkspace } from '@/features/github-search'
import { GlobWorkspace } from '@/features/glob'
import { GmailSearchWorkspace } from '@/features/gmail-search'
import { GoogleSearchWorkspace } from '@/features/google-search'
import { HeicConvertWorkspace } from '@/features/heic-convert'
import { HmacWorkspace } from '@/features/hmac'
import { ImageCompressWorkspace } from '@/features/image-compress'
import { ImageConvertWorkspace } from '@/features/image-convert'
import { ImageFormatWorkspace } from '@/features/image-format'
import { JsonQueryWorkspace } from '@/features/json-query'
import { JwtWorkspace } from '@/features/jwt'
import { ListUtilsWorkspace } from '@/features/list-utils'
import { LoremWorkspace } from '@/features/lorem'
import { MarkdownWorkspace } from '@/features/markdown'
import { NumberBaseWorkspace } from '@/features/number-base'
import { OgpCheckWorkspace } from '@/features/ogp-check'
import { PngTransparentWorkspace } from '@/features/png-transparent'
import { QrCodeWorkspace } from '@/features/qr-code'
import { RegexWorkspace } from '@/features/regex'
import { SelectorWorkspace } from '@/features/selector'
import { SeoCheckWorkspace } from '@/features/seo-check'
import { SiteDiagnosticsWorkspace } from '@/features/site-diagnostics'
import { StopwatchWorkspace } from '@/features/stopwatch'
import { StringEscapeWorkspace } from '@/features/string-escape'
import { SubnetWorkspace } from '@/features/subnet'
import { SvgWorkspace } from '@/features/svg'
import { TextAnalyzerWorkspace } from '@/features/text-analyzer'
import { TextDiffWorkspace } from '@/features/text-diff'
import { TimeSignalWorkspace } from '@/features/time-signal'
import { TimerWorkspace } from '@/features/timer'
import { TimezoneWorkspace } from '@/features/timezone'
import { UnitConvertWorkspace } from '@/features/unit-convert'
import { UrlParserWorkspace } from '@/features/url-parser'
import { WhoisWorkspace } from '@/features/whois'
import { XSearchWorkspace } from '@/features/x-search'
import { BadgeWorkspace } from './badge/badge-workspace'
import type { WorkspaceKey, WorkspaceProps } from './types'

/**
 * Single lookup from a catalog entry's `workspace` discriminator to its
 * interface. Adding a tool means adding a folder and one line here.
 */
export const workspaces: Record<WorkspaceKey, ComponentType<WorkspaceProps>> = {
  default: ConverterWorkspace,
  'base64-image': Base64ImageWorkspace,
  badge: BadgeWorkspace,
  'basic-auth': BasicAuthWorkspace,
  calculator: CalculatorWorkspace,
  color: ColorWorkspace,
  cron: CronWorkspace,
  curl: CurlWorkspace,
  drawing: DrawingWorkspace,
  exif: ExifWorkspace,
  'github-search': GithubSearchWorkspace,
  glob: GlobWorkspace,
  'gmail-search': GmailSearchWorkspace,
  'google-search': GoogleSearchWorkspace,
  'heic-convert': HeicConvertWorkspace,
  hmac: HmacWorkspace,
  'image-compress': ImageCompressWorkspace,
  'image-convert': ImageConvertWorkspace,
  'image-format': ImageFormatWorkspace,
  'json-query': JsonQueryWorkspace,
  jwt: JwtWorkspace,
  'list-utils': ListUtilsWorkspace,
  lorem: LoremWorkspace,
  markdown: MarkdownWorkspace,
  'number-base': NumberBaseWorkspace,
  'ogp-check': OgpCheckWorkspace,
  'png-transparent': PngTransparentWorkspace,
  'qr-code': QrCodeWorkspace,
  regex: RegexWorkspace,
  'scientific-calculator': ScientificCalculatorWorkspace,
  selector: SelectorWorkspace,
  'seo-check': SeoCheckWorkspace,
  'site-diagnostics': SiteDiagnosticsWorkspace,
  stopwatch: StopwatchWorkspace,
  'string-escape': StringEscapeWorkspace,
  subnet: SubnetWorkspace,
  svg: SvgWorkspace,
  'text-analyzer': TextAnalyzerWorkspace,
  'text-diff': TextDiffWorkspace,
  'time-signal': TimeSignalWorkspace,
  timer: TimerWorkspace,
  timezone: TimezoneWorkspace,
  'unit-convert': UnitConvertWorkspace,
  'url-parser': UrlParserWorkspace,
  whois: WhoisWorkspace,
  'x-search': XSearchWorkspace,
}
