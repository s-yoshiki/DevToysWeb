import type { ComponentType } from 'react'
import { Base64ImageWorkspace } from './base64-image/base64-image-workspace'
import { BasicAuthWorkspace } from './basic-auth/basic-auth-workspace'
import { ColorWorkspace } from './color/color-workspace'
import { ConverterWorkspace } from './converter/converter-workspace'
import { CronWorkspace } from './cron/cron-workspace'
import { CurlWorkspace } from './curl/curl-workspace'
import { ExifWorkspace } from './exif/exif-workspace'
import { GithubSearchWorkspace } from './github-search/github-search-workspace'
import { GlobWorkspace } from './glob/glob-workspace'
import { GmailSearchWorkspace } from './gmail-search/gmail-search-workspace'
import { GoogleSearchWorkspace } from './google-search/google-search-workspace'
import { HmacWorkspace } from './hmac/hmac-workspace'
import { ImageConvertWorkspace } from './image-convert/image-convert-workspace'
import { JsonQueryWorkspace } from './json-query/json-query-workspace'
import { JwtWorkspace } from './jwt/jwt-workspace'
import { ListUtilsWorkspace } from './list-utils/list-utils-workspace'
import { LoremWorkspace } from './lorem/lorem-workspace'
import { MarkdownWorkspace } from './markdown/markdown-workspace'
import { QrCodeWorkspace } from './qr-code/qr-code-workspace'
import { RegexWorkspace } from './regex/regex-workspace'
import { SelectorWorkspace } from './selector/selector-workspace'
import { SiteDiagnosticsWorkspace } from './site-diagnostics/site-diagnostics-workspace'
import { StringEscapeWorkspace } from './string-escape/string-escape-workspace'
import { SubnetWorkspace } from './subnet/subnet-workspace'
import { SvgWorkspace } from './svg/svg-workspace'
import { TextAnalyzerWorkspace } from './text-analyzer/text-analyzer-workspace'
import { TextDiffWorkspace } from './text-diff/text-diff-workspace'
import type { WorkspaceKey, WorkspaceProps } from './types'
import { UrlParserWorkspace } from './url-parser/url-parser-workspace'
import { XSearchWorkspace } from './x-search/x-search-workspace'

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
