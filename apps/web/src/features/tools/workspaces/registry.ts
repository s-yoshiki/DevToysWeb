import type { ComponentType } from 'react'
import { Base64ImageWorkspace } from '@/features/base64-image'
import { BasicAuthWorkspace } from '@/features/basic-auth'
import { CalculatorWorkspace, ScientificCalculatorWorkspace } from '@/features/calculator'
import { ColorWorkspace } from '@/features/color'
import { ConverterWorkspace } from '@/features/converter'
import { CronWorkspace } from '@/features/cron'
import { CurlWorkspace } from '@/features/curl'
import { ExifWorkspace } from '@/features/exif'
import { GithubSearchWorkspace } from '@/features/github-search'
import { GlobWorkspace } from '@/features/glob'
import { GmailSearchWorkspace } from '@/features/gmail-search'
import { GoogleSearchWorkspace } from '@/features/google-search'
import { HeicConvertWorkspace } from '@/features/heic-convert'
import { HmacWorkspace } from '@/features/hmac'
import { ImageConvertWorkspace } from '@/features/image-convert'
import { ImageFormatWorkspace } from '@/features/image-format'
import { JsonQueryWorkspace } from '@/features/json-query'
import { JwtWorkspace } from '@/features/jwt'
import { ListUtilsWorkspace } from '@/features/list-utils'
import { LoremWorkspace } from '@/features/lorem'
import { MarkdownWorkspace } from '@/features/markdown'
import { NumberBaseWorkspace } from '@/features/number-base'
import { QrCodeWorkspace } from '@/features/qr-code'
import { RegexWorkspace } from '@/features/regex'
import { SelectorWorkspace } from '@/features/selector'
import { SiteDiagnosticsWorkspace } from '@/features/site-diagnostics'
import { StringEscapeWorkspace } from '@/features/string-escape'
import { SubnetWorkspace } from '@/features/subnet'
import { SvgWorkspace } from '@/features/svg'
import { TextAnalyzerWorkspace } from '@/features/text-analyzer'
import { TextDiffWorkspace } from '@/features/text-diff'
import { TimezoneWorkspace } from '@/features/timezone'
import { UrlParserWorkspace } from '@/features/url-parser'
import { XSearchWorkspace } from '@/features/x-search'
import type { WorkspaceKey, WorkspaceProps } from './types'

/**
 * Single lookup from a catalog entry's `workspace` discriminator to its
 * interface. Adding a tool means adding a folder and one line here.
 */
export const workspaces: Record<WorkspaceKey, ComponentType<WorkspaceProps>> = {
  default: ConverterWorkspace,
  'base64-image': Base64ImageWorkspace,
  'basic-auth': BasicAuthWorkspace,
  calculator: CalculatorWorkspace,
  color: ColorWorkspace,
  cron: CronWorkspace,
  curl: CurlWorkspace,
  exif: ExifWorkspace,
  'github-search': GithubSearchWorkspace,
  glob: GlobWorkspace,
  'gmail-search': GmailSearchWorkspace,
  'google-search': GoogleSearchWorkspace,
  'heic-convert': HeicConvertWorkspace,
  hmac: HmacWorkspace,
  'image-convert': ImageConvertWorkspace,
  'image-format': ImageFormatWorkspace,
  'json-query': JsonQueryWorkspace,
  jwt: JwtWorkspace,
  'list-utils': ListUtilsWorkspace,
  lorem: LoremWorkspace,
  markdown: MarkdownWorkspace,
  'number-base': NumberBaseWorkspace,
  'qr-code': QrCodeWorkspace,
  regex: RegexWorkspace,
  'scientific-calculator': ScientificCalculatorWorkspace,
  selector: SelectorWorkspace,
  'site-diagnostics': SiteDiagnosticsWorkspace,
  'string-escape': StringEscapeWorkspace,
  subnet: SubnetWorkspace,
  svg: SvgWorkspace,
  'text-analyzer': TextAnalyzerWorkspace,
  'text-diff': TextDiffWorkspace,
  timezone: TimezoneWorkspace,
  'url-parser': UrlParserWorkspace,
  'x-search': XSearchWorkspace,
}
