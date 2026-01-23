import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type StringSelectMenuInteraction,
  type ModalSubmitInteraction,
  type Client,
  type TextChannel,
  PermissionFlagsBits,
} from 'discord.js';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('RulesVerification');

// ============================================================================
// CONFIGURATION - Easily add more languages and rules here
// ============================================================================

export interface RuleConfig {
  title: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  emoji: string;
  rules: RuleConfig[];
  messages: {
    ruleProgress: string;
    yesButton: string;
    completed: string;
    alreadyCompleted: string;
    followUp: string;
    modalTitle: string;
    modalPlaceholder: string;
    error: string;
  };
}

export interface RolesConfig {
  // Role ID given after completing all rules (ルールを読んだえらい人)
  verifiedRoleId: string;
  // Role ID to remove after verification (Pre-Member role)
  preMemberRoleId?: string;
  // Role ID to add when removing pre-member (Member role)
  memberRoleId?: string;
}

// Language configurations - Add new languages here
export const LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    emoji: '🇬🇧',
    rules: [
      {
        title: 'Respect yourself and others'
      },
      {
        title: 'No spam'
      },
      {
        title: 'Do not harass others'
      },
      {
        title: 'No rape',
      },
      {
        title: 'Fighting is OK'
      },
      {
        title: 'Do not share personal information'
      },
      {
        title: 'Follow Discord Terms of Service'
      },
      {
        title: 'If something happens, immediately inform a moderator.',
      },
      {
        title: 'This server aims to be enjoyable for everyone',
      },
      {
        title: 'Be kind and loving'
      }
    ],
    messages: {
      ruleProgress: '{current} ⋰ {total}',
      yesButton: 'Yes',
      completed:
        'Thank you for reading all the rules! <3 You now have full access to the server. Welcome! 🎉',
      alreadyCompleted:
        'Thank you for reading the rules! <3',
      followUp:
        '💬 Feel free to introduce yourself or say hello in the chat!',
      modalTitle: 'Welcome Message',
      modalPlaceholder: 'If you have something to say, write it in this box!',
      error: '❌ An error occurred. Please try again or contact an administrator.',
    },
  },
  ja: {
    code: 'ja',
    name: '日本語',
    emoji: '🇯🇵',
    rules: [
      {
        title: 'じぶんとたにんも、たいせつにしましょう'
      },
      {
        title: 'スパムはしないで、ください'
      },
      {
        title: 'ほかの人をこまらせないでね'
      },
      {
        title: '人を傷つけたらダメです。',
      },
      {
        title: 'けんかはしてもいいけど、仲直りする前提としてやってください。'
      },
      {
        title: '個人情報の扱いを大切にしましょう! (他人の個人情報をばらさないでください)'
      },
      {
        title: 'Discordの利用規約を守ってください。'
      },
      {
        title: 'なにかあったら、すぐにモデレーターにしらせてください。',
      },
      {
        title: '愛を持って優しく接しましょう！みんなが楽しめるサーバーを目指しています。',
      },
      {
        title: '以上です〇m(_ _ )m みんなで楽しいサーバーにしていきましょう♡'
      }
    ],
    messages: {
      ruleProgress: '{current} ⋰ {total}',
      yesButton: 'はい',
      completed:
        'ルールを読んでくれてありがとう♡ <@&1462510711820521503> と <@&1461233507849474180> ロールを付与したよ！！ サーバーへようこそ！🎉',
      alreadyCompleted:
        'ルールを読んでくれてありがとう♡',
      followUp:
        '💬 自己紹介したり、チャットで挨拶してみてね！。楽しい時間を過ごしてくださいね♡',
      modalTitle: 'ウェルカムメッセージ',
      modalPlaceholder: '何か伝えたいことがあったら、このボックスに書いてね！',
      error: '❌ エラーが発生しました。もう一度お試しいただくか、管理者にお問い合わせください。',
    },
  },
};

// Role configuration - Update these IDs for your server
export const ROLES_CONFIG: RolesConfig = {
  // Role ID given after completing all rules (ルールを読んだえらい人)
  verifiedRoleId: '1461233507849474180',
  // Role ID to remove after verification (Pre-Member role)
  preMemberRoleId: '1462508873544892646',
  // Role ID to add when removing pre-member (Member role)
  memberRoleId: '1462510711820521503',
};

