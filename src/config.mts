import dotenv from 'dotenv';
dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_IDS } = process.env;

const red = "\x1b[31m";
const reset = "\x1b[0m";

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !GUILD_IDS) {
  console.log(`${red}Error: ${reset}Missing required environment variables. Please check your .env file.`);
  process.exit(1);
}

// Parse comma-separated guild IDs
const parsedGuildIds = GUILD_IDS.split(',').map(id => id.trim()).filter(id => id.length > 0);

if (parsedGuildIds.length === 0) {
  console.log(`${red}Error: ${reset}GUILD_IDS must contain at least one guild ID.`);
  process.exit(1);
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  GUILD_IDS: parsedGuildIds,
};