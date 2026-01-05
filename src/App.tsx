import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion } from 'framer-motion'
import { Book, Gear, Users, Plug, User } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast, Toaster } from 'sonner'
import { ProfileCard } from '@/components/ProfileCard'
import { RulesDialog } from '@/components/RulesDialog'
import { RoleCustomizer } from '@/components/RoleCustomizer'
import type { UserProfile, ServerRole, Rule } from '@/lib/types'
import { calculateLevel, getRankForLevel } from '@/lib/types'

const MOCK_RULES: Rule[] = [
  {
    id: '1',
    title: 'Be Respectful and Inclusive',
    description: 'Treat all community members with respect. No harassment, hate speech, discrimination, or personal attacks. We welcome everyone regardless of background, experience level, or identity.'
  },
  {
    id: '2',
    title: 'Keep Content Appropriate',
    description: 'Share content that is safe for work and appropriate for all ages. No NSFW, illegal, or harmful content. Keep discussions professional and constructive.'
  },
  {
    id: '3',
    title: 'No Spam or Self-Promotion',
    description: 'Avoid excessive self-promotion, spam, or unsolicited advertising. Share your projects in designated channels and contribute meaningfully to discussions.'
  },
  {
    id: '4',
    title: 'Use Channels Appropriately',
    description: 'Post content in the correct channels. Read channel descriptions before posting. Keep conversations on-topic and use threads for extended discussions.'
  },
  {
    id: '5',
    title: 'Respect Privacy and Security',
    description: 'Do not share personal information of others without consent. Keep credentials, API keys, and sensitive data private. Report security issues to moderators.'
  },
  {
    id: '6',
    title: 'Follow Discord Terms of Service',
    description: 'All Discord Terms of Service and Community Guidelines apply. Violations may result in warnings, temporary restrictions, or permanent bans.'
  }
]

const MOCK_ROLES: ServerRole[] = [
  {
    id: 'dev-ts',
    name: 'TypeScript Developer',
    description: 'Passionate about TypeScript and type-safe development',
    color: 'oklch(0.55 0.18 250)',
    icon: '💠',
    category: 'interest'
  },
  {
    id: 'dev-react',
    name: 'React Enthusiast',
    description: 'Building modern UIs with React',
    color: 'oklch(0.60 0.20 200)',
    icon: '⚛️',
    category: 'interest'
  },
  {
    id: 'cloud-azure',
    name: 'Azure Expert',
    description: 'Working with Microsoft Azure cloud services',
    color: 'oklch(0.55 0.15 220)',
    icon: '☁️',
    category: 'interest'
  },
  {
    id: 'contributor',
    name: 'Active Contributor',
    description: 'Regularly helps others and contributes to discussions',
    color: 'oklch(0.65 0.15 60)',
    icon: '⭐',
    category: 'contribution'
  },
  {
    id: 'helper',
    name: 'Community Helper',
    description: 'Goes out of their way to assist community members',
    color: 'oklch(0.70 0.18 90)',
    icon: '🤝',
    category: 'contribution'
  },
  {
    id: 'active-daily',
    name: 'Daily Active',
    description: 'Logs in and participates every day',
    color: 'oklch(0.60 0.20 290)',
    icon: '🔥',
    category: 'activity'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Most active during late night hours',
    color: 'oklch(0.45 0.15 280)',
    icon: '🦉',
    category: 'activity'
  },
  {
    id: 'event-organizer',
    name: 'Event Organizer',
    description: 'Helps organize community events and activities',
    color: 'oklch(0.75 0.18 30)',
    icon: '🎉',
    category: 'special'
  }
]

function App() {
  const [profile, setProfile] = useKV<UserProfile>('user-profile', {
    id: 'demo-user',
    username: 'AzureDev',
    discriminator: '8472',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AzureDev',
    xp: 12500,
    level: 11,
    rank: 'arcadia',
    rulesAgreed: false,
    roles: ['dev-ts', 'cloud-azure'],
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  })

  const [botConnected, setBotConnected] = useState(true)
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (profile) {
      const newLevel = calculateLevel(profile.xp)
      const newRank = getRankForLevel(newLevel)
      
      if (newLevel !== profile.level || newRank !== profile.rank) {
        setProfile(current => ({
          ...current!,
          level: newLevel,
          rank: newRank
        }))
      }
    }
  }, [profile?.xp])

  const handleRulesAgree = () => {
    setProfile(current => ({
      ...current!,
      rulesAgreed: true
    }))
  }

  const handleRolesSave = (newRoles: string[]) => {
    setProfile(current => ({
      ...current!,
      roles: newRoles
    }))
  }

  const handleReconnectBot = () => {
    toast.loading('Reconnecting to Discord bot...', { duration: 2000 })
    setTimeout(() => {
      setBotConnected(true)
      toast.success('Bot reconnected successfully!')
    }, 2000)
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="skeleton h-96 w-full max-w-4xl rounded-lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" theme="dark" />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{ transform: 'translate(50%, -50%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 space-y-8">
        <motion.header 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 border-2 border-primary/30">
                <Users className="h-8 w-8 text-primary" weight="fill" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Azure Community
                </h1>
                <p className="text-muted-foreground">
                  Member Profile Dashboard
                </p>
              </div>
            </div>

            {!botConnected && (
              <Button
                variant="outline"
                onClick={handleReconnectBot}
                className="gap-2"
              >
                <Plug className="h-4 w-4" />
                Reconnect Bot
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant={profile.rulesAgreed ? 'outline' : 'default'}
              onClick={() => setRulesDialogOpen(true)}
              className="gap-2"
            >
              <Book className="h-4 w-4" weight="fill" />
              {profile.rulesAgreed ? 'View Rules' : 'Read & Agree to Rules'}
            </Button>
          </div>
        </motion.header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Gear className="h-4 w-4" />
              Customize Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileCard profile={profile} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-card border-2 border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-2">About Profile Cards</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your profile card displays your Azure Community rank, level, and XP progress. 
                Earn XP by participating in discussions, helping others, and contributing to the community. 
                Ranks progress from <span className="font-semibold" style={{ color: 'oklch(0.65 0.15 60)' }}>Accordian</span> → 
                <span className="font-semibold" style={{ color: 'oklch(0.70 0.02 250)' }}> Arcadia</span> → 
                <span className="font-semibold" style={{ color: 'oklch(0.75 0.18 90)' }}> Apex</span> → 
                <span className="font-semibold" style={{ color: 'oklch(0.60 0.20 290)' }}> Legendary</span>.
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <RoleCustomizer
              availableRoles={MOCK_ROLES}
              currentRoles={profile.roles}
              onSave={handleRolesSave}
            />
          </TabsContent>
        </Tabs>
      </div>

      <RulesDialog
        open={rulesDialogOpen}
        onOpenChange={setRulesDialogOpen}
        rules={MOCK_RULES}
        onAgree={handleRulesAgree}
        hasAgreed={profile.rulesAgreed}
      />
    </div>
  )
}

export default App