// Channel ID where the rules verification button will be posted
export const RULES_CHANNEL_ID = '1461219536316665991';

// ============================================================================
// SLASH COMMAND - For admins to post the rules button
// ============================================================================

export const data = new SlashCommandBuilder()
  .setName('rules-setup')
  .setDescription('Post the rules verification button (Admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('rules_start')
      .setLabel('📋 ルールを読んでください ⋰ Read rules.')
      .setStyle(ButtonStyle.Primary)
  );

  const channel = interaction.channel;
  if (!channel || !channel.isSendable()) {
    await interaction.reply({ content: 'Cannot send message to this channel.', ephemeral: true });
    return;
  }

  await channel.send({
    components: [row],
  });

  await interaction.reply({ content: '✅ Rules message posted!', ephemeral: true });
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================

/**
 * Handle the initial rules button click - Show language selection
 */
export async function handleRulesStart(interaction: ButtonInteraction): Promise<boolean> {
  if (interaction.customId !== 'rules_start') return false;

  const guild = interaction.guild;
  if (!guild) return true;

  // Show language selection
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('rules_language_select')
    .setPlaceholder('言語を選択してください　⋰　Select Language please.')
    .addOptions(
      Object.values(LANGUAGES).map((lang) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(lang.name)
          .setDescription(`View rules in ${lang.name}`)
          .setValue(lang.code)
          .setEmoji(lang.emoji)
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await interaction.reply({
    components: [row],
    ephemeral: true,
  });

  return true;
}

/**
 * Handle language selection - Show first rule
 */
export async function handleLanguageSelect(interaction: StringSelectMenuInteraction): Promise<boolean> {
  if (interaction.customId !== 'rules_language_select') return false;

  const langCode = interaction.values[0];
  if (!langCode) {
    await interaction.reply({ content: 'Invalid language selection.', ephemeral: true });
    return true;
  }
  const lang = LANGUAGES[langCode];

  if (!lang) {
    await interaction.reply({ content: 'Invalid language selection.', ephemeral: true });
    return true;
  }

  await showRule(interaction, lang, 0);
  return true;
}

/**
 * Handle yes button click - proceed to next rule or complete verification
 */
export async function handleRulesAgree(interaction: ButtonInteraction): Promise<boolean> {
  // Format: rules_yes_{langCode}_{ruleIndex}
  if (!interaction.customId.startsWith('rules_yes_')) return false;

  const parts = interaction.customId.split('_');
  const langCode = parts[2];
  const indexStr = parts[3];
  
  if (!langCode || !indexStr) return true;
  
  const currentIndex = parseInt(indexStr, 10);
  const lang = LANGUAGES[langCode];
  if (!lang) return true;

  const guild = interaction.guild;
  if (!guild) return true;

  const isLastRule = currentIndex === lang.rules.length - 1;

  // If not the last rule, show the next rule
  if (!isLastRule) {
    await showRule(interaction, lang, currentIndex + 1);
    return true;
  }

  // Last rule - complete verification
  try {
    const member = await guild.members.fetch(interaction.user.id);

    if (member.roles.cache.has(ROLES_CONFIG.verifiedRoleId)) {
      await interaction.update({
        content: lang.messages.alreadyCompleted,
        embeds: [],
        components: [],
      });
      return true;
    }

    // First, send the completion message
    await interaction.update({
      content: lang.messages.completed,
      embeds: [],
      components: [],
    });

    // Add verified role (ルールを読んだえらい人)
    if (ROLES_CONFIG.verifiedRoleId) {
      await member.roles.add(ROLES_CONFIG.verifiedRoleId);
      logger.info(`Added verified role to ${interaction.user.username}`);
    }

    // If user has pre-member role, replace it with member role
    if (ROLES_CONFIG.preMemberRoleId && member.roles.cache.has(ROLES_CONFIG.preMemberRoleId)) {
      await member.roles.remove(ROLES_CONFIG.preMemberRoleId);
      logger.info(`Removed pre-member role from ${interaction.user.username}`);
      
      if (ROLES_CONFIG.memberRoleId) {
        await member.roles.add(ROLES_CONFIG.memberRoleId);
        logger.info(`Added member role to ${interaction.user.username}`);
      }
    }

    logger.info(`User ${interaction.user.username} completed rules verification`);

    // After a delay, show a modal for the user to send a message
    setTimeout(async () => {
      try {
        // Send a button to open the modal (since we can't show modal after update)
        await interaction.followUp({
          content: lang.messages.followUp,
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`rules_modal_${lang.code}`)
                .setLabel('💬 メッセージを送る / Send a message')
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
          ephemeral: true,
        });
      } catch (err) {
        logger.error('Error sending follow-up message', err);
      }
    }, 3000); // 3 seconds delay
  } catch (error) {
    logger.error('Error completing rules verification', error);
    await interaction.reply({
      content: lang.messages.error,
      ephemeral: true,
    });
  }

  return true;
}

/**
 * Display a specific rule with navigation buttons
 */
async function showRule(
  interaction: ButtonInteraction | StringSelectMenuInteraction,
  lang: LanguageConfig,
  ruleIndex: number
) {
  const rule = lang.rules[ruleIndex];
  if (!rule) {
    await interaction.reply({ content: 'Invalid rule index.', ephemeral: true });
    return;
  }
  const totalRules = lang.rules.length;

  const progressText = lang.messages.ruleProgress
    .replace('{current}', String(ruleIndex + 1))
    .replace('{total}', String(totalRules));

  // Simple embed with only title
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(rule.title)
    .setFooter({ text: progressText });

  // Single "はい" button
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`rules_yes_${lang.code}_${ruleIndex}`)
      .setLabel(lang.messages.yesButton)
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.update({
    content: '',
    embeds: [embed],
    components: [row],
  });
}

