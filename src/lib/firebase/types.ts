// Member data structure in Firestore
export interface MemberData {
  userId: string;
  displayName: string;
  displayNameLower: string; // Normalized for querying
  username: string;
  discriminator?: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  rank?: number;
  messageCount?: number;
  lastXpGain?: string;
  joinedAt?: string;
}

// Ko-fi configuration
export const KOFI_URL = import.meta.env.VITE_KOFI_URL || 'https://ko-fi.com/azuretier';
