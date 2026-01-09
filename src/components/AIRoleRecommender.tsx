import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { UserProfile, ServerRole } from '@/lib/types'
import { toast } from 'sonner'

interface AIRoleRecommenderProps {
  profile: UserProfile
  availableRoles: ServerRole[]
  onAddRole: (roleId: string) => void
}

interface RoleRecommendation {
  roleId: string
  reason: string
}

export function AIRoleRecommender({ profile, availableRoles, onAddRole }: AIRoleRecommenderProps) {
  const [recommendations, setRecommendations] = useState<RoleRecommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendations = async () => {
    setIsGenerating(true)
    
    try {
      const currentRoles = profile.roles
        .map(id => availableRoles.find(r => r.id === id))
        .filter(Boolean)
        .map(r => `${r!.name} (${r!.description})`)

      const availableToRecommend = availableRoles
        .filter(role => !profile.roles.includes(role.id))
        .map(role => `${role.id}: ${role.name} - ${role.description}`)

      const prompt = `You are an AI assistant helping members of the Azure Community Discord discover roles that match their interests.

Current Profile:
- Username: ${profile.username}
- Level: ${profile.level} (${profile.rank} rank)
- Current Roles: ${currentRoles.length > 0 ? currentRoles.join(', ') : 'None yet'}

Available Roles to Recommend:
${availableToRecommend.join('\n')}

Based on their current roles and community engagement, suggest 3 roles that would be a great fit. Return the result as a valid JSON object with a single property called "recommendations" that contains the role list.

Return JSON in this exact format:
{
  "recommendations": [
    {"roleId": "role-id-here", "reason": "One sentence explaining why this role fits them"},
    {"roleId": "role-id-here", "reason": "One sentence explaining why this role fits them"},
    {"roleId": "role-id-here", "reason": "One sentence explaining why this role fits them"}
  ]
}

Use the exact role IDs from the available roles list. Keep reasons brief and personalized.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)
      setRecommendations(parsed.recommendations || [])
    } catch {
      toast.error('Unable to generate recommendations', {
        description: 'Please try again later'
      })
      setRecommendations([])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddRole = (roleId: string) => {
    onAddRole(roleId)
    setRecommendations(prev => prev.filter(r => r.roleId !== roleId))
    toast.success('Role added to your profile!')
  }

  const getRoleDetails = (roleId: string) => {
    return availableRoles.find(r => r.id === roleId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-2 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Brain className="h-6 w-6 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Role Suggestions</CardTitle>
                <CardDescription>
                  Discover roles that match your interests
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {recommendations.length === 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-muted-foreground text-sm">
                  Let AI analyze your profile and suggest roles that align with your community presence.
                </p>
                <Button
                  onClick={generateRecommendations}
                  variant="outline"
                  className="gap-2"
                >
                  <Brain className="h-4 w-4" weight="fill" />
                  Get Recommendations
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
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">Analyzing your profile...</span>
                </div>
              </motion.div>
            )}

            {recommendations.length > 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {recommendations.map((rec, index) => {
                  const role = getRoleDetails(rec.roleId)
                  if (!role) return null

                  return (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border-2 border-border bg-card hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              style={{
                                backgroundColor: role.color,
                                color: 'oklch(0.98 0 0)'
                              }}
                              className="font-semibold"
                            >
                              {role.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground capitalize">
                              {role.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {rec.reason}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAddRole(role.id)}
                          size="sm"
                          className="gap-1.5 flex-shrink-0"
                        >
                          <Plus className="h-4 w-4" weight="bold" />
                          Add
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
                
                <Button
                  onClick={generateRecommendations}
                  variant="ghost"
                  size="sm"
                  className="gap-2 w-full mt-2"
                >
                  <Brain className="h-3 w-3" weight="fill" />
                  Get New Suggestions
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
