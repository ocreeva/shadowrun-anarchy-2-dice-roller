import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_APP_ID, DISCORD_TOKEN } = process.env;

if (!DISCORD_APP_ID) throw new Error('Missing environment variable: DISCORD_APP_ID');
if (!DISCORD_TOKEN) throw new Error('Missing environment variable: DISCORD_TOKEN');
