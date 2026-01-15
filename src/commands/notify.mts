import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('notify')
	.setDescription('Send an update notification message to a selected channel')
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to send the notification to')
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
	.addStringOption(option =>
		option.setName('title')
			.setDescription('The title of the notification')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('message')
			.setDescription('The notification message')
			.setRequired(true))
	.addStringOption(option =>
		option.setName('color')
			.setDescription('The embed color (optional)')
			.setRequired(false)
			.addChoices(
				{ name: 'Blue', value: 'Blue' },
				{ name: 'Green', value: 'Green' },
				{ name: 'Red', value: 'Red' },
				{ name: 'Yellow', value: 'Yellow' },
				{ name: 'Purple', value: 'Purple' },
				{ name: 'Orange', value: 'Orange' }
			))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel('channel', true);
	const title = interaction.options.getString('title', true);
	const message = interaction.options.getString('message', true);
	const color = interaction.options.getString('color') || 'Blue';

	// Verify the channel is a text-based channel that supports sending messages
	// The command builder restricts to GuildText and GuildAnnouncement, both have send()
	if (!('send' in channel) || typeof channel.send !== 'function') {
		await interaction.reply({ 
			content: 'The selected channel must be a text channel!', 
			ephemeral: true 
		});
		return;
	}

	try {
		// Create the notification embed
		const embed = new EmbedBuilder()
			.setTitle(`📢 ${title}`)
			.setDescription(message)
			.setColor(color as any)
			.setTimestamp()
			.setFooter({ text: `Sent by ${interaction.user.username}` });

		// Send the notification to the selected channel
		await channel.send({ embeds: [embed] });

		// Confirm to the user
		await interaction.reply({ 
			content: `✅ Notification sent successfully to ${channel}!`, 
			ephemeral: true 
		});
	} catch (error) {
		console.error('Error sending notification:', error);
		await interaction.reply({ 
			content: '❌ Failed to send the notification. Please check the bot\'s permissions in that channel.', 
			ephemeral: true 
		});
	}
}
