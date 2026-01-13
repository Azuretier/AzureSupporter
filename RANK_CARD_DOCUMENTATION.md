# Discord Rank Card Feature

## Overview

The rank card feature provides a modern, real-time display of Discord member statistics including XP, level, rank, and progress. The page updates live as Firestore data changes, creating a dynamic and engaging user experience.

## Features

- ✨ **Real-time Updates**: Uses Firestore `onSnapshot` for live data synchronization
- 🎨 **Modern Design**: Glassmorphism effects, gradients, and sophisticated animations
- 📱 **Responsive**: Mobile-first design that works on all screen sizes
- 🔍 **Smart Search**: Case-insensitive display name matching with collision handling
- ⚡ **Loading States**: Beautiful skeleton loaders while data fetches
- ☕ **Ko-fi Integration**: Tasteful donation prompts to support the community

## Routes

### Rank Card Page
- **Path**: `/guilds/{guildId}/rank-card/{userDiscordDisplayName}`
- **Example**: `/guilds/123456789/rank-card/Azuret`
- **Description**: Displays the rank card for a specific member

### Donate Page
- **Path**: `/donate`
- **Description**: Dedicated donation page with Ko-fi integration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Ko-fi Donation Link (optional)
VITE_KOFI_URL=https://ko-fi.com/your_username
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the Web app icon (</>)
6. Copy the configuration values from the Firebase SDK snippet

## Firestore Document Structure

### Collection Path
```
guilds/{guildId}/members/{userId}
```

### Document Schema

```typescript
{
  userId: string;              // Discord user ID (document ID)
  displayName: string;         // Discord display name (as shown in server)
  displayNameLower: string;    // Lowercase version for querying (REQUIRED)
  username: string;            // Discord username
  discriminator?: string;      // Discord discriminator (if applicable)
  avatarUrl?: string;          // URL to user's avatar image
  xp: number;                  // Total experience points
  level: number;               // Calculated level
  rank?: number;               // Optional rank position
  messageCount?: number;       // Optional message count
  lastXpGain?: string;         // ISO timestamp of last XP gain
  joinedAt?: string;           // ISO timestamp when user joined
}
```

### Required Fields
- `userId` - Unique identifier (document ID)
- `displayName` - User's display name
- `displayNameLower` - **IMPORTANT**: Normalized lowercase version for case-insensitive queries
- `xp` - Experience points (number)
- `level` - Current level (number)

### Example Document

```javascript
// Document ID: "123456789012345678"
{
  userId: "123456789012345678",
  displayName: "Azuret",
  displayNameLower: "azuret",  // MUST be lowercase
  username: "azuret",
  avatarUrl: "https://cdn.discordapp.com/avatars/123.../avatar.png",
  xp: 15000,
  level: 12,
  rank: 5,
  messageCount: 1250,
  lastXpGain: "2024-01-13T12:00:00Z",
  joinedAt: "2023-06-15T10:30:00Z"
}
```

## Level and XP System

The rank card uses the following formula to calculate levels:

```javascript
level = Math.floor(Math.sqrt(xp / 100))
```

### Level Requirements

| Level | XP Required | Rank Tier |
|-------|-------------|-----------|
| 0-14  | 0 - 19,600  | Accordian 🥉 |
| 15-29 | 22,500 - 84,100 | Arcadia 🥈 |
| 30-49 | 90,000 - 240,100 | Apex 🥇 |
| 50+   | 250,000+ | Legendary 👑 |

### Progress Calculation

```javascript
// XP needed for current level
currentLevelXp = level² × 100

// XP needed for next level
nextLevelXp = (level + 1)² × 100

// XP progress in current level
xpInCurrentLevel = totalXp - currentLevelXp

// XP needed to level up
xpNeededForLevel = nextLevelXp - currentLevelXp

// Progress percentage
progressPercent = (xpInCurrentLevel / xpNeededForLevel) × 100
```

## Display Name Collision Handling

When multiple members have the same display name, the system:

1. Shows all matching members sorted by XP (highest first)
2. Displays a selection UI with avatars and key stats
3. User can choose the correct member
4. Defaults to the member with highest XP if no selection is made

## Real-time Updates

The rank card uses Firestore's `onSnapshot` listener for real-time updates:

- **Live Badge**: Shows a pulsing green indicator when connected
- **Automatic Updates**: Card updates immediately when Firestore data changes
- **No Refresh Needed**: Changes appear without page reload
- **Optimized Queries**: Uses indexed fields for fast lookups

