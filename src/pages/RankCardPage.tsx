import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RankCardDisplay } from '@/components/rank-card/RankCardDisplay';
import { RankCardLoading } from '@/components/rank-card/RankCardLoading';
import { RankCardNotFound } from '@/components/rank-card/RankCardNotFound';
import { RankCardAmbiguous } from '@/components/rank-card/RankCardAmbiguous';
import type { RankCardData } from '@/lib/rank-card-types';
import { ensureRankCard, getRankCard } from '@/lib/rank-card-service';

export function RankCardPage() {
  const { guild_id, user_discord_display_name } = useParams<{
    guild_id: string;
    user_discord_display_name: string;
  }>();
  const navigate = useNavigate();
  
  const [rankCard, setRankCard] = useState<RankCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guild_id || !user_discord_display_name) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    // Decode and normalize the display name
    const decodedName = decodeURIComponent(user_discord_display_name);
    const normalizedName = decodedName.trim().normalize('NFKC');

    let pollInterval: ReturnType<typeof setInterval> | undefined;

    async function loadRankCard() {
      try {
        setLoading(true);
        
        // Call the ensure service to create/fetch the rank card
        const result = await ensureRankCard(guild_id!, normalizedName);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch rank card');
        }

        setRankCard(result.rankCard);
        
        // Set up real-time updates (polling every 3 seconds)
        pollInterval = setInterval(async () => {
          try {
            const pollResult = await getRankCard(guild_id!, normalizedName);
            if (pollResult.success && pollResult.rankCard) {
              setRankCard(pollResult.rankCard);
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadRankCard();

    return () => {
      if (pollInterval !== undefined) {
        clearInterval(pollInterval);
      }
    };
  }, [guild_id, user_discord_display_name]);

  if (loading) {
    return <RankCardLoading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!rankCard) {
    return <RankCardNotFound displayName={user_discord_display_name || ''} />;
  }

  if (rankCard.status === 'not_found') {
    return <RankCardNotFound displayName={rankCard.displayNameOriginal} />;
  }

  if (rankCard.status === 'ambiguous' && rankCard.candidates) {
    return <RankCardAmbiguous candidates={rankCard.candidates} guildId={guild_id || ''} />;
  }

  return <RankCardDisplay rankCard={rankCard} />;
}
