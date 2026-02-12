import { Events, type Client } from 'discord.js';
import { Logger } from '../utils/logger.mjs';
import { registerRulesVerificationHandlers } from '../commands/rules-verification.mjs';
import { twitchService } from '../services/twitch.service.mjs';
import { vcService } from '../services/vc.service.mjs';

const logger = new Logger('Ready');

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    logger.info(`Bot ready! Logged in as ${client.user?.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);

    client.user?.setActivity('Azure Community', { type: 3 });

    // Register rules verification handlers (ensures buttons work after bot restart)
    registerRulesVerificationHandlers(client);

    // Start Twitch stream monitoring
    twitchService.start(client);

    // Cleanup orphaned personal VCs from previous run
    vcService.cleanupOrphanedChannels(client);
  }
};
