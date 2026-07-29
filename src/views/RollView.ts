import {
    ActionRowBuilder,
    type APIMessageTopLevelComponent,
    ButtonBuilder,
    ButtonStyle,
    type InteractionReplyOptions,
    type InteractionUpdateOptions,
    type JSONEncodable,
    MessageFlags,
    SeparatorBuilder
} from "discord.js";

import { RollModel } from "@/models";

export default class RollView {
    private readonly PoolGridWidth: number = 5;
    private readonly PoolGridHeight: number = 4;

    constructor(private readonly model: RollModel) {}

    public generate(): InteractionReplyOptions {
        return {
            components: this.render_components(),
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        };
    }

    public update(): InteractionUpdateOptions {
        return {
            components: this.render_components(),
            flags: MessageFlags.IsComponentsV2,
        };
    }

    private render_components(): JSONEncodable<APIMessageTopLevelComponent>[] {
        const components: JSONEncodable<APIMessageTopLevelComponent>[] = [];

        components.push(...this.render_pool());

        components.push(this.render_separator());

        components.push(...this.render_risk());

        components.push(this.render_separator());

        components.push(...this.render_modifier());

        components.push(this.render_separator());

        components.push(...this.render_roll());

        return components;
    }

    private *render_pool(): Generator<JSONEncodable<APIMessageTopLevelComponent>> {
        for (let index = 0; index < this.PoolGridHeight; index++) {
            yield this.render_pool_row(index);
        }
    }

    private render_pool_row(rowIndex: number): ActionRowBuilder<ButtonBuilder> {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

        const offset = rowIndex * this.PoolGridWidth + 1;
        for (let index = 0; index < this.PoolGridWidth; index++) {
            rowBuilder.addComponents(this.render_pool_button(offset + index));
        }

        return rowBuilder;
    }

    private render_pool_button(value: number): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(value <= this.model.riskDice ? ButtonStyle.Danger : value <= this.model.dicePool ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setLabel(`${value}`)
            .setCustomId(`${RollModel.PoolPrefix}_${value}`);
    }

    private *render_risk(): Generator<JSONEncodable<APIMessageTopLevelComponent>> {
        yield this.render_risk_row();
    }

    private render_risk_row(): ActionRowBuilder<ButtonBuilder> {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

        for (let index = 0; index <= RollModel.MaxRiskReduction; index++) {
            rowBuilder.addComponents(this.render_risk_button(index));
        }

        return rowBuilder;
    }

    private render_risk_button(value: number): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(value === this.model.riskReduction ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setLabel(`RR ${value}`)
            .setCustomId(`${RollModel.RiskPrefix}_${value}`);
    }

    private *render_modifier(): Generator<JSONEncodable<APIMessageTopLevelComponent>> {
        yield this.render_modifier_row();
    }

    private render_modifier_row(): ActionRowBuilder<ButtonBuilder> {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

        rowBuilder.addComponents(this.render_modifier_advantage());
        rowBuilder.addComponents(this.render_modifier_disadvantage());

        return rowBuilder;
    }

    private render_modifier_advantage(): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(this.model.hasAdvantage ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setLabel('Advantage')
            .setCustomId(`${RollModel.ModifierPrefix}_${RollModel.AdvantageModifierId}`);
    }

    private render_modifier_disadvantage(): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(this.model.hasDisadvantage ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setLabel('Disadvantage')
            .setCustomId(`${RollModel.ModifierPrefix}_${RollModel.DisadvantageModifierId}`);
    }

    private *render_roll(): Generator<JSONEncodable<APIMessageTopLevelComponent>> {
        yield this.render_roll_row();
    }

    private render_roll_row(): ActionRowBuilder<ButtonBuilder> {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

        rowBuilder.addComponents(this.render_roll_button());

        return rowBuilder;
    }

    private render_roll_button(): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('Roll')
            .setCustomId(RollModel.RollPrefix);
    }

    private render_separator(): SeparatorBuilder {
        return new SeparatorBuilder();
    }
}
