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
        <Card className="retro-card p-6 text-center">
          <div className="text-5xl font-bold font-mono pulse-glow mb-2" style={{
            background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{completedCount}/{rules.length}</div>
          <p className="text-sm font-bold text-purple-700">⭐ Rules Completed ⭐</p>
        </Card>

        <Card className="retro-card p-6 text-center">
          <div className="text-5xl font-bold font-mono pulse-glow mb-2" style={{
            background: 'linear-gradient(45deg, #00ff00, #ffff00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{masteredCount}/{rules.length}</div>
          <p className="text-sm font-bold text-green-700">✓ Rules Mastered ✓</p>
        </Card>

        <Card className="retro-card p-6 text-center">
          <div className="text-5xl font-bold font-mono sparkle mb-2" style={{
            background: 'linear-gradient(45deg, #ffff00, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>{totalPoints}</div>
          <p className="text-sm font-bold text-yellow-700">★ Total Points ★</p>
        </Card>
      </div>

      {masteredCount === rules.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bounce-in"
        >
          <Card className="retro-card p-8 text-center pulse-glow">
            <Trophy className="h-20 w-20 mx-auto mb-4 sparkle" weight="fill" style={{ color: '#ffff00' }} />
            <h3 className="text-3xl font-bold mb-2 retro-text-shadow">🎉 Congratulations!!! 🎉</h3>
            <p className="text-xl font-bold text-purple-700">
              You've mastered all community rules! You're now a Rules Master with {totalPoints} points!!!
            </p>
          </Card>
        </motion.div>
      )}

      <Card className="retro-card p-6">
        <h3 className="text-2xl font-bold mb-4 retro-text-shadow">✨ Your Progress ✨</h3>
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
                    w-full justify-start h-auto p-4 transition-all font-bold text-base
                    ${isLocked ? 'opacity-50 cursor-not-allowed border-2 border-gray-400' : 'retro-border hover:pulse-glow'}
                    ${isMastered ? 'bg-gradient-to-r from-green-200 to-emerald-200' : isRead ? 'bg-gradient-to-r from-cyan-100 to-blue-100' : 'bg-gradient-to-r from-pink-100 to-purple-100'}
                  `}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="text-4xl sparkle">{rule.icon}</div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{rule.title}</span>
                        {isMastered && (
                          <Badge className="retro-border text-xs font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bounce-in">
                            <Trophy className="h-3 w-3 mr-1 sparkle" weight="fill" />
                            Mastered!!!
                          </Badge>
                        )}
                        {isRead && !isMastered && (
                          <Badge variant="outline" className="text-xs font-bold border-2 border-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            Read ✓
                          </Badge>
                        )}
                        {isLocked && (
                          <Badge variant="outline" className="text-xs font-bold border-2 border-gray-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked 🔒
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm font-bold" style={{ color: '#6600cc' }}>
                        {quizScore !== null && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 sparkle" weight="fill" />
                            Quiz: {quizScore}/2 ⭐
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
