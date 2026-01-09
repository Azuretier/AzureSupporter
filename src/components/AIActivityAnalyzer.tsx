import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChartLine, TrendUp } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile } from '@/lib/types'

interface ActivityTip {
  category: string
  tip: string
  impact: 'high' | 'medium' | 'low'
}

interface AIActivityAnalyzerProps {
  profile: UserProfile
}

export function AIActivityAnalyzer({ profile }: AIActivityAnalyzerProps) {
  const [tips, setTips] = useState<ActivityTip[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTips = async () => {
    setIsGenerating(true)
    
    try {
      const daysSinceMember = Math.floor(
        (Date.now() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      const avgXpPerDay = profile.xp / daysSinceMember

      const prompt = `You are an AI analyzing community engagement patterns for Azure Community Discord members.

Member Stats:
- Level: ${profile.level} (${profile.rank} rank)
- Total XP: ${profile.xp}
- Days as member: ${daysSinceMember}
- Average XP per day: ${avgXpPerDay.toFixed(1)}
- Active roles: ${profile.roles.length}

Based on their engagement pattern, provide 3 specific, actionable tips to help them grow in the community. Return the result as a valid JSON object with a single property called "tips".

Return JSON in this exact format:
{
  "tips": [
    {
      "category": "Engagement" | "Contribution" | "Community" | "Learning",
      "tip": "One specific action they can take (be concise, max 12 words)",
      "impact": "high" | "medium" | "low"
    },
    ...two more tips
  ]
}

Make tips specific to their level and rank. High impact tips should lead to significant XP gains.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)
      setTips(parsed.tips || [])
    } catch {
      setTips([])
    } finally {
      setIsGenerating(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      default: return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="border-2 bg-gradient-to-br from-accent/5 via-transparent to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <ChartLine className="h-6 w-6 text-accent" weight="fill" />
            </div>
            <div>
              <CardTitle className="text-xl">Growth Tips</CardTitle>
              <CardDescription>
                AI-powered suggestions to boost your progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {tips.length === 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground text-sm">
                  Get personalized tips to maximize your community impact and XP gains.
                </p>
                <Button
                  onClick={generateTips}
                  variant="outline"
                  className="gap-2"
                >
                  <TrendUp className="h-4 w-4" weight="fill" />
                  Analyze My Activity
                </Button>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 rounded-lg border border-border space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs text-muted-foreground">Analyzing patterns...</span>
                </div>
              </motion.div>
            )}

            {tips.length > 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border-2 border-border bg-card"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {tip.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize border ${getImpactBadge(tip.impact)}`}
                          >
                            {tip.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-card-foreground font-medium leading-relaxed">
                          {tip.tip}
                        </p>
                      </div>
                      <TrendUp 
                        className={`h-5 w-5 flex-shrink-0 ${getImpactColor(tip.impact)}`}
                        weight="fill"
                      />
                    </div>
                  </motion.div>
                ))}
                
                <Button
                  onClick={generateTips}
                  variant="ghost"
                  size="sm"
                  className="gap-2 w-full mt-2"
                >
                  <ChartLine className="h-3 w-3" weight="fill" />
                  Get Fresh Tips
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
