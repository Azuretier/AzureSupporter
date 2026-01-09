import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkle, ArrowRight } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile } from '@/lib/types'

interface AIInsightsProps {
  profile: UserProfile
}

export function AIInsights({ profile }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateInsights = async () => {
    setIsGenerating(true)
    
    try {
      const prompt = `You are an AI assistant for the Azure Community Discord server. Analyze this member's profile and provide personalized insights and encouragement.

Member Profile:
- Username: ${profile.username}
- Level: ${profile.level}
- Rank: ${profile.rank}
- XP: ${profile.xp}
- Roles: ${profile.roles.join(', ')}
- Member since: ${new Date(profile.joinedAt).toLocaleDateString()}

Provide a warm, encouraging message (2-3 sentences) that:
1. Acknowledges their current progress and rank
2. Suggests specific ways they could engage more based on their roles
3. Mentions their next milestone or achievement

Keep the tone friendly, supportive, and community-focused. Be specific about their stats.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini')
      setInsights(result)
    } catch {
      setInsights('Unable to generate insights at this time. Keep being an awesome community member!')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
              <Sparkle className="h-6 w-6 text-accent" weight="fill" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Insights</CardTitle>
              <CardDescription>
                Personalized recommendations powered by AI
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          <AnimatePresence mode="wait">
            {!insights && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground text-sm">
                  Get personalized insights about your community journey, suggested activities, and progress tips.
                </p>
                <Button
                  onClick={generateInsights}
                  className="gap-2 group"
                  size="lg"
                >
                  <Sparkle className="h-4 w-4" weight="fill" />
                  Generate Insights
                  <ArrowRight 
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform" 
                    weight="bold"
                  />
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
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs text-muted-foreground">Analyzing your profile...</span>
                </div>
              </motion.div>
            )}

            {insights && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="relative p-4 rounded-lg bg-card/50 border border-accent/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-1.5 rounded-full bg-accent/20">
                        <Sparkle className="h-4 w-4 text-accent" weight="fill" />
                      </div>
                    </div>
                    <p className="text-card-foreground leading-relaxed text-sm flex-1">
                      {insights}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={generateInsights}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Sparkle className="h-3 w-3" weight="fill" />
                  Refresh Insights
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
