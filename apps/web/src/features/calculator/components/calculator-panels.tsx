'use client'

import { History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyButton } from '@/features/tools/components/copy-button'
import { useTranslate } from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import type { CalculatorKey } from '../functions/keypads'
import type { Calculator } from '../hooks/use-calculator'

const toneClasses: Record<NonNullable<CalculatorKey['tone']>, string> = {
  digit: 'bg-background hover:bg-muted',
  operator: 'bg-muted/60 font-semibold hover:bg-muted',
  control: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  equals: 'bg-primary text-primary-foreground hover:bg-primary/85',
}

/** The expression line, its live result, and any parse failure. */
export const CalculatorDisplay = ({
  calculator,
  inputId,
}: {
  calculator: Calculator
  inputId: string
}) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70">
      <CardContent className="space-y-3 p-5">
        <Label
          htmlFor={inputId}
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          {t('式', 'Expression')}
        </Label>
        <Input
          id={inputId}
          value={calculator.expression}
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
          placeholder="12 * (3 + 4)"
          onChange={(event) => calculator.setExpression(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            calculator.commit()
          }}
          className="h-14 rounded-xl font-mono text-lg"
        />
        <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-muted/40 px-4 py-2">
          {calculator.error ? (
            <p className="font-mono text-sm text-destructive">{calculator.error}</p>
          ) : (
            <p className="truncate font-mono text-2xl font-semibold tabular-nums">
              {calculator.result || '0'}
            </p>
          )}
          <CopyButton value={calculator.result} />
        </div>
      </CardContent>
    </Card>
  )
}

export const CalculatorKeypad = ({
  calculator,
  keys,
  columns,
  className,
}: {
  calculator: Calculator
  keys: CalculatorKey[]
  columns: 4 | 5
  className?: string
}) => (
  <div
    className={cn(
      'grid gap-2',
      columns === 4 ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-5',
      className,
    )}
  >
    {keys.map((key) => (
      <Button
        key={key.label}
        variant="outline"
        onClick={() => {
          if (key.action === 'clear') return calculator.clear()
          if (key.action === 'backspace') return calculator.backspace()
          if (key.action === 'equals') return calculator.commit()
          if (key.insert) calculator.insert(key.insert)
        }}
        className={cn(
          'h-12 text-base',
          key.tone && toneClasses[key.tone],
          key.span === 2 && 'col-span-2',
        )}
      >
        {key.label}
      </Button>
    ))}
  </div>
)

/** Past evaluations, newest first; selecting one puts it back in the input. */
export const CalculatorHistory = ({ calculator }: { calculator: Calculator }) => {
  const t = useTranslate()
  return (
    <Card className="overflow-hidden border-border/70">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="size-4" />
          {t('計算履歴', 'History')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {calculator.history.length ? (
          <ul className="divide-y">
            {calculator.history.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => calculator.setExpression(entry.expression)}
                  className="flex w-full flex-col items-end gap-0.5 px-5 py-3 text-right transition-colors hover:bg-muted/50"
                >
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {entry.expression}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    = {entry.result}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            {t('計算するとここに残ります', 'Calculations you run appear here')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
