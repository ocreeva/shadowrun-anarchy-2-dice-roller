import { ButtonInteraction, CommandInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';

import { RollUIModel } from '@/models';
import { RollUIView } from '@/views';

import type ICommand from './ICommand';

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
            idle: 300_000,
        });

        collector.on('collect', (interaction) => this.collect(interaction, model));
    }

    private async collect(interaction: ButtonInteraction, model: RollUIModel): Promise<void> {
        const view = new RollUIView(model);

        interaction.update(view.update());
    }

    public static instance: ICommand = new RollUICommand();
}
