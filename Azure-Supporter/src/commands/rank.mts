import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { dbService } from '../lib/db-service.js';

export const data = new SlashCommandBuilder().setName('rank').setDescription('ランクを表示します');
export async function execute(interaction: ChatInputCommandInteraction) {
	const { xp, level } = await dbService.updateUserXP(
		interaction.guildId!, 
		interaction.user.id, 
		0, // 確認だけならXP付与は0
		interaction.user.username
	);

	const embed = new EmbedBuilder()
		.setTitle(`${interaction.user.username}のランク`)
		.addFields(
			{ name: 'レベル', value: `Lv.${level}`, inline: true },
			{ name: '経験値', value: `${xp} XP`, inline: true }
		)
		.setColor('Blue');

	await interaction.reply({ embeds: [embed] });
}