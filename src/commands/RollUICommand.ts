import { ButtonComponent, ButtonInteraction, CommandInteraction, ComponentType, SlashCommandBuilder } from 'discord.js';

import { RollUIModel } from '@/models';
import { Log } from '@/services';
import { RollUIView } from '@/views';

import type ICommand from './ICommand';

enum CollectionType {
    Apply,
    Update,
}

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
        const collectionType = this.collect_button(interaction.component as ButtonComponent, model);

        switch (collectionType) {
            case CollectionType.Apply:
                // TODO: roll
                break;

            case CollectionType.Update:
                interaction.update(new RollUIView(model).update());
                break;

            default:
                Log.warn(`Unexpected collection type: ${collectionType}`);
                break;
        }
    }

    private collect_button(button: ButtonComponent, model: RollUIModel): CollectionType {
        if (!button.customId) return CollectionType.Update;

        const [ prefix, id ] = button.customId.split('_', 2);
        switch (prefix) {
            case RollUIModel.PoolPrefix:
                this.collect_pool(parseInt(id), model);
                return CollectionType.Update;

            case RollUIModel.RiskPrefix:
                this.collect_risk(parseInt(id), model);
                return CollectionType.Update;

            case RollUIModel.ModifierPrefix:
                this.collect_modifier(id, model);
                return CollectionType.Update;

            case RollUIModel.RollPrefix:
                return CollectionType.Apply;

            default:
                Log.warn(`Unhandled button prefix for custom ID: ${button.customId}`);
                return CollectionType.Update;
        }
    }

    private collect_pool(value: number, model: RollUIModel) {
        if (value < 0 || value > RollUIModel.MaxDicePool) {
            Log.warn(`Dice pool collection outside of expected range: ${value}`);
            return;
        }

        if (model.riskDice === value) {
            model.dicePool = value;
            model.riskDice = 0;
        } else if (model.dicePool < value) {
            model.dicePool = value;
        } else {
            model.riskDice = value;
        }
    }

    private collect_risk(value: number, model: RollUIModel) {
        if (value < 0 || value > RollUIModel.MaxRiskReduction) {
            Log.warn(`Risk reduction collection outside of expected range: ${value}`);
            return;
        }

        model.riskReduction = value;
    }

    private collect_modifier(modifier: string, model: RollUIModel) {
        switch (modifier) {
            case RollUIModel.AdvantageModifierId:
                model.hasAdvantage = !model.hasAdvantage;
                model.hasDisadvantage = false;
                break;

            case RollUIModel.DisadvantageModifierId:
                model.hasAdvantage = false;
                model.hasDisadvantage = !model.hasDisadvantage;
                break;

            default:
                Log.warn(`Unhandled modifier ID: ${modifier}`);
                break;
        }
    }

    public static instance: ICommand = new RollUICommand();
}