## Firestore Indexes

For optimal performance, create a composite index in Firestore:

### Index Configuration
- **Collection**: `guilds/{guildId}/members`
- **Fields**: 
  - `displayNameLower` (Ascending)
  - `xp` (Descending)

### Creating the Index

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on "Indexes" tab
5. Click "Add Index"
6. Configure as shown above
7. Click "Create Index"

Alternatively, the index will be auto-created when you first query, and Firebase will provide a link to create it.

## Usage Examples

### Basic Usage

```
https://your-domain.com/guilds/123456789/rank-card/Azuret
```

### With Special Characters

Display names with spaces or special characters are automatically URL-encoded:

```
https://your-domain.com/guilds/123456789/rank-card/Cool%20User
```

### Ko-fi Donation

The rank card page includes a tasteful Ko-fi donation prompt at the bottom. Configure your Ko-fi URL in the `.env` file:

```env
VITE_KOFI_URL=https://ko-fi.com/your_username
```

## Styling Customization

The rank card uses Tailwind CSS classes and can be customized by editing:

- **Colors**: Modify in `tailwind.config.js`
- **Components**: Edit `src/components/RankCard.tsx`
- **Loading State**: Edit `src/components/RankCardSkeleton.tsx`

### Rank Tier Colors

```javascript
const getRankInfo = (level: number) => {
  if (level >= 50) return { tier: 'Legendary', color: 'from-yellow-400 to-orange-500', emoji: '👑' };
  if (level >= 30) return { tier: 'Apex', color: 'from-yellow-300 to-yellow-500', emoji: '🥇' };
  if (level >= 15) return { tier: 'Arcadia', color: 'from-gray-300 to-gray-400', emoji: '🥈' };
  return { tier: 'Accordian', color: 'from-orange-400 to-orange-600', emoji: '🥉' };
};
```

## Troubleshooting

### Firebase Connection Issues

**Error**: "Failed to fetch member data"

**Solutions**:
1. Verify Firebase credentials in `.env` file
2. Check Firestore security rules allow read access
3. Ensure the collection path is correct
4. Verify the member document exists in Firestore

### Display Name Not Found

**Error**: "No member found with display name"

**Solutions**:
1. Verify the `displayNameLower` field exists in Firestore documents
2. Ensure `displayNameLower` contains the lowercase version of `displayName`
3. Check the guild ID in the URL is correct
4. Verify the member document exists under the correct guild

### Missing Avatar Images

**Issue**: Avatar not showing or showing placeholder

**Solutions**:
1. Verify the `avatarUrl` field contains a valid URL
2. Check CORS settings if using external image hosting
3. Ensure the Discord CDN URL is accessible
4. Fallback to placeholder will show user's initial if avatar fails

### Composite Index Required

**Error**: "The query requires an index"

**Solutions**:
1. Click the link in the error message to auto-create index
2. Or manually create the index as described in "Firestore Indexes" section
3. Wait a few minutes for index to build (Firebase will show status)

## Component Structure

```
src/
├── components/
│   ├── RankCard.tsx           # Main rank card display
│   └── RankCardSkeleton.tsx   # Loading skeleton
├── pages/
│   ├── RankCardPage.tsx       # Rank card page with Firestore integration
│   └── DonatePage.tsx         # Dedicated donation page
├── lib/
│   └── firebase/
│       ├── client.ts          # Firebase initialization
│       └── types.ts           # TypeScript types and config
└── App.tsx                    # Router configuration
```

## Security Considerations

### Firestore Security Rules

Ensure your Firestore rules allow read access to member data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to member data
    match /guilds/{guildId}/members/{userId} {
      allow read: if true;  // Public read access
      allow write: if false; // Disable client writes
    }
  }
}
```

### Environment Variables

- Never commit `.env` files to version control
- Use `.env.example` as a template
- Store production credentials securely
- Rotate Firebase keys if exposed

## Performance Optimization

### Query Optimization

- Uses `where` with indexed field (`displayNameLower`)
- Limits results to 5 documents maximum
- Orders by XP for relevant sorting
- Single query for all data needs

### Loading Strategy

1. Show skeleton loader immediately
2. Initialize Firestore connection
3. Set up real-time listener
4. Display data when available
5. Update automatically on changes

### Image Loading

- Lazy loading for avatar images
- Fallback to initials on error
- Optimized image sizes from Discord CDN

## Support and Contributions

For issues or feature requests, please visit the repository and open an issue. Contributions are welcome!

---

**Built with ❤️ for the Azure Community**
