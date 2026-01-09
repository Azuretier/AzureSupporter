import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagicWand, Copy, Check } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile, ServerRole } from '@/lib/types'
import { toast } from 'sonner'

interface AIProfileSummaryProps {
  profile: UserProfile
  availableRoles: ServerRole[]
}

export function AIProfileSummary({ profile, availableRoles }: AIProfileSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateSummary = async () => {
    setIsGenerating(true)
    
    try {
      const userRoles = profile.roles
        .map(id => availableRoles.find(r => r.id === id))
        .filter(Boolean)
        .map(r => r!.name)

      const prompt = `You are an AI assistant creating a personalized profile summary for an Azure Community Discord member.

Member Information:
- Username: ${profile.username}
- Rank: ${profile.rank} (Level ${profile.level})
- Total XP: ${profile.xp}
- Roles: ${userRoles.join(', ')}
- Member since: ${new Date(profile.joinedAt).toLocaleDateString()}

Create a concise, engaging profile summary (2-3 sentences) that:
1. Highlights their community standing and achievements
2. Reflects their interests based on their roles
3. Has a warm, welcoming tone

Make it sound natural and personalized. Don't just list stats - tell their story.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini')
      setSummary(result)
    } catch {
      toast.error('Unable to generate summary', {
        description: 'Please try again later'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!summary) return
    
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="border-2 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <MagicWand className="h-6 w-6 text-primary" weight="fill" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Profile Summary</CardTitle>
              <CardDescription>
                Generate a personalized bio for your profile
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {!summary && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground text-sm">
                  Let AI craft a unique profile summary based on your achievements, roles, and community presence.
                </p>
                <Button
                  onClick={generateSummary}
                  className="gap-2"
                >
                  <MagicWand className="h-4 w-4" weight="fill" />
                  Generate Summary
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
                <div className="p-4 rounded-lg bg-card/50 border border-border space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Writing your story...</span>
                </div>
              </motion.div>
            )}

            {summary && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="relative p-4 rounded-lg bg-card border-2 border-primary/30">
                  <p className="text-card-foreground leading-relaxed italic">
                    "{summary}"
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" weight="bold" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" weight="bold" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={generateSummary}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <MagicWand className="h-3 w-3" weight="fill" />
                    Regenerate
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
