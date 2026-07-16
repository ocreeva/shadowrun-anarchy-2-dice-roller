import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { ICommand } from './ICommand';

export class RollUICommand implements ICommand {
    public data = new SlashCommandBuilder()
        .setName('sra2')
        .setDescription('Roll UI for Shadowrun Anarchy 2.0');

    public async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Hello, world!');
    }

    public static instance: ICommand = new RollUICommand();
}
