import '@/services/Env';

import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { RollUICommand } from '@/commands';
import { Log } from '@/services';
import { ICommand } from '@/commands/ICommand';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    Log.info(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    let command: ICommand;
    switch (interaction.commandName) {
        case RollUICommand.instance.data.name:
            command = RollUICommand.instance;
            break;

        default:
            Log.error(`Unknown chat command: ${interaction.commandName}`);
            return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        Log.error(`There was an error while executing command: ${interaction.commandName}`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command.',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command.',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
