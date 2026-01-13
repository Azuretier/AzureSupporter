import { Message } from 'discord.js';
import { dbService } from '../lib/db-service.js';

const cooldowns = new Set<string>();

export const handleExperience = async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    if (cooldowns.has(message.author.id)) return;
    
    // ランダムなXP付与 (15~25)
    const xpToAdd = Math.floor(Math.random() * 11) + 15;

    await dbService.updateUserXP(message.guild.id, message.author.id, xpToAdd, message.author.username);

    // 1分間のクールタイム
    cooldowns.add(message.author.id);
    setTimeout(() => cooldowns.delete(message.author.id), 60000);
};