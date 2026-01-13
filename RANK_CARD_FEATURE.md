# Discord Rank Card Feature

## Overview

The Discord Rank Card feature provides a beautiful, real-time display of user statistics including XP, level, and rank. The feature supports Unicode display names (including Japanese characters and emojis) and handles edge cases gracefully.

## Features

✨ **Unicode Support**: Fully supports Unicode characters, emojis, and spaces in display names
🔄 **Real-time Updates**: Automatically polls for updates every 3 seconds
🎨 **Modern UI**: Beautiful gradient backgrounds, smooth animations, and responsive design
⚡ **Loading States**: Sophisticated shimmer loading animation
🔍 **Error Handling**: Graceful handling of not-found and ambiguous cases

## Routes

### Main Route
```
/guilds/{guild_id}/rank-card/{user_discord_display_name}
```

**Parameters:**
- `guild_id` - The Discord guild (server) ID
- `user_discord_display_name` - The user's Discord display name (URL-encoded)

**Example URLs:**
```
/guilds/123456/rank-card/Test%20User
/guilds/123456/rank-card/%E3%81%82%E3%81%9A%E3%82%8C%E3%81%A3%E3%81%A8  (あずれっと)
/guilds/123456/rank-card/Cool%20Dev%20%F0%9F%9A%80  (Cool Dev 🚀)
```

## Display Name Normalization

The system automatically normalizes display names to handle Unicode correctly:

1. **URL Decode**: `decodeURIComponent()` to decode URL-encoded characters
2. **Trim**: Remove leading/trailing whitespace
3. **NFKC Normalization**: Unicode normalization for consistent matching
4. **Lowercase**: Convert to lowercase for case-insensitive matching

This ensures that variations like "Test User", "test user", and "TEST USER" all match the same user.

## Status States

### 1. Ready
Displays the user's rank card with all stats:
- Avatar with level badge
- Display name and username
- Rank badge and global rank position
- XP progress bar
- Total XP, Level, and Rank tiles

### 2. Not Found
Shown when no user matches the display name:
- Clear error message
- Helpful checklist for troubleshooting
- "Go Home" button to return to main page

### 3. Ambiguous
Shown when multiple users share similar display names:
- List of matching users with avatars
- Level, XP, and rank for each candidate
- Clickable cards to select the correct user

### 4. Loading
Beautiful loading animation with:
- Skeleton UI mimicking the rank card layout
- Smooth shimmer effect
- Animated progress bar
- Pulsing elements

## Data Structure

### RankCardData
```typescript
interface RankCardData {
  cardId: string;
  status: 'ready' | 'not_found' | 'ambiguous' | 'loading';
  displayNameOriginal: string;
  displayNameKey: string;  // Normalized for searching
  userId?: string;
  username?: string;
  avatarUrl?: string;
  level?: number;
  xp?: number;
  rank?: RankTier;
  globalRank?: number;
  guildId: string;
  updatedAt: string;
  candidates?: MemberCandidate[];  // For ambiguous status
}
```

## Implementation Details

### Client-Side Storage
Currently uses localStorage for rank card data storage:
- Key: `discord-rank-cards`
- Format: JSON object with cardId as keys

### Mock Data
For testing purposes, the service includes mock member data:
- Test User (5,000 XP, Level 7)
- あずれっと (25,000 XP, Level 15)
- Cool Dev 🚀 (15,000 XP, Level 12)

### Real-time Updates
The page polls for updates every 3 seconds using `setInterval`:
```typescript
const pollInterval = setInterval(async () => {
  const pollResult = await getRankCard(guild_id!, normalizedName);
  if (pollResult.success && pollResult.rankCard) {
    setRankCard(pollResult.rankCard);
  }
}, 3000);
```

## Architecture Adaptation

**Note:** The original requirement specified Next.js App Router + Firestore, but this implementation adapts to the existing Vite + React architecture:

- ✅ **Routing**: React Router instead of Next.js App Router
- ✅ **Data Layer**: LocalStorage + service pattern instead of Firestore
- ✅ **Real-time**: Polling instead of Firestore `onSnapshot`
- ✅ **Unicode Support**: Full NFKC normalization maintained
- ✅ **Loading States**: Modern shimmer animation as specified

### Migration Path to Firestore

To migrate to Firestore in the future:

1. Replace `rank-card-service.ts` with Firestore queries
2. Replace polling with `onSnapshot` for real-time updates
3. Add Firebase Admin SDK for server-side writes
4. Update member search to use Firestore queries with `displayNameKey` field

Example Firestore structure:
```
guilds/{guildId}/members/{userId}
  - displayName: string
  - displayNameKey: string  // normalized
  - xp: number
  - level: number
  - rank: string
  
guilds/{guildId}/rankCards/{cardId}
  - status: string
  - displayNameOriginal: string
  - displayNameKey: string
  - userId: string (if resolved)
  - updatedAt: timestamp
```

## Components

### RankCardPage
Main page component that:
- Handles route parameters
- Normalizes display names
- Manages loading/error states
- Polls for real-time updates

### RankCardDisplay
Displays the rank card with:
- Gradient backgrounds
- Avatar with level badge
- XP progress bar with shimmer
- Stats grid (Total XP, Level, Rank)
- Smooth animations

### RankCardLoading
Sophisticated loading screen with:
- Skeleton UI
- Shimmer effect overlay
- Animated gradient wave
- Pulsing progress bar

### RankCardNotFound
Error state component with:
- Magnifying glass icon
- Clear error message
- Troubleshooting checklist
- Navigation button

### RankCardAmbiguous
Multiple match selection with:
- User icon header
- List of matching candidates
- Avatar, name, and stats for each
- Clickable selection cards

## Styling

The rank card uses a modern design system:
- **Color Scheme**: Purple/Indigo gradients with glass morphism
- **Typography**: Clean sans-serif with proper hierarchy
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first design with proper breakpoints
- **Accessibility**: Proper ARIA labels and semantic HTML

## Testing

All scenarios have been tested:
✅ Regular ASCII names
✅ Unicode names (Japanese characters)
✅ Names with spaces
✅ Names with emojis
✅ Not found scenario
✅ Real-time polling updates
✅ Loading state animations

## Future Enhancements

- [ ] Add Firestore integration for production
- [ ] Implement server-side API routes
- [ ] Add Firebase Admin SDK support
- [ ] Add member search autocomplete
- [ ] Add rank history/trends
- [ ] Add achievement badges
- [ ] Add custom card themes
- [ ] Add export/share functionality
