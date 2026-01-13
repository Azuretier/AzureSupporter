import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { getDb } from '@/lib/firebase/client';
import { RankCard } from '@/components/RankCard';
import { RankCardSkeleton } from '@/components/RankCardSkeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Warning } from '@phosphor-icons/react';
import type { MemberData } from '@/lib/firebase/types';

export function RankCardPage() {
  const { guildId, userDiscordDisplayName } = useParams<{
    guildId: string;
    userDiscordDisplayName: string;
  }>();
  const navigate = useNavigate();
  
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [multipleMatches, setMultipleMatches] = useState<MemberData[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (!guildId || !userDiscordDisplayName) {
      setError('Missing guild ID or display name');
      setLoading(false);
      return;
    }

    // Decode and normalize the display name from URL
    const decodedDisplayName = decodeURIComponent(userDiscordDisplayName);
    const normalizedDisplayName = decodedDisplayName.toLowerCase().trim();

    const db = getDb();
    const membersRef = collection(db, 'guilds', guildId, 'members');
    
    // Query using normalized field for case-insensitive search
    // NOTE: This query requires a composite index in Firestore:
    // - Collection: guilds/{guildId}/members
    // - Fields: displayNameLower (Ascending), xp (Descending)
    // Firebase will provide a link to create the index on first query
    const q = query(
      membersRef,
      where('displayNameLower', '==', normalizedDisplayName),
      orderBy('xp', 'desc'), // In case of multiple matches, show highest XP first
      limit(5) // Limit to avoid too many results
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLoading(false);
        
        if (snapshot.empty) {
          setError(`No member found with display name "${decodedDisplayName}"`);
          setMember(null);
          return;
        }

        const members: MemberData[] = [];
        snapshot.forEach((doc) => {
          members.push({
            userId: doc.id,
            ...doc.data(),
          } as MemberData);
        });

        if (members.length === 1) {
          // Single match - display immediately
          setMember(members[0]);
          setMultipleMatches([]);
          setError(null);
        } else {
          // Multiple matches - let user choose
          setMultipleMatches(members);
          
          // If user already selected one, use it
          if (selectedMemberId) {
            const selected = members.find(m => m.userId === selectedMemberId);
            if (selected) {
              setMember(selected);
            }
          } else {
            // Default to first (highest XP) member
            setMember(members[0]);
          }
          setError(null);
        }
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(`Failed to fetch member data: ${err.message}`);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [guildId, userDiscordDisplayName, selectedMemberId]);

  if (loading) {
    return <RankCardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-border/50 bg-card/50 backdrop-blur-sm text-center space-y-4">
          <div className="inline-flex p-4 bg-destructive/10 rounded-2xl">
            <Warning className="h-12 w-12 text-destructive" weight="duotone" />
          </div>
          <h2 className="text-2xl font-bold">Member Not Found</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="pt-4">
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show selection UI if multiple matches
  if (multipleMatches.length > 1 && !selectedMemberId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 border-border/50 bg-card/50 backdrop-blur-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Multiple Members Found</h2>
            <p className="text-muted-foreground">
              Multiple members have the same display name "{multipleMatches[0]?.displayName}". 
              Please select the correct member:
            </p>
          </div>
          
          <div className="space-y-3">
            {multipleMatches.map((m) => (
              <button
                key={m.userId}
                onClick={() => {
                  setSelectedMemberId(m.userId);
                  setMember(m);
                }}
                className="w-full p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  {m.avatarUrl ? (
                    <img
                      src={m.avatarUrl}
                      alt={m.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                      {m.displayName[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{m.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      Level {m.level} · {m.xp.toLocaleString()} XP
                      {m.username && ` · @${m.username}`}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4">
            <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 border-border/50 bg-card/50 backdrop-blur-sm text-center space-y-4">
          <p className="text-muted-foreground">No member data available</p>
        </Card>
      </div>
    );
  }

  return <RankCard member={member} isRealtime={true} />;
}
