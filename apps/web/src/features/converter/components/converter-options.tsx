'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Converter } from '../hooks/use-converter'

const OptionsRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-4 border-b bg-muted/20 p-5 sm:grid-cols-2">{children}</div>
)

const NumberOption = ({
  id,
  label,
  min,
  max,
  value,
  onChange,
}: {
  id: string
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </div>
)

export const GeneratorOptions = ({
  converter,
  withLength,
}: {
  converter: Converter
  withLength: boolean
}) => (
  <OptionsRow>
    <NumberOption
      id="count"
      label="Count"
      min={1}
      max={50}
      value={converter.options.count}
      onChange={(count) => converter.updateOptions({ count })}
    />
    {withLength && (
      <NumberOption
        id="length"
        label="Length"
        min={8}
        max={128}
        value={converter.options.length}
        onChange={(length) => converter.updateOptions({ length })}
      />
    )}
  </OptionsRow>
)

export const NumberBaseOptions = ({ converter }: { converter: Converter }) => (
  <OptionsRow>
    <NumberOption
      id="base-from"
      label="From base"
      min={2}
      max={36}
      value={converter.options.from}
      onChange={(from) => converter.updateOptions({ from })}
    />
    <NumberOption
      id="base-to"
      label="To base"
      min={2}
      max={36}
      value={converter.options.to}
      onChange={(to) => converter.updateOptions({ to })}
    />
  </OptionsRow>
)
