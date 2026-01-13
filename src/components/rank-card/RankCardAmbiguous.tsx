import { motion } from 'framer-motion';
import { Users, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MemberCandidate } from '@/lib/rank-card-types';
import { getRankColor } from '@/lib/types';

interface RankCardAmbiguousProps {
  candidates: MemberCandidate[];
  guildId: string;
}

export function RankCardAmbiguous({ candidates, guildId }: RankCardAmbiguousProps) {
  const navigate = useNavigate();

  const handleSelectCandidate = (displayName: string) => {
    // Navigate to a specific user's rank card using their display name
    navigate(`/guilds/${guildId}/rank-card/${encodeURIComponent(displayName)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl"
      >
        <Card className="p-8 bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-100">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6"
          >
            <Users className="w-10 h-10 text-amber-600" weight="bold" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Multiple Users Found
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              We found {candidates.length} users with a similar display name. Please select the correct one:
            </p>

            {/* Candidates List */}
            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <button
                    onClick={() => handleSelectCandidate(candidate.displayName)}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-indigo-50 border border-gray-200 hover:border-purple-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <img
                        src={candidate.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                        alt={candidate.username}
                        className="w-14 h-14 rounded-full border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                      />

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.displayName}
                          </h3>
                          <Badge
                            className="text-xs"
                            style={{
                              backgroundColor: getRankColor(candidate.rank),
                              color: 'white',
                            }}
                          >
                            Lvl {candidate.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">@{candidate.username}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {candidate.xp.toLocaleString()} XP • {candidate.rank}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                        weight="bold"
                      />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mt-6 w-full"
            >
              Cancel
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
