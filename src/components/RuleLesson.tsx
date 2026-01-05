import { motion } from 'framer-motion'
import { Check, Lightbulb, CheckCircle, XCircle } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Rule } from '@/lib/rules'

interface RuleLessonProps {
  rule: Rule
  isCompleted: boolean
  onComplete: () => void
  ruleNumber: number
  totalRules: number
}

export function RuleLesson({ rule, isCompleted, onComplete, ruleNumber, totalRules }: RuleLessonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-8 border-2">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{rule.icon}</div>
              <div>
                <Badge variant="outline" className="mb-2">
                  Rule {ruleNumber} of {totalRules}
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">{rule.title}</h2>
              </div>
            </div>
            {isCompleted && (
              <Badge className="bg-accent text-accent-foreground px-3 py-1">
                <Check className="h-4 w-4 mr-1" weight="bold" />
                Completed
              </Badge>
            )}
          </div>

          <Separator />

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-card-foreground">
              {rule.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="h-5 w-5" weight="fill" />
              <h3 className="text-lg font-semibold">Key Examples</h3>
            </div>
            
            <div className="grid gap-3">
              {rule.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <p className="text-base leading-relaxed">{example}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle className="h-5 w-5" weight="fill" />
                <h4 className="font-semibold">Do This</h4>
              </div>
              <div className="space-y-2">
                {rule.doExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-sm"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" weight="fill" />
                <h4 className="font-semibold">Don't Do This</h4>
              </div>
              <div className="space-y-2">
                {rule.dontExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {!isCompleted ? (
              <Button
                size="lg"
                onClick={onComplete}
                className="gap-2 text-lg px-8 py-6 pulse-glow"
              >
                <Check className="h-5 w-5" weight="bold" />
                Got It! Continue
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                disabled
              >
                <Check className="h-5 w-5" weight="bold" />
                Completed
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
