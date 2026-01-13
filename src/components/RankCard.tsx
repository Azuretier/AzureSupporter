import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Star, TrendUp, Coffee } from '@phosphor-icons/react';
import type { MemberData } from '@/lib/firebase/types';
import { KOFI_URL } from '@/lib/firebase/types';

interface RankCardProps {
  member: MemberData;
  isRealtime?: boolean;
}

// Calculate XP needed for next level (based on level formula: level = floor(sqrt(xp / 100)))
function calculateXpForNextLevel(currentLevel: number): number {
  return (currentLevel + 1) ** 2 * 100;
}

function calculateXpForCurrentLevel(currentLevel: number): number {
  return currentLevel ** 2 * 100;
}

export function RankCard({ member, isRealtime = false }: RankCardProps) {
  const currentLevelXp = calculateXpForCurrentLevel(member.level);
  const nextLevelXp = calculateXpForNextLevel(member.level);
  const xpInCurrentLevel = member.xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const progressPercent = (xpInCurrentLevel / xpNeededForLevel) * 100;

  // Determine rank tier based on level
  const getRankInfo = (level: number) => {
    if (level >= 50) return { tier: 'Legendary', color: 'from-yellow-400 to-orange-500', emoji: '👑' };
    if (level >= 30) return { tier: 'Apex', color: 'from-yellow-300 to-yellow-500', emoji: '🥇' };
    if (level >= 15) return { tier: 'Arcadia', color: 'from-gray-300 to-gray-400', emoji: '🥈' };
    return { tier: 'Accordian', color: 'from-orange-400 to-orange-600', emoji: '🥉' };
  };

  const rankInfo = getRankInfo(member.level);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
            {/* Animated background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.15_265/0.15),transparent_50%)]" />
            
            {/* Subtle noise texture */}
            <div 
              className="absolute inset-0 opacity-[0.015]" 
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
              }}
            />

            {/* Real-time indicator */}
            {isRealtime && (
              <motion.div
                className="absolute top-4 right-4 z-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <Badge className="gap-2 bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Live
                </Badge>
              </motion.div>
            )}

            <div className="relative p-8 md:p-12 space-y-8">
              {/* Header with Avatar and Name */}
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Avatar with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${rankInfo.color} p-1`}>
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.displayName}
                        className="w-full h-full rounded-full object-cover border-2 border-background"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            e.currentTarget.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-2 border-background text-4xl font-bold text-foreground';
                            fallback.textContent = member.displayName[0]?.toUpperCase() || '?';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border-2 border-background text-4xl font-bold text-foreground">
                        {member.displayName[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and rank tier */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight truncate bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {member.displayName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-base font-semibold bg-gradient-to-r ${rankInfo.color} text-white border-0 shadow-lg`}>
                      {rankInfo.emoji} {rankInfo.tier}
                    </Badge>
                    {member.rank && (
                      <Badge variant="outline" className="text-base">
                        Rank #{member.rank}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Trophy className="h-4 w-4" weight="duotone" />
                    <span className="text-sm font-medium">Level</span>
                  </div>
                  <p className="text-3xl font-bold font-mono tabular-nums text-foreground">
                    {member.level}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Star className="h-4 w-4" weight="duotone" />
                    <span className="text-sm font-medium">Total XP</span>
                  </div>
                  <p className="text-3xl font-bold font-mono tabular-nums text-foreground">
                    {member.xp.toLocaleString()}
                  </p>
                </div>

                {member.messageCount !== undefined && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-success/5 to-transparent border border-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendUp className="h-4 w-4" weight="duotone" />
                      <span className="text-sm font-medium">Messages</span>
                    </div>
                    <p className="text-3xl font-bold font-mono tabular-nums text-foreground">
                      {member.messageCount.toLocaleString()}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* XP Progress */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Progress to Level {member.level + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground font-mono tabular-nums">
                    {xpInCurrentLevel.toLocaleString()} / {xpNeededForLevel.toLocaleString()} XP
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercent} className="h-4 bg-muted/30" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {Math.round(progressPercent)}% complete
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Ko-fi Donation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card/50 to-accent/5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-primary" weight="duotone" />
                  Support the Community
                </h3>
                <p className="text-sm text-muted-foreground">
                  Help keep our community thriving! Your support means the world.
                </p>
              </div>
              <Button
                asChild
                variant="default"
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              >
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Coffee className="h-4 w-4" weight="fill" />
                  Buy me a coffee
                </a>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
