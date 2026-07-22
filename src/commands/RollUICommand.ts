import { ButtonInteraction, CommandInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';

import { RollUIModel } from '@/models';
import { RollUIView } from '@/views';

import ICommand from './ICommand';

export default class RollUICommand implements ICommand {
    public data = new SlashCommandBuilder()
        .setName('sra2')
        .setDescription('Roll UI for Shadowrun Anarchy 2.0');

    public async execute(interaction: CommandInteraction): Promise<void> {
        const model = new RollUIModel();
        const view = new RollUIView(model);

        const response = await interaction.reply(view.generate());
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 3_600_000,
        });

        collector.on('collect', this.collect);
    }

    private async collect(interaction: ButtonInteraction): Promise<void> {
        interaction.deferUpdate();
    }

    public static instance: ICommand = new RollUICommand();
}
