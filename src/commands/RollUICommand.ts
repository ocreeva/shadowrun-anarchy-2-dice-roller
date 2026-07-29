import { ButtonComponent, ButtonInteraction, CommandInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';

import { RollUIModel } from '@/models';
import { Log } from '@/services';
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
        this.collect_button(interaction.component as ButtonComponent, model);

        const view = new RollUIView(model);

        interaction.update(view.update());
    }

    private collect_button(button: ButtonComponent, model: RollUIModel) {
        if (!button.customId) return;

        const [ prefix, id ] = button.customId.split('_', 2);
        switch (prefix) {
            case RollUIModel.PoolPrefix:
                this.collect_pool(parseInt(id), model);
                break;

            default:
                Log.warn(`Unhandled button prefix for custom ID: ${button.customId}`);
                break;
        }
    }

    private collect_pool(value: number, model: RollUIModel) {
        if (model.riskDice === value) {
            model.dicePool = value;
            model.riskDice = 0;
        } else if (model.dicePool < value) {
            model.dicePool = value;
        } else {
            model.riskDice = value;
        }
    }

    public static instance: ICommand = new RollUICommand();
}
