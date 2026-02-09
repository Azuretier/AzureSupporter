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
        GatewayIntentBits.GuildMembers,
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
    // and deploy your commands to all configured guilds!
    console.log(`Started refreshing ${commands.length} application (/) commands for ${config.GUILD_IDS.length} guild(s).`);

    for (const guildId of config.GUILD_IDS) {
        try {
            const data = await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId), { body: commands }) as unknown[];
            console.log(`Successfully reloaded ${data.length} commands for guild ${guildId}.`);
        } catch (error) {
            console.error(`Failed to reload commands for guild ${guildId}:`, error);
        }
    }
})();

// Load and register events from src/events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file: string) => file.endsWith('.ts') || file.endsWith('.mts'));

// Prefer .ts over .mts when both exist (avoid double-registering duplicates)
const selectedEventFiles = new Map<string, string>();
for (const file of eventFiles) {
    const ext = path.extname(file);
    const base = file.slice(0, -ext.length);
    const existing = selectedEventFiles.get(base);
    if (!existing) {
        selectedEventFiles.set(base, file);
        continue;
    }
    if (path.extname(existing) === '.mts' && ext === '.ts') {
        selectedEventFiles.set(base, file);
    }
}

(async () => {
    for (const file of selectedEventFiles.values()) {
        const filePath = path.join(eventsPath, file);
        const eventModule = await import(pathToFileURL(filePath).href);
        if (!('default' in eventModule)) continue;
        const event = eventModule.default;

        if (!event?.name || typeof event.execute !== 'function') {
            console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args: any[]) => event.execute(...args));
        } else {
            client.on(event.name, (...args: any[]) => event.execute(...args));
        }
    }
})();

async function assignRole(userId: string, roleType: 'EN' | 'JP') {
    try {
        const guild = await client.guilds.fetch(config.GUILD_IDS[0]!);
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

export { assignRole, client };