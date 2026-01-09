import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chats, PaperPlaneTilt, Robot } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { Rule } from '@/lib/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface AIRulesAssistantProps {
  rules: Rule[]
}

export function AIRulesAssistant({ rules }: AIRulesAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const rulesContext = rules
        .map((rule, i) => `${i + 1}. ${rule.title}: ${rule.description}`)
        .join('\n')

      const conversationHistory = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n')

      const prompt = `You are a helpful AI assistant for the Azure Community Discord server. Answer questions about community rules and guidelines in a friendly, clear manner.

Community Rules:
${rulesContext}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ''}
User: ${userMessage.content}

Provide a concise, helpful answer (2-3 sentences max). If the question is about rules, reference specific rule numbers. If unsure, encourage them to ask a moderator.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini')
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try asking your question again or contact a moderator.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    'What happens if I break a rule?',
    'Can I share my projects here?',
    'How should I use different channels?',
    'What type of content is not allowed?'
  ]

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
            <Chats className="h-6 w-6 text-accent" weight="fill" />
          </div>
          <div>
            <CardTitle className="text-xl">Rules Assistant</CardTitle>
            <CardDescription>
              Ask questions about community guidelines
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] rounded-lg border border-border bg-muted/30 p-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-3"
              >
                <Robot className="h-12 w-12 text-muted-foreground" weight="duotone" />
                <div className="space-y-1">
                  <p className="font-semibold text-card-foreground">
                    Hi! I'm here to help
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about Azure Community rules and guidelines
                  </p>
                </div>
                
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Try asking:
                  </p>
                  {suggestedQuestions.slice(0, 2).map((question, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(question)}
                      className="block text-xs text-primary hover:text-accent transition-colors text-left"
                    >
                      "{question}"
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Robot className="h-4 w-4 text-accent" weight="fill" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Robot className="h-4 w-4 text-accent" weight="fill" />
                    </div>
                    <div className="bg-card border border-border rounded-lg px-4 py-2.5 space-y-2">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about rules or guidelines..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            <PaperPlaneTilt className="h-4 w-4" weight="fill" />
          </Button>
        </form>

        {messages.length === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((question, i) => (
              <Button
                key={i}
                onClick={() => setInput(question)}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 text-left justify-start"
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