// ============================================================================
// MASTER HANDLER - Call this from interactionExtras.mts
// ============================================================================

export async function handleRulesVerification(
  interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction
): Promise<boolean> {
  if (interaction.isButton()) {
    return (
      (await handleRulesStart(interaction)) ||
      (await handleRulesAgree(interaction)) ||
      (await handleModalOpen(interaction))
    );
  }

  if (interaction.isStringSelectMenu()) {
    return await handleLanguageSelect(interaction);
  }

  if (interaction.isModalSubmit()) {
    return await handleModalSubmit(interaction);
  }

  return false;
}

/**
 * Handle modal open button click
 */
export async function handleModalOpen(interaction: ButtonInteraction): Promise<boolean> {
  if (!interaction.customId.startsWith('rules_modal_')) return false;

  const langCode = interaction.customId.split('_')[2];
  const lang = LANGUAGES[langCode || 'ja'];
  if (!lang) return true;

  const modal = new ModalBuilder()
    .setCustomId(`rules_welcome_modal_${lang.code}`)
    .setTitle(lang.messages.modalTitle);

  const messageInput = new TextInputBuilder()
    .setCustomId('welcome_message')
    .setLabel(lang.messages.modalPlaceholder)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMaxLength(1000);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
  modal.addComponents(actionRow);

  await interaction.showModal(modal);
  return true;
}

/**
 * Handle modal submission
 */
export async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<boolean> {
  if (!interaction.customId.startsWith('rules_welcome_modal_')) return false;

  const langCode = interaction.customId.split('_')[3];
  const lang = LANGUAGES[langCode || 'ja'];
  if (!lang) return true;

  const message = interaction.fields.getTextInputValue('welcome_message');

  if (message && message.trim()) {
    await interaction.reply({
      content: `✨ ${interaction.user} からのメッセージ:\n${message}`,
      ephemeral: false,
    });
    logger.info(`User ${interaction.user.username} sent welcome message: ${message}`);
  } else {
    await interaction.reply({
      content: '👋 ようこそ！ / Welcome!',
      ephemeral: true,
    });
  }

  return true;
}

// ============================================================================
// BOT READY HANDLER - Call this on bot ready to ensure buttons work after restart
// ============================================================================

export function registerRulesVerificationHandlers(client: Client) {
  logger.info('Rules verification handlers registered');
  // The handlers are stateless and work via customId matching
  // No additional setup needed as long as handleRulesVerification is called
  // from the interactionCreate event handler
}
