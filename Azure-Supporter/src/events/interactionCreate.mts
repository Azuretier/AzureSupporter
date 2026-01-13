// src/events/interactionCreate.ts 内の処理
import type { Interaction, TextChannel } from 'discord.js';
import { dbService  } from '../lib/db-service.js';
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ChannelType } from 'discord.js';

export const handleExecution = async (interaction: Interaction) => {
    // Approve join button - only admin can click
    if (interaction.isButton() && interaction.customId.startsWith('approve_join_')) {
        const ADMIN_USER_ID = ''; // Same as in join.mts
        const TARGET_VOICE_CHANNEL_ID = ''; // Same as in join.mts
        
        if (ADMIN_USER_ID && interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({
                content: '❌ このボタンは管理者のみが使用できます。',
                ephemeral: true
            });
            return;
        }

        const parts = interaction.customId.split('_');
        const userId = parts[2];
        const currentVCId = parts[3];

        try {
            const guild = interaction.guild;
            if (!guild) return;

            const member = await guild.members.fetch(userId);
            const targetVC = await guild.channels.fetch(TARGET_VOICE_CHANNEL_ID);

            if (!targetVC || targetVC.type !== ChannelType.GuildVoice) {
                await interaction.reply({
                    content: '❌ 移動先のボイスチャンネルが見つかりません。',
                    ephemeral: true
                });
                return;
            }

            // Check if user is still in voice channel
            if (!member.voice.channel) {
                await interaction.reply({
                    content: '❌ ユーザーがボイスチャンネルにいません。',
                    ephemeral: true
                });
                return;
            }

            // Move user to target VC
            await member.voice.setChannel(targetVC);

            await interaction.reply({
                content: `✅ ${member} を ${targetVC} に移動しました。`,
                ephemeral: true
            });

            // Update message
            await interaction.message.edit({
                content: interaction.message.content + `\n\n✅ **承認済み** - ${interaction.user} によって承認されました`,
                components: []
            });

            // Notify user
            try {
                await member.send(`✅ 通話参加が承認されました！${targetVC.name} に移動しました。`);
            } catch (e) {
                console.log('Could not DM user');
            }

        } catch (error) {
            console.error('Error moving user:', error);
            await interaction.reply({
                content: '❌ ユーザーの移動に失敗しました。',
                ephemeral: true
            });
        }
        
        return;
    }

    // Deny join button
    if (interaction.isButton() && interaction.customId.startsWith('deny_join_')) {
        const ADMIN_USER_ID = ''; // Same as in join.mts
        
        if (ADMIN_USER_ID && interaction.user.id !== ADMIN_USER_ID) {
            await interaction.reply({
                content: '❌ このボタンは管理者のみが使用できます。',
                ephemeral: true
            });
            return;
        }

        const userId = interaction.customId.replace('deny_join_', '');

        try {
            await interaction.reply({
                content: '❌ リクエストを拒否しました。',
                ephemeral: true
            });

            await interaction.message.edit({
                content: interaction.message.content + `\n\n❌ **拒否されました** - ${interaction.user} によって拒否されました`,
                components: []
            });

            // Notify user
            const guild = interaction.guild;
            if (guild) {
                const member = await guild.members.fetch(userId);
                try {
                    await member.send('❌ 通話参加リクエストが拒否されました。');
                } catch (e) {
                    console.log('Could not DM user');
                }
            }
        } catch (error) {
            console.error('Error denying request:', error);
        }
        
        return;
    }

    // ボタンが押されたとき
    if (interaction.isButton() && interaction.customId === 'open_translator_modal') {
        const modal = new ModalBuilder()
            .setCustomId('translator_modal')
            .setTitle('翻訳者 応募フォーム');

        const langInput = new TextInputBuilder()
            .setCustomId('languages')
            .setLabel('対応可能な言語 (例: 日英、日韓など)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('例: 日本語・英語')
            .setRequired(true);

        const expInput = new TextInputBuilder()
            .setCustomId('experience')
            .setLabel('翻訳の経験や自己PR')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('意気込みを書いてください')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(langInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(expInput)
        );

        await interaction.showModal(modal);
    }

    // モーダルが送信されたとき
    if (interaction.isModalSubmit() && interaction.customId === 'translator_modal') {
        const languages = interaction.fields.getTextInputValue('languages');
        const experience = interaction.fields.getTextInputValue('experience');

        // data.json からログ用チャンネルIDを取得 (dbService経由)
        const guildConfig = await dbService.getTranslatorConfig(interaction.guildId!) as { logChannelId: string } | null | undefined;
        
        // Type guard: check if config exists and has logChannelId
        if (!guildConfig?.logChannelId) {
            await interaction.reply({ 
                content: 'エラー: ログチャンネルが設定されていません。', 
                ephemeral: true 
            });
            return;
        }
        
        const logChannel = interaction.guild?.channels.cache.get(guildConfig.logChannelId) as TextChannel;

        const embed = new EmbedBuilder()
            .setTitle('📩 新規翻訳者応募')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: '対応言語', value: languages },
                { name: '経験・PR', value: experience }
            )
            .setColor('#5865F2')
            .setTimestamp();

        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
            await interaction.reply({ content: '応募を送信しました。管理者の確認をお待ちください！', ephemeral: true });
        } else {
            await interaction.reply({ content: 'エラー：ログチャンネルが設定されていません。', ephemeral: true });
        }
    }
}