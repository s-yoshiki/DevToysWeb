'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

/** Compact single-choice control for a small, fixed set of options. */
export const SegmentedControl = <Value extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: Value
  options: { value: Value; label: string }[]
  onChange: (value: Value) => void
  label: string
}) => (
  <fieldset
    className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted p-1"
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
        {option.label}
      </Button>
    ))}
  </fieldset>
)

export const ToggleRow = ({
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
