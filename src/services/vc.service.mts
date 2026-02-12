import {
    ChannelType,
    PermissionFlagsBits,
    type Guild,
    type GuildMember,
    type VoiceChannel,
    type Client,
} from 'discord.js';
import { dbService } from '../lib/db-service.mjs';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('VCService');

class VCService {
    /**
     * 新しいパーソナルVCを作成してユーザーを移動する
     */
    async createPersonalVC(guild: Guild, member: GuildMember, categoryId: string): Promise<VoiceChannel> {
        const channel = await guild.channels.create({
            name: `🔊 ${member.displayName}のVC`,
            type: ChannelType.GuildVoice,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.MuteMembers,
                        PermissionFlagsBits.DeafenMembers,
                        PermissionFlagsBits.MoveMembers,
                    ],
                },
            ],
        });

        // チャンネル登録
        await dbService.registerActiveVC(channel.id, member.id, guild.id);

        // ユーザーを新しいVCに移動
        await member.voice.setChannel(channel);

        logger.info(`Created personal VC "${channel.name}" for ${member.user.username}`);
        return channel;
    }

    /**
     * VCが空であれば削除する
     */
    async deleteVCIfEmpty(channel: VoiceChannel): Promise<boolean> {
        if (channel.members.size > 0) return false;

        try {
            await channel.delete('Personal VC empty — auto-delete');
            await dbService.removeActiveVC(channel.id);
            logger.info(`Deleted empty personal VC "${channel.name}"`);
            return true;
        } catch (error) {
            logger.error(`Failed to delete VC ${channel.id}`, error);
            return false;
        }
    }

    /**
     * 起動時に孤立したVCをクリーンアップする
     */
    async cleanupOrphanedChannels(client: Client): Promise<void> {
        const activeVCs = await dbService.getAllActiveVCs();
        const channelIds = Object.keys(activeVCs);

        if (channelIds.length === 0) return;

        logger.info(`Checking ${channelIds.length} tracked VC(s) for cleanup...`);

        for (const channelId of channelIds) {
            const entry = activeVCs[channelId];
            if (!entry) continue;

            try {
                const guild = await client.guilds.fetch(entry.guildId);
                const channel = guild.channels.cache.get(channelId);

                if (!channel || !channel.isVoiceBased()) {
                    // チャンネルが存在しない場合はDBから削除
                    await dbService.removeActiveVC(channelId);
                    logger.info(`Removed orphaned VC record: ${channelId}`);
                    continue;
                }

                // 空のVCは削除
                if (channel.isVoiceBased() && channel.members.size === 0) {
                    await channel.delete('Orphaned personal VC — startup cleanup');
                    await dbService.removeActiveVC(channelId);
                    logger.info(`Deleted orphaned empty VC: ${channelId}`);
                }
            } catch (error) {
                // ギルドやチャンネルが取得できない場合はDBから削除
                await dbService.removeActiveVC(channelId);
                logger.warn(`Cleaned up unreachable VC record: ${channelId}`);
            }
        }
    }
}

export const vcService = new VCService();
