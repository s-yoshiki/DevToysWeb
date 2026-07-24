'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SegmentedControl } from '@/components/segmented-control'
import { WorkspaceShell } from '@/components/workspace-shell'
import type { AngleMode } from '@/features/calculator/expression'
import { constantNames, functionNames } from '@/features/calculator/expression'
import type { WorkspaceProps } from '@/workspaces/types'
import { useTranslate } from '@/hooks/use-translate'
import { basicKeys, scientificKeys } from '../functions/keypads'
import { useCalculator } from '../hooks/use-calculator'
import { CalculatorDisplay, CalculatorHistory, CalculatorKeypad } from './calculator-panels'

const memoryKeys = [
  { label: 'MC', mode: 'clear' as const },
  { label: 'MR', mode: 'recall' as const },
  { label: 'M+', mode: 'add' as const },
  { label: 'M−', mode: 'subtract' as const },
]

export const ScientificCalculatorWorkspace = ({ tool }: WorkspaceProps) => {
  const t = useTranslate()
  const calculator = useCalculator()

  return (
    <WorkspaceShell tool={tool} onClear={calculator.clearAll}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <CalculatorDisplay calculator={calculator} inputId="scientific-expression" />
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-2">
                  <Label>{t('角度の単位', 'Angle unit')}</Label>
                  <SegmentedControl<AngleMode>
                    value={calculator.angleMode}
                    options={[
                      { value: 'deg', label: 'DEG' },
                      { value: 'rad', label: 'RAD' },
                    ]}
                    onChange={calculator.setAngleMode}
                    label={t('角度の単位', 'Angle unit')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {calculator.memory !== null && (
                    <Badge variant="outline" className="font-mono text-[11px]">
                      M = {calculator.memory}
                    </Badge>
                  )}
                  {memoryKeys.map((key) => (
                    <Button
                      key={key.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => calculator.applyMemory(key.mode)}
                    >
                      {key.label}
                    </Button>
                  ))}
                </div>
              </div>
              <CalculatorKeypad calculator={calculator} keys={scientificKeys} columns={5} />
              <CalculatorKeypad calculator={calculator} keys={basicKeys} columns={4} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <CalculatorHistory calculator={calculator} />
          <Card className="border-border/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t('使える関数と定数', 'Functions and constants')}
              </p>
              <p className="font-mono text-xs leading-6 text-muted-foreground">
                {functionNames.join(' · ')}
              </p>
              <p className="font-mono text-xs leading-6 text-muted-foreground">
                {constantNames.join(' · ')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  )
}
