import '@/services/Env';

import { REST, Routes } from 'discord.js';

import { RollUICommand } from '@/commands';
import { Log } from '@/services';

const commandData = [
    RollUICommand.data,
];

const restClient = new REST()
    .setToken(process.env.DISCORD_TOKEN);

async function register() {
    try {
        Log.info(`Registering ${commandData.length} application (/) commands.`);

        await restClient.put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: commandData });

        Log.info('Successfully registered commands.');
    } catch (err) {
        Log.error('Failed to register commands.', err);
    }
}

switch (process.argv[2]) {
case 'register':
    register();
    break;

default:
    Log.warn(`Unexpected 'commands' action: ${process.argv[2]}`);
    break;
}
