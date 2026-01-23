import { EmbedBuilder, type Client, type TextChannel } from 'discord.js';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('TwitchService');

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface TwitchConfig {
  clientId: string;
  clientSecret: string;
  // Twitch username to monitor
  twitchUsername: string;
  // Discord channel ID to send notifications
  notificationChannelId: string;
  // Polling interval in milliseconds (default: 60 seconds)
  pollInterval: number;
}

export const TWITCH_CONFIG: TwitchConfig = {
  clientId: process.env.TWITCH_CLIENT_ID || '',
  clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
  twitchUsername: '2xqaq',
  notificationChannelId: '1464110960565420045',
  pollInterval: 60000, // 60 seconds
};

// ============================================================================
// TWITCH API SERVICE
// ============================================================================

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

interface TwitchStreamsResponse {
  data: TwitchStream[];
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

interface TwitchUsersResponse {
  data: TwitchUser[];
}

class TwitchService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private isLive: boolean = false;
  private lastStreamId: string | null = null;
  private pollIntervalId: NodeJS.Timeout | null = null;
  private discordClient: Client | null = null;

  /**
   * Get OAuth token from Twitch
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    const { clientId, clientSecret } = TWITCH_CONFIG;

    if (!clientId || !clientSecret) {
      throw new Error('Twitch client ID or secret not configured');
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Twitch access token: ${response.status}`);
    }

    const data = (await response.json()) as TwitchTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

    logger.info('Twitch access token obtained');
    return this.accessToken;
  }

  /**
   * Get user info from Twitch
   */
  async getUserInfo(username: string): Promise<TwitchUser | null> {
    const token = await this.getAccessToken();
    const { clientId } = TWITCH_CONFIG;

    const response = await fetch(
      `https://api.twitch.tv/helix/users?login=${encodeURIComponent(username)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': clientId,
        },
      }
    );

    if (!response.ok) {
      logger.error(`Failed to get user info: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as TwitchUsersResponse;
    return data.data[0] || null;
  }

  /**
   * Check if a user is currently streaming
   */
  async getStreamInfo(username: string): Promise<TwitchStream | null> {
    const token = await this.getAccessToken();
    const { clientId } = TWITCH_CONFIG;

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(username)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': clientId,
        },
      }
    );

    if (!response.ok) {
      logger.error(`Failed to get stream info: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as TwitchStreamsResponse;
    return data.data[0] || null;
  }

  /**
   * Send notification to Discord channel
   */
  private async sendNotification(stream: TwitchStream, user: TwitchUser | null): Promise<void> {
    if (!this.discordClient) {
      logger.error('Discord client not initialized');
      return;
    }

    try {
      const channel = await this.discordClient.channels.fetch(TWITCH_CONFIG.notificationChannelId);
      
      if (!channel || !channel.isTextBased()) {
        logger.error('Notification channel not found or not a text channel');
        return;
      }

      const thumbnailUrl = stream.thumbnail_url
        .replace('{width}', '1280')
        .replace('{height}', '720');

      const embed = new EmbedBuilder()
        .setColor(0x9146FF) // Twitch purple
        .setTitle(`🔴 ${stream.user_name} is now live!`)
        .setURL(`https://twitch.tv/${stream.user_login}`)
        .setDescription(stream.title || 'No title')
        .addFields(
          { name: '🎮 Game', value: stream.game_name || 'Unknown', inline: true },
          { name: '👁️ Viewers', value: stream.viewer_count.toString(), inline: true },
        )
        .setImage(thumbnailUrl + `?t=${Date.now()}`) // Cache bust
        .setTimestamp(new Date(stream.started_at))
        .setFooter({ text: 'Stream started' });

      if (user?.profile_image_url) {
        embed.setThumbnail(user.profile_image_url);
      }

      await (channel as TextChannel).send({
        content: `@everyone **${stream.user_name}** has started streaming! Come watch! 🎉`,
        embeds: [embed],
      });

      logger.info(`Sent stream notification for ${stream.user_name}`);
    } catch (error) {
      logger.error('Failed to send notification', error);
    }
  }

  /**
   * Poll for stream status
   */
  private async checkStream(): Promise<void> {
    try {
      const stream = await this.getStreamInfo(TWITCH_CONFIG.twitchUsername);

      if (stream && stream.type === 'live') {
        // User is live
        if (!this.isLive || this.lastStreamId !== stream.id) {
          // New stream started
          this.isLive = true;
          this.lastStreamId = stream.id;
          
          const user = await this.getUserInfo(TWITCH_CONFIG.twitchUsername);
          await this.sendNotification(stream, user);
        }
      } else {
        // User is offline
        if (this.isLive) {
          logger.info(`${TWITCH_CONFIG.twitchUsername} went offline`);
        }
        this.isLive = false;
      }
    } catch (error) {
      logger.error('Error checking stream status', error);
    }
  }

  /**
   * Start monitoring the Twitch user
   */
  start(client: Client): void {
    if (!TWITCH_CONFIG.clientId || !TWITCH_CONFIG.clientSecret) {
      logger.warn('Twitch credentials not configured. Stream notifications disabled.');
      logger.warn('Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in your .env file.');
      return;
    }

    this.discordClient = client;

    // Initial check
    this.checkStream();

    // Start polling
    this.pollIntervalId = setInterval(() => {
      this.checkStream();
    }, TWITCH_CONFIG.pollInterval);

    logger.info(`Started monitoring Twitch user: ${TWITCH_CONFIG.twitchUsername}`);
    logger.info(`Polling interval: ${TWITCH_CONFIG.pollInterval / 1000} seconds`);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
    logger.info('Stopped Twitch stream monitoring');
  }
}

export const twitchService = new TwitchService();
