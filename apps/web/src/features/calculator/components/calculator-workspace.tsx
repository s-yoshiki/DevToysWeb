'use client'

import { Card, CardContent } from '@/components/ui/card'
import { WorkspaceShell } from '@/features/tools/components/workspace-shell'
import type { WorkspaceProps } from '@/features/tools/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { basicKeys } from '../functions/keypads'
import { useCalculator } from '../hooks/use-calculator'
import { CalculatorDisplay, CalculatorHistory, CalculatorKeypad } from './calculator-panels'

export const CalculatorWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const calculator = useCalculator()

  return (
    <WorkspaceShell tool={tool} onClear={calculator.clearAll}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <CalculatorDisplay calculator={calculator} inputId="calculator-expression" />
          <Card className="border-border/70">
            <CardContent className="p-4">
              <CalculatorKeypad calculator={calculator} keys={basicKeys} columns={4} />
              <p className="mt-4 text-xs text-muted-foreground">
                {t(
                  'キーボードからも入力できます。Enterで確定します。',
                  'You can type directly as well; Enter commits the calculation.',
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        <CalculatorHistory calculator={calculator} />
      </div>
    </WorkspaceShell>
  )
}
