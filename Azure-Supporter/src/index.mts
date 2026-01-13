import type { Interaction } from 'discord.js'
import { Client, GatewayIntentBits, Events, REST, Routes, MessageFlags, Collection } from 'discord.js';
import { config } from './config.mjs'
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Define extended client type
type ExtendedClient = Client & { commands: Collection<string, any> };

// Botクライアントの作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

const ROLE_IDS = {
  EN: '1457198048697647145',
  JP: '1457198172882337862'
};

client.commands = new Collection();
const commands = [];
// Grab all the command files from the commands directory you created earlier
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.mts'));

// Load commands
(async () => {
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(pathToFileURL(filePath).href);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(config.DISCORD_TOKEN);
    // and deploy your commands!
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.AZURET_GUILD_ID), { body: commands }) as unknown[];
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

// Botが起動した時のイベント
client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ 準備完了！ ${readyClient.user.tag} としてログインしました。`);
});

// コマンド（インタラクション）を受け取った時のイベント
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    // スラッシュコマンド以外は無視
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

async function assignRole(userId: string, roleType: 'EN' | 'JP') {
  try {
    const guild = await client.guilds.fetch(config.AZURET_GUILD_ID);
    const member = await guild.members.fetch(userId);
    const roleId = ROLE_IDS[roleType];
    
    if (!roleId) throw new Error('Invalid role type');
    
    // Remove opposite role first (optional - ensures only one)
    const oppositeRole = roleType === 'EN' ? 'JP' : 'EN';
    const oppositeRoleId = ROLE_IDS[oppositeRole];
    
    if (member.roles.cache.has(oppositeRoleId)) {
      await member.roles.remove(oppositeRoleId);
    }
    
    // Add selected role
    await member.roles.add(roleId);
    
    return { success: true, role: roleType };
  } catch (error) {
    console.error('Role assignment failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
// ログイン
client.login(config.DISCORD_TOKEN);

export {assignRole, client};