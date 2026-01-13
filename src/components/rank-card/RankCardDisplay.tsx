import { motion } from 'framer-motion';
import { Trophy, Lightning, Star, ChartLineUp } from '@phosphor-icons/react';
import type { RankCardData } from '@/lib/rank-card-types';
import { getRankColor, xpProgress } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RankCardDisplayProps {
  rankCard: RankCardData;
}

export function RankCardDisplay({ rankCard }: RankCardDisplayProps) {
  if (rankCard.status !== 'ready') {
    return null;
  }

  const xpInfo = xpProgress(rankCard.xp || 0);
  const rankColor = getRankColor(rankCard.rank || 'accordian');

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="relative overflow-hidden bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-100">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-blue-400/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/20 via-rose-400/20 to-orange-400/20 rounded-full blur-3xl -z-10" />

          {/* Header Section */}
          <div className="relative p-8 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  src={rankCard.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                  alt={rankCard.username || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                {/* Level Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white"
                >
                  {rankCard.level || 0}
                </motion.div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent"
                >
                  {rankCard.displayNameOriginal}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-sm mt-1"
                >
                  @{rankCard.username || 'Unknown'}
                </motion.p>
              </div>

              {/* Rank Badge */}
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: rankColor, color: 'white' }}
                >
                  {rankCard.rank || 'accordian'}
                </Badge>
                {rankCard.globalRank && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Trophy className="w-4 h-4" weight="fill" />
                    <span className="text-sm font-medium">#{rankCard.globalRank}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* XP Progress Section */}
          <div className="p-8 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lightning className="w-4 h-4 text-yellow-500" weight="fill" />
                  Experience Points
                </span>
                <span className="text-sm font-mono font-medium text-gray-900">
                  {xpInfo.current.toLocaleString()} / {xpInfo.required.toLocaleString()} XP
                </span>
              </div>
              <div className="relative">
                <Progress value={xpInfo.percentage} className="h-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              <p className="text-xs text-gray-500 text-right">
                {Math.ceil(xpInfo.percentage)}% to Level {(rankCard.level || 0) + 1}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mt-6"
            >
              {/* Total XP */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Star className="w-5 h-5" weight="fill" />
                  <span className="text-xs font-medium uppercase tracking-wide">Total XP</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {(rankCard.xp || 0).toLocaleString()}
                </p>
              </div>

              {/* Level */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <ChartLineUp className="w-5 h-5" weight="fill" />
                  <span className="text-xs font-medium uppercase tracking-wide">Level</span>
                </div>
                <p className="text-2xl font-bold text-indigo-900">{rankCard.level || 0}</p>
              </div>

              {/* Rank */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Trophy className="w-5 h-5" weight="fill" />
                  <span className="text-xs font-medium uppercase tracking-wide">Rank</span>
                </div>
                <p className="text-xl font-bold text-blue-900 capitalize">
                  {rankCard.rank || 'accordian'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(rankCard.updatedAt).toLocaleString()}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
