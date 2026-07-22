'use client'

import { useLocale } from '@/components/locale-provider'
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
import type { Bilingual } from './types'

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
