'use client'

import { ExternalLink } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/features/i18n/components/locale-provider'
import { cn } from '@/lib/utils'
import { CopyButton } from './specialized-workspaces'

export type Bilingual = { ja: string; en: string }

export const useTranslate = () => {
  const { locale } = useLocale()
  return (ja: string, en: string) => (locale === 'ja' ? ja : en)
}

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    {children}
  </h2>
)

const Field = ({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)

export const TextField = ({
  id,
  label,
  placeholder,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder?: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label} hint={hint}>
    <Input
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
)

export const NumberField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label}>
    <Input
      id={id}
      type="number"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
)

export const DateField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) => (
  <Field id={id} label={label}>
    <Input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} />
  </Field>
)

export const SwitchField = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) => (
  <div className="flex items-center justify-between gap-3">
    <Label htmlFor={id} className="text-sm font-normal">
      {label}
    </Label>
    <Switch id={id} checked={checked} onCheckedChange={onChange} />
  </div>
)

export const SelectField = <Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: Value
  options: { value: Value; label: Bilingual }[]
  onChange: (value: Value) => void
}) => {
  const { locale } = useLocale()
  return (
    <Field id={id} label={label}>
      <Select
        items={options.map((option) => ({ value: option.value, label: option.label[locale] }))}
        value={value}
        onValueChange={(next) => onChange((next as Value) ?? ('' as Value))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

/** Segmented control for a small, fixed set of choices such as filters and tabs. */
export const OptionGroup = <Value extends string>({
  label,
  value,
  options,
  inline,
  onChange,
}: {
  label: string
  value: Value
  options: { value: Value; label: Bilingual }[]
  inline?: boolean
  onChange: (value: Value) => void
}) => {
  const { locale } = useLocale()
  return (
    <div className={cn(inline ? 'flex flex-wrap items-center justify-between gap-2' : 'space-y-2')}>
      <span className="text-sm font-medium">{label}</span>
      <fieldset
        className="flex flex-wrap gap-1 rounded-lg border bg-background p-1"
        aria-label={label}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={value === option.value ? 'default' : 'ghost'}
            onClick={() => onChange(option.value)}
            className="h-7 px-3"
          >
            {option.label[locale]}
          </Button>
        ))}
      </fieldset>
    </div>
  )
}

/** Query preview, target URL and the button that leaves for the search engine. */
export const SearchPreview = ({
  query,
  url,
  queryId,
  actionLabel,
  children,
}: {
  query: string
  url: string
  queryId: string
  actionLabel: string
  children?: React.ReactNode
}) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:sticky lg:top-6 lg:col-span-2">
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="text-sm font-medium">{t('プレビュー', 'Preview')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={queryId}>{t('検索クエリ', 'Search query')}</Label>
            <CopyButton value={query} />
          </div>
          <Textarea
            id={queryId}
            readOnly
            value={query}
            placeholder={t(
              '条件を入力するとクエリが表示されます',
              'The query appears as you fill in filters',
            )}
            className="min-h-24 resize-none font-mono text-sm"
          />
        </div>
        {children}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('検索URL', 'Search URL')}</span>
            <CopyButton value={url} />
          </div>
          <p className="min-h-10 break-all rounded-lg border bg-muted/20 p-3 font-mono text-xs text-muted-foreground">
            {url || t('条件を入力するとURLが表示されます', 'The URL appears once a query exists')}
          </p>
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), 'w-full')}
          >
            <ExternalLink className="size-4" />
            {actionLabel}
          </a>
        ) : (
          <Button className="w-full" disabled>
            <ExternalLink className="size-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export const FiltersCard = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70 shadow-xl shadow-foreground/[0.03] lg:col-span-3">
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="text-sm font-medium">{t('検索条件', 'Search filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-5">{children}</CardContent>
    </Card>
  )
}
