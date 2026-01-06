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
      <Card className="retro-card p-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl sparkle" style={{ animation: 'float 2s ease-in-out infinite' }}>{rule.icon}</div>
              <div>
                <Badge variant="outline" className="mb-2 retro-border font-bold bg-gradient-to-r from-pink-200 to-purple-200">
                  ⭐ Rule {ruleNumber} of {totalRules} ⭐
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight retro-text-shadow">{rule.title}</h2>
              </div>
            </div>
            {isCompleted && (
              <Badge className="retro-border px-3 py-1 font-bold bg-gradient-to-br from-green-300 to-emerald-300 bounce-in">
                <Check className="h-4 w-4 mr-1" weight="bold" />
                Completed!!!
              </Badge>
            )}
          </div>

          <Separator className="border-4 border-double border-purple-400" />

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed font-semibold">
              {rule.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-purple-700">
              <Lightbulb className="h-5 w-5 sparkle" weight="fill" />
              <h3 className="text-xl">✨ Key Examples ✨</h3>
            </div>
            
            <div className="grid gap-3">
              {rule.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-4 border-4 border-double bg-gradient-to-r from-cyan-100 to-blue-100"
                  style={{ borderColor: ['#ff00ff', '#00ffff', '#ffff00'][idx % 3] }}
                >
                  <div className="mt-0.5 h-8 w-8 flex items-center justify-center flex-shrink-0 retro-border bg-gradient-to-br from-pink-300 to-purple-300">
                    <span className="font-bold text-lg">{idx + 1}</span>
                  </div>
                  <p className="text-base leading-relaxed font-semibold">{example}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <CheckCircle className="h-6 w-6 sparkle" weight="fill" />
                <h4 className="text-xl">✓ Do This ✓</h4>
              </div>
              <div className="space-y-2">
                {rule.doExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3 border-3 bg-gradient-to-br from-green-100 to-emerald-100 text-sm font-semibold"
                    style={{ border: '3px solid #00ff00' }}
                  >
                    ✓ {example}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <XCircle className="h-6 w-6" weight="fill" />
                <h4 className="text-xl">✗ Don't Do This ✗</h4>
              </div>
              <div className="space-y-2">
                {rule.dontExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-3 border-3 bg-gradient-to-br from-red-100 to-pink-100 text-sm font-semibold"
                    style={{ border: '3px solid #ff0000' }}
                  >
                    ✗ {example}
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
                className="gap-2 text-xl px-8 py-6 pulse-glow font-bold retro-border bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300"
              >
                <Check className="h-5 w-5 sparkle" weight="bold" />
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
