import { EmbedBuilder, type Client, type TextChannel } from 'discord.js';
import { Logger } from '../utils/logger.mjs';
import crypto from 'node:crypto';
import http from 'node:http';

const logger = new Logger('GitHubService');

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface GitHubConfig {
  webhookSecret: string;
  webhookPort: number;
  notificationChannelId: string;
  aiApiKey: string;
  aiApiUrl: string;
  aiModel: string;
  repoFullName: string;
}

export const GITHUB_CONFIG: GitHubConfig = {
  webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  webhookPort: parseInt(process.env.GITHUB_WEBHOOK_PORT || '3002', 10),
  notificationChannelId: process.env.GITHUB_NOTIFICATION_CHANNEL_ID || '',
  aiApiKey: process.env.AI_API_KEY || '',
  aiApiUrl: process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  repoFullName: process.env.GITHUB_REPO || 'Azuretier/Azuretier',
};

// ============================================================================
// GITHUB NOTIFICATION SERVICE
// ============================================================================

class GitHubNotificationService {
  private discordClient: Client | null = null;
  private server: http.Server | null = null;

  // --------------------------------------------------------------------------
  // Webhook signature verification
  // --------------------------------------------------------------------------

  private verifySignature(payload: string, signature: string): boolean {
    if (!GITHUB_CONFIG.webhookSecret) return true;
    const hmac = crypto.createHmac('sha256', GITHUB_CONFIG.webhookSecret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // AI Summarization (OpenAI-compatible API)
  // --------------------------------------------------------------------------

  private async summarize(content: string): Promise<{ en: string; ja: string }> {
    if (!GITHUB_CONFIG.aiApiKey) {
      logger.warn('AI API key not configured — returning raw content as summary');
      return { en: content.slice(0, 300), ja: content.slice(0, 300) };
    }

    const prompt = [
      'You are a bilingual technical summarizer.',
      'Summarize the following GitHub changes concisely.',
      'Provide TWO summaries:',
      '1. An English summary (2-3 sentences)',
      '2. A Japanese summary (2-3 sentences)',
      '',
      'Format your response EXACTLY as:',
      'EN: <english summary>',
      'JA: <japanese summary>',
      '',
      '--- Changes ---',
      content,
    ].join('\n');

    try {
      const response = await fetch(GITHUB_CONFIG.aiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_CONFIG.aiApiKey}`,
        },
        body: JSON.stringify({
          model: GITHUB_CONFIG.aiModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = data.choices?.[0]?.message?.content || '';

      const enMatch = text.match(/EN:\s*([\s\S]*?)(?=\nJA:|$)/);
      const jaMatch = text.match(/JA:\s*([\s\S]*?)$/);

      return {
        en: enMatch?.[1]?.trim() || content.slice(0, 300),
        ja: jaMatch?.[1]?.trim() || content.slice(0, 300),
      };
    } catch (error) {
      logger.error('AI summarization failed', error);
      return { en: content.slice(0, 300), ja: content.slice(0, 300) };
    }
  }

  // --------------------------------------------------------------------------
  // Event handlers
  // --------------------------------------------------------------------------

  private async handlePush(payload: PushPayload): Promise<void> {
    const commits = payload.commits || [];
    if (commits.length === 0) return;

    const ref = payload.ref || '';
    const branch = ref.replace('refs/heads/', '');
    const repoName = payload.repository?.full_name || GITHUB_CONFIG.repoFullName;

    // Build change description for AI
    const commitMessages = commits
      .map((c) => `- ${c.message} (${c.author?.name || 'unknown'})`)
      .join('\n');

    const changedFiles = commits
      .flatMap((c) => [
        ...(c.added || []).map((f: string) => `+ ${f}`),
        ...(c.modified || []).map((f: string) => `~ ${f}`),
        ...(c.removed || []).map((f: string) => `- ${f}`),
      ])
      .join('\n');

    const content = [
      `Repository: ${repoName}`,
      `Branch: ${branch}`,
      `Commits:\n${commitMessages}`,
      `Changed files:\n${changedFiles}`,
    ].join('\n');

    const summary = await this.summarize(content);

    const version = payload.head_commit?.id?.slice(0, 7) || 'unknown';
    const compareUrl = payload.compare || `https://github.com/${repoName}`;

    const embed = new EmbedBuilder()
      .setColor(0x24292e)
      .setTitle(`${repoName} — ${branch}`)
      .setURL(compareUrl)
      .setDescription(
        `**${version}**\n\n` +
          `**English**\n${summary.en}\n\n` +
          `**日本語**\n${summary.ja}`,
      )
      .addFields(
        { name: 'Commits', value: `${commits.length}`, inline: true },
        { name: 'Branch', value: branch, inline: true },
        { name: 'Pusher', value: payload.pusher?.name || 'unknown', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `GitHub Push` });

    await this.sendNotification(embed);
  }

  private async handlePullRequest(payload: PullRequestPayload): Promise<void> {
    const pr = payload.pull_request;
    if (!pr) return;

    const action = payload.action;
    if (!['opened', 'closed', 'reopened'].includes(action)) return;

    const repoName = payload.repository?.full_name || GITHUB_CONFIG.repoFullName;
    const isMerged = pr.merged === true;
    const status = isMerged ? 'merged' : action;

    const content = [
      `PR #${pr.number}: ${pr.title}`,
      `Status: ${status}`,
      `Description: ${pr.body || 'No description'}`,
      `Changed files: ${pr.changed_files ?? 'unknown'}`,
      `Additions: +${pr.additions ?? 0}, Deletions: -${pr.deletions ?? 0}`,
    ].join('\n');

    const summary = await this.summarize(content);

    const statusColor = isMerged ? 0x6f42c1 : action === 'opened' ? 0x238636 : 0xda3633;
    const version = `PR #${pr.number}`;

    const embed = new EmbedBuilder()
      .setColor(statusColor)
      .setTitle(`${version} — ${pr.title}`)
      .setURL(pr.html_url)
      .setDescription(
        `**${version}**\n\n` +
          `**English**\n${summary.en}\n\n` +
          `**日本語**\n${summary.ja}`,
      )
      .addFields(
        {
          name: 'Status',
          value: status.charAt(0).toUpperCase() + status.slice(1),
          inline: true,
        },
        { name: 'Author', value: pr.user?.login || 'unknown', inline: true },
        {
          name: 'Changes',
          value: `+${pr.additions ?? 0} / -${pr.deletions ?? 0}`,
          inline: true,
        },
      )
      .setTimestamp()
      .setFooter({ text: `GitHub PR` });

    if (pr.user?.avatar_url) {
      embed.setThumbnail(pr.user.avatar_url);
    }

    await this.sendNotification(embed);
  }

  // --------------------------------------------------------------------------
  // Discord notification
  // --------------------------------------------------------------------------

  private async sendNotification(embed: EmbedBuilder): Promise<void> {
    if (!this.discordClient) {
      logger.error('Discord client not initialized');
      return;
    }

    if (!GITHUB_CONFIG.notificationChannelId) {
      logger.error('Notification channel ID not configured');
      return;
    }

    try {
      const channel = await this.discordClient.channels.fetch(
        GITHUB_CONFIG.notificationChannelId,
      );

      if (!channel || !channel.isTextBased()) {
        logger.error('Notification channel not found or not a text channel');
        return;
      }

      await (channel as TextChannel).send({ embeds: [embed] });
      logger.info('GitHub notification sent');
    } catch (error) {
      logger.error('Failed to send GitHub notification', error);
    }
  }

  // --------------------------------------------------------------------------
  // Webhook HTTP server
  // --------------------------------------------------------------------------

  start(client: Client): void {
    if (!GITHUB_CONFIG.notificationChannelId) {
      logger.warn('GITHUB_NOTIFICATION_CHANNEL_ID not set. GitHub notifications disabled.');
      return;
    }

    this.discordClient = client;

    this.server = http.createServer((req, res) => {
      // Only accept POST /webhook/github
      if (req.method !== 'POST' || req.url !== '/webhook/github') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
      }

      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => chunks.push(chunk));

      req.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString('utf-8');

        // Signature verification
        const signature = req.headers['x-hub-signature-256'] as string | undefined;
        if (GITHUB_CONFIG.webhookSecret && signature) {
          if (!this.verifySignature(rawBody, signature)) {
            logger.warn('Invalid webhook signature received');
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid signature' }));
            return;
          }
        }

        const event = req.headers['x-github-event'] as string | undefined;
        logger.info(`Received GitHub event: ${event || 'unknown'}`);

        // Respond immediately
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));

        // Parse and process asynchronously
        let payload: unknown;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          logger.error('Failed to parse webhook payload');
          return;
        }

        (async () => {
          try {
            switch (event) {
              case 'push':
                await this.handlePush(payload as PushPayload);
                break;
              case 'pull_request':
                await this.handlePullRequest(payload as PullRequestPayload);
                break;
              default:
                logger.debug(`Ignoring event type: ${event}`);
            }
          } catch (error) {
            logger.error(`Error processing ${event} event`, error);
          }
        })();
      });
    });

    this.server.listen(GITHUB_CONFIG.webhookPort, () => {
      logger.info(
        `Webhook server listening on port ${GITHUB_CONFIG.webhookPort}`,
      );
      logger.info(`Monitoring repo: ${GITHUB_CONFIG.repoFullName}`);
    });
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    logger.info('GitHub notification service stopped');
  }
}

// ============================================================================
// Payload type definitions (minimal subset of GitHub webhook payloads)
// ============================================================================

interface PushCommit {
  id: string;
  message: string;
  author?: { name?: string; email?: string };
  added?: string[];
  modified?: string[];
  removed?: string[];
}

interface PushPayload {
  ref: string;
  compare?: string;
  pusher?: { name?: string };
  head_commit?: { id?: string };
  commits?: PushCommit[];
  repository?: { full_name?: string };
}

interface PullRequestPayload {
  action: string;
  pull_request?: {
    number: number;
    title: string;
    body?: string;
    html_url: string;
    merged?: boolean;
    additions?: number;
    deletions?: number;
    changed_files?: number;
    user?: { login?: string; avatar_url?: string };
  };
  repository?: { full_name?: string };
}

export const githubService = new GitHubNotificationService();
