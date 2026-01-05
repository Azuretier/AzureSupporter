import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, CaretDown, Check } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { Rule } from '@/lib/rules'
import type { RuleProgress } from '@/App'

interface QuickReferenceProps {
  rules: Rule[]
  progress: RuleProgress[]
}

export function QuickReference({ rules, progress }: QuickReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set())

  const filteredRules = rules.filter(rule => {
    const query = searchQuery.toLowerCase()
    return (
      rule.title.toLowerCase().includes(query) ||
      rule.description.toLowerCase().includes(query) ||
      rule.examples.some(ex => ex.toLowerCase().includes(query))
    )
  })

  const toggleRule = (ruleId: string) => {
    setExpandedRules(prev => {
      const next = new Set(prev)
      if (next.has(ruleId)) {
        next.delete(ruleId)
      } else {
        next.add(ruleId)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2">
        <h2 className="text-2xl font-bold mb-4">Quick Reference Guide</h2>
        <p className="text-muted-foreground mb-4">
          A quick overview of all community rules. Click any rule to expand for details.
        </p>
        
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredRules.map((rule, index) => {
            const ruleProgress = progress.find(p => p.ruleId === rule.id)
            const isExpanded = expandedRules.has(rule.id)
            const isMastered = ruleProgress?.mastered || false
            const isRead = ruleProgress?.read || false

            return (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible open={isExpanded} onOpenChange={() => toggleRule(rule.id)}>
                  <Card className={`border-2 overflow-hidden ${isMastered ? 'border-accent' : ''}`}>
                    <CollapsibleTrigger className="w-full">
                      <div className="p-6 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <div className="text-3xl">{rule.icon}</div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{rule.title}</h3>
                            {isMastered && (
                              <Badge className="bg-celebration text-white text-xs">
                                Mastered
                              </Badge>
                            )}
                            {isRead && !isMastered && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Read
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rule.description}
                          </p>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CaretDown className="h-5 w-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-6 pb-6 pt-2 space-y-4 border-t">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                            Key Examples
                          </h4>
                          <ul className="space-y-2">
                            {rule.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-accent">✓ Do This</h4>
                            <ul className="space-y-1.5">
                              {rule.doExamples.map((example, idx) => (
                                <li key={idx} className="text-sm bg-accent/5 p-2 rounded border border-accent/20">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-destructive">✗ Don't Do This</h4>
                            <ul className="space-y-1.5">
                              {rule.dontExamples.map((example, idx) => (
                                <li key={idx} className="text-sm bg-destructive/5 p-2 rounded border border-destructive/20">
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredRules.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No rules match your search.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
