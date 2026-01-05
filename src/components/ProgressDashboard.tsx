import { motion } from 'framer-motion'
import { Check, Lock, Star, Trophy } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Rule } from '@/lib/rules'
import type { RuleProgress } from '@/App'

interface ProgressDashboardProps {
  rules: Rule[]
  progress: RuleProgress[]
  totalPoints: number
  onRuleSelect: (index: number) => void
}

export function ProgressDashboard({ rules, progress, totalPoints, onRuleSelect }: ProgressDashboardProps) {
  const completedCount = progress.filter(p => p.read).length
  const masteredCount = progress.filter(p => p.mastered).length
  const totalQuizScore = progress.reduce((sum, p) => sum + (p.quizScore || 0), 0)
  const totalQuizQuestions = rules.length * 2

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-2">
          <div className="text-4xl font-bold font-mono text-primary mb-1">{completedCount}/{rules.length}</div>
          <p className="text-sm text-muted-foreground">Rules Completed</p>
        </Card>

        <Card className="p-6 text-center border-2">
          <div className="text-4xl font-bold font-mono text-accent mb-1">{masteredCount}/{rules.length}</div>
          <p className="text-sm text-muted-foreground">Rules Mastered</p>
        </Card>

        <Card className="p-6 text-center border-2">
          <div className="text-4xl font-bold font-mono text-celebration mb-1">{totalPoints}</div>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </Card>
      </div>

      {masteredCount === rules.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center border-2 border-celebration bg-celebration/5">
            <Trophy className="h-16 w-16 text-celebration mx-auto mb-4" weight="fill" />
            <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
            <p className="text-muted-foreground">
              You've mastered all community rules! You're now a Rules Master with {totalPoints} points.
            </p>
          </Card>
        </motion.div>
      )}

      <Card className="p-6 border-2">
        <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
        <div className="space-y-3">
          {rules.map((rule, index) => {
            const ruleProgress = progress.find(p => p.ruleId === rule.id)
            const isLocked = index > 0 && !progress[index - 1]?.read
            const isRead = ruleProgress?.read || false
            const isMastered = ruleProgress?.mastered || false
            const quizScore = ruleProgress?.quizScore

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => onRuleSelect(index)}
                  disabled={isLocked}
                  variant="ghost"
                  className={`
                    w-full justify-start h-auto p-4 border-2 transition-all
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
                    ${isMastered ? 'border-accent bg-accent/5' : isRead ? 'border-primary/30' : 'border-border'}
                  `}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="text-3xl">{rule.icon}</div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{rule.title}</span>
                        {isMastered && (
                          <Badge className="bg-celebration text-white text-xs">
                            <Trophy className="h-3 w-3 mr-1" weight="fill" />
                            Mastered
                          </Badge>
                        )}
                        {isRead && !isMastered && (
                          <Badge variant="outline" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Read
                          </Badge>
                        )}
                        {isLocked && (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {quizScore !== null && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" weight="fill" />
                            Quiz: {quizScore}/2
                          </span>
                        )}
                        {ruleProgress && ruleProgress.quizAttempts > 0 && (
                          <span>{ruleProgress.quizAttempts} attempt{ruleProgress.quizAttempts !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
