import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  Trophy, 
  Play, 
  Books,
  Star,
  Lock,
  Check,
  ArrowRight,
  Confetti as ConfettiIcon
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Toaster, toast } from 'sonner'
import { RULES, getQuizzesForRule } from '@/lib/rules'
import { RuleLesson } from '@/components/RuleLesson'
import { RuleQuiz } from '@/components/RuleQuiz'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import { QuickReference } from '@/components/QuickReference'
import { Confetti } from '@/components/Confetti'
import { RetroDecorations } from '@/components/RetroDecorations'

export interface RuleProgress {
  ruleId: string
  read: boolean
  quizScore: number | null
  quizAttempts: number
  mastered: boolean
}

function App() {
  const [progress, setProgress] = useKV<RuleProgress[]>('rule-progress', 
    RULES.map(rule => ({
      ruleId: rule.id,
      read: false,
      quizScore: null,
      quizAttempts: 0,
      mastered: false
    }))
  )
  
  const [currentRuleIndex, setCurrentRuleIndex] = useKV<number>('current-rule-index', 0)
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'progress' | 'reference'>('learn')
  const [showConfetti, setShowConfetti] = useState(false)
  const [totalPoints, setTotalPoints] = useKV<number>('total-points', 0)

  const ruleIndex = currentRuleIndex ?? 0
  const currentRule = RULES[ruleIndex]
  const currentProgress = progress?.find(p => p.ruleId === currentRule?.id)
  const totalRules = RULES.length
  const completedRules = progress?.filter(p => p.read).length || 0
  const masteredRules = progress?.filter(p => p.mastered).length || 0
  const allRulesRead = progress?.every(p => p.read) || false
  const allRulesMastered = progress?.every(p => p.mastered) || false

  const overallProgress = (completedRules / totalRules) * 100

  useEffect(() => {
    if (allRulesMastered && masteredRules === totalRules) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [allRulesMastered, masteredRules, totalRules])

  const handleRuleComplete = () => {
    if (!currentProgress?.read && progress) {
      setProgress(current => 
        current!.map(p => 
          p.ruleId === currentRule.id ? { ...p, read: true } : p
        )
      )
      toast.success('Rule completed! Moving to next rule...', {
        description: `You've read ${completedRules + 1} of ${totalRules} rules`
      })
      
      setTimeout(() => {
        const nextIndex = ruleIndex + 1
        if (nextIndex < RULES.length) {
          setCurrentRuleIndex(nextIndex)
        } else {
          toast.success('All rules read! Take quizzes to master them!', {
            description: 'Switch to the Quiz tab to test your knowledge'
          })
          setActiveTab('progress')
        }
      }, 1500)
    }
  }

  const handleQuizComplete = (score: number, perfect: boolean) => {
    if (!progress) return
    
    const quizQuestions = getQuizzesForRule(currentRule.id).length
    const newPoints = score * 10
    
    setProgress(current => 
      current!.map(p => 
        p.ruleId === currentRule.id
          ? { 
              ...p, 
              quizScore: score,
              quizAttempts: p.quizAttempts + 1,
              mastered: perfect
            }
          : p
      )
    )

    setTotalPoints(current => (current || 0) + newPoints)

    if (perfect) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      toast.success('Perfect score! Rule mastered! 🎉', {
        description: `+${newPoints} points earned`
      })
    } else {
      toast.success(`Quiz complete! ${score}/${quizQuestions} correct`, {
        description: `+${newPoints} points earned. ${perfect ? 'Rule mastered!' : 'Try again for a perfect score!'}`
      })
    }
  }

  const handleRuleSelect = (ruleIndex: number) => {
    const targetProgress = progress?.[ruleIndex]
    
    if (ruleIndex === 0 || (ruleIndex > 0 && progress?.[ruleIndex - 1]?.read)) {
      setCurrentRuleIndex(ruleIndex)
      setActiveTab('learn')
    } else {
      toast.error('Complete previous rules first!', {
        description: 'Rules must be completed in order'
      })
    }
  }

  const canAccessQuiz = currentProgress?.read || false

  if (!progress || !currentRule) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen relative">
      <Toaster position="top-right" />
      {showConfetti && <Confetti />}
      <RetroDecorations />

      <div className="relative overflow-hidden pb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-cyan-300/30 to-yellow-300/30" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-6 space-y-6 z-10">
        <motion.header 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 retro-border bg-gradient-to-br from-pink-200 to-purple-200" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <ShieldCheck className="h-8 w-8 text-primary sparkle" weight="fill" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight retro-text-shadow">
                  Learn Community Rules
                </h1>
                <p className="text-lg font-bold" style={{ 
                  background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'marquee 3s linear infinite'
                }}>
                  ★·.·´¯`·.·★ Azure Community • Interactive Learning ★·.·´¯`·.·★
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right retro-card p-4">
                <p className="text-sm font-bold text-purple-600">⭐ Total Points ⭐</p>
                <p className="text-3xl font-bold font-mono pulse-glow" style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{totalPoints}</p>
              </div>
              {allRulesMastered && (
                <Badge className="retro-border px-4 py-2 text-base font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bounce-in">
                  <Trophy className="h-4 w-4 mr-1 sparkle" weight="fill" />
                  Rules Master!!!
                </Badge>
              )}
            </div>
          </div>

          <Card className="retro-card p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-purple-700">✿ Overall Progress ✿</span>
                <span className="text-cyan-700">
                  {completedRules}/{totalRules} rules completed • {masteredRules} mastered ⭐
                </span>
              </div>
              <Progress value={overallProgress} className="h-4 border-4 border-double border-purple-500" />
            </div>
          </Card>
        </motion.header>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 retro-border bg-gradient-to-r from-pink-200 via-cyan-200 to-yellow-200">
            <TabsTrigger value="learn" className="gap-2 py-3 font-bold border-2 border-purple-400 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-300 data-[state=active]:to-purple-300 data-[state=active]:retro-text-shadow">
              <Books className="h-4 w-4" weight="fill" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2 py-3 font-bold border-2 border-cyan-400 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-300 data-[state=active]:to-blue-300 data-[state=active]:retro-text-shadow" disabled={!canAccessQuiz}>
              <Play className="h-4 w-4" weight="fill" />
              <span className="hidden sm:inline">Quiz</span>
              {!canAccessQuiz && <Lock className="h-3 w-3" />}
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2 py-3 font-bold border-2 border-yellow-400 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-300 data-[state=active]:to-orange-300 data-[state=active]:retro-text-shadow">
              <Trophy className="h-4 w-4" weight="fill" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2 py-3 font-bold border-2 border-green-400 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-300 data-[state=active]:to-emerald-300 data-[state=active]:retro-text-shadow">
              <ShieldCheck className="h-4 w-4" weight="fill" />
              <span className="hidden sm:inline">Reference</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="learn" className="space-y-6">
              <motion.div
                key={`learn-${ruleIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RuleLesson 
                  rule={currentRule}
                  isCompleted={currentProgress?.read || false}
                  onComplete={handleRuleComplete}
                  ruleNumber={ruleIndex + 1}
                  totalRules={totalRules}
                />
              </motion.div>

              {ruleIndex < RULES.length - 1 && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setCurrentRuleIndex(ruleIndex + 1)}
                    variant="ghost"
                    className="gap-2 font-bold retro-border"
                    disabled={!currentProgress?.read}
                  >
                    Skip to Next Rule
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <motion.div
                key={`quiz-${ruleIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {canAccessQuiz ? (
                  <RuleQuiz
                    rule={currentRule}
                    quizzes={getQuizzesForRule(currentRule.id)}
                    onComplete={handleQuizComplete}
                    previousScore={currentProgress?.quizScore ?? null}
                    isMastered={currentProgress?.mastered || false}
                  />
                ) : (
                  <Card className="retro-card p-12 text-center">
                    <Lock className="h-16 w-16 text-purple-600 mx-auto mb-4 sparkle" />
                    <h3 className="text-xl font-bold mb-2 retro-text-shadow">Quiz Locked</h3>
                    <p className="text-lg font-bold text-cyan-700 mb-4">
                      Complete the lesson first to unlock the quiz
                    </p>
                    <Button onClick={() => setActiveTab('learn')} className="retro-border font-bold">
                      Go to Lesson
                    </Button>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <ProgressDashboard
                rules={RULES}
                progress={progress}
                totalPoints={totalPoints || 0}
                onRuleSelect={handleRuleSelect}
              />
            </TabsContent>

            <TabsContent value="reference" className="space-y-6">
              <QuickReference rules={RULES} progress={progress} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

export default App
