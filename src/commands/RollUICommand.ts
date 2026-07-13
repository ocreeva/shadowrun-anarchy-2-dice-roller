import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('sra2')
    .setDescription('Roll UI for Shadowrun Anarchy 2.0');

export async function execute(interaction: CommandInteraction) {
    return interaction.reply('Hello, world!');
}
