import { Events, type VoiceState, type VoiceChannel } from 'discord.js';
import { dbService } from '../lib/db-service.mjs';
import { vcService } from '../services/vc.service.mjs';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('VoiceStateUpdate');

export default {
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState) {
        const member = newState.member ?? oldState.member;
        if (!member || member.user.bot) return;

        const guild = newState.guild;
        const joinedChannel = newState.channel;
        const leftChannel = oldState.channel;

        // --- ユーザーがジェネレーターチャンネルに参加 ---
        if (joinedChannel && joinedChannel.id !== leftChannel?.id) {
            try {
                const voiceConfig = await dbService.getVoiceConfig(guild.id);
                if (voiceConfig && joinedChannel.id === voiceConfig.generatorChannelId) {
                    await vcService.createPersonalVC(guild, member, voiceConfig.categoryId);
                }
            } catch (error) {
                logger.error('Error creating personal VC', error);
            }
        }

        // --- ユーザーがトラッキング中のVCから退出 ---
        if (leftChannel && leftChannel.id !== joinedChannel?.id) {
            try {
                const owner = await dbService.getVCOwner(leftChannel.id);
                if (owner) {
                    await vcService.deleteVCIfEmpty(leftChannel as VoiceChannel);
                }
            } catch (error) {
                logger.error('Error handling VC leave', error);
            }
        }
    },
};
