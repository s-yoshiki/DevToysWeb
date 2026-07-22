import type { ComponentType } from 'react'
import { Base64ImageWorkspace } from '@/features/base64-image'
import { BasicAuthWorkspace } from '@/features/basic-auth'
import { ColorWorkspace } from '@/features/color'
import { ConverterWorkspace } from '@/features/converter'
import { CronWorkspace } from '@/features/cron'
import { CurlWorkspace } from '@/features/curl'
import { ExifWorkspace } from '@/features/exif'
import { GithubSearchWorkspace } from '@/features/github-search'
import { GlobWorkspace } from '@/features/glob'
import { GmailSearchWorkspace } from '@/features/gmail-search'
import { GoogleSearchWorkspace } from '@/features/google-search'
import { HmacWorkspace } from '@/features/hmac'
import { ImageConvertWorkspace } from '@/features/image-convert'
import { JsonQueryWorkspace } from '@/features/json-query'
import { JwtWorkspace } from '@/features/jwt'
import { ListUtilsWorkspace } from '@/features/list-utils'
import { LoremWorkspace } from '@/features/lorem'
import { MarkdownWorkspace } from '@/features/markdown'
import { QrCodeWorkspace } from '@/features/qr-code'
import { RegexWorkspace } from '@/features/regex'
import { SelectorWorkspace } from '@/features/selector'
import { SiteDiagnosticsWorkspace } from '@/features/site-diagnostics'
import { StringEscapeWorkspace } from '@/features/string-escape'
import { SubnetWorkspace } from '@/features/subnet'
import { SvgWorkspace } from '@/features/svg'
import { TextAnalyzerWorkspace } from '@/features/text-analyzer'
import { TextDiffWorkspace } from '@/features/text-diff'
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
  color: ColorWorkspace,
  cron: CronWorkspace,
  curl: CurlWorkspace,
  exif: ExifWorkspace,
  'github-search': GithubSearchWorkspace,
  glob: GlobWorkspace,
  'gmail-search': GmailSearchWorkspace,
  'google-search': GoogleSearchWorkspace,
  hmac: HmacWorkspace,
  'image-convert': ImageConvertWorkspace,
  'json-query': JsonQueryWorkspace,
  jwt: JwtWorkspace,
  'list-utils': ListUtilsWorkspace,
  lorem: LoremWorkspace,
  markdown: MarkdownWorkspace,
  'qr-code': QrCodeWorkspace,
  regex: RegexWorkspace,
  selector: SelectorWorkspace,
  'site-diagnostics': SiteDiagnosticsWorkspace,
  'string-escape': StringEscapeWorkspace,
  subnet: SubnetWorkspace,
  svg: SvgWorkspace,
  'text-analyzer': TextAnalyzerWorkspace,
  'text-diff': TextDiffWorkspace,
  'url-parser': UrlParserWorkspace,
  'x-search': XSearchWorkspace,
}
