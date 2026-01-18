import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type StringSelectMenuInteraction,
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
    error: string;
  };
}

export interface RolesConfig {
  // Role ID given after completing all rules
  verifiedRoleId: string;
  // Role ID to remove after verification (optional)
  preVerifiedRoleId?: string;
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
        title: 'スパムはやめてください。'
      },
      {
        title: 'たにんをこまらせるこういはやめてください'
      },
      {
        title: 'レイプはきんしです',
      },
      {
        title: 'けんかはOK'
      },
      {
        title: '個人情報さらすのは禁止'
      },
      {
        title: 'Discordの利用規約を守ってください。'
      },
      {
        title: 'なにかあったら、すぐにモデレーターにしらせてください。',
      },
      {
        title: 'このサーバーはみんながたのしめることがもくひょうです',
      },
      {
        title: 'あいをもってせっしましょう'
      }
    ],
    messages: {
      ruleProgress: '{current} ⋰ {total}',
      yesButton: 'はい',
      completed:
        'ルールを読んでくれてありがとう♡ サーバーのすべてのチャンネルがみえるようになります🎉',
      alreadyCompleted:
        'ルールを読んでくれてありがとう♡',
      error: '❌ エラーが発生しました。もう一度お試しいただくか、管理者にお問い合わせください。',
    },
  },
};

// Role configuration - Update these IDs for your server
export const ROLES_CONFIG: RolesConfig = {
  // Role ID given after completing all rules (Verified/Member role)
  verifiedRoleId: '1461233507849474180',
  // Role ID to remove after verification (optional - Pre-Member role)
  preVerifiedRoleId: '',
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
      .setLabel('📋 ルールを読む　⋰　ᴿᴱᴬᴰ ᵀᴴᴱ ᴿᵁᴸᴱ')
      .setStyle(ButtonStyle.Primary)
  );

  const channel = interaction.channel;
  if (!channel || !channel.isSendable()) {
    await interaction.reply({ content: 'Cannot send message to this channel.', ephemeral: true });
    return;
  }

  await channel.send({
    content: 'サーバーへようこそ！ルールを読んでほしいです\n-# Welcome to the server! Please read the rules.\n',
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
    .setPlaceholder('言語を選択　⋰　Select Language')
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

    await interaction.update({
      content: lang.messages.completed,
      embeds: [],
      components: [],
    })

    // Add verified role
    if (ROLES_CONFIG.verifiedRoleId) {
      await member.roles.add(ROLES_CONFIG.verifiedRoleId);
      logger.info(`Added verified role to ${interaction.user.username}`);  
    }

    logger.info(`User ${interaction.user.username} completed rules verification`);
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
  interaction: ButtonInteraction | StringSelectMenuInteraction
): Promise<boolean> {
  if (interaction.isButton()) {
    return (
      (await handleRulesStart(interaction)) ||
      (await handleRulesAgree(interaction))
    );
  }

  if (interaction.isStringSelectMenu()) {
    return await handleLanguageSelect(interaction);
  }

  return false;
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
