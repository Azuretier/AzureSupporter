import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    type ChatInputCommandInteraction,
} from 'discord.js';
import { dbService } from '../lib/db-service.mjs';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('VCSetupCommand');

export const data = new SlashCommandBuilder()
    .setName('vc-setup')
    .setDescription('パーソナライズドVCのジェネレーターチャンネルとカテゴリーを設定')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option
            .setName('generator_channel')
            .setDescription('ユーザーが参加するとVCが作られるトリガーチャンネル')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
    )
    .addChannelOption(option =>
        option
            .setName('category')
            .setDescription('作成されるVCが配置されるカテゴリー')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const generatorChannel = interaction.options.getChannel('generator_channel', true);
        const category = interaction.options.getChannel('category', true);
        const guildId = interaction.guildId;

        if (!guildId) {
            await interaction.editReply({ content: '❌ このコマンドはサーバー内でのみ使用できます。' });
            return;
        }

        await dbService.setVoiceConfig(guildId, {
            generatorChannelId: generatorChannel.id,
            categoryId: category.id,
        });

        logger.info(`VC setup configured for guild ${guildId}: generator=${generatorChannel.id}, category=${category.id}`);

        await interaction.editReply({
            content: [
                '✅ パーソナライズドVCを設定しました！',
                '',
                `🎙️ ジェネレーターチャンネル: <#${generatorChannel.id}>`,
                `📁 カテゴリー: ${category.name}`,
                '',
                `ユーザーが <#${generatorChannel.id}> に参加すると、自動でプライベートVCが作られます。`,
            ].join('\n'),
        });
    } catch (error) {
        logger.error('Error setting up VC config', error);
        await interaction.editReply({
            content: '❌ VC設定中にエラーが発生しました。ログを確認してください。',
        });
    }
}
