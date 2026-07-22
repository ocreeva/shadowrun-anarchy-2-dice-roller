import { ActionRowBuilder, APIMessageTopLevelComponent, ButtonBuilder, ButtonStyle, InteractionReplyOptions, JSONEncodable, MessageFlags } from "discord.js";

import { RollUIModel } from "@/models";

export default class RollUIView {
    private PoolGridWidth: number = 5;
    private PoolGridHeight: number = 4;

    constructor(private model: RollUIModel) {}

    public generate(): InteractionReplyOptions {
        const components: JSONEncodable<APIMessageTopLevelComponent>[] = [];

        for (let poolRowIndex = 0; poolRowIndex < this.PoolGridHeight; poolRowIndex++)
        {
            components.push(this.render_poolRow(poolRowIndex));
        }

        return {
            components,
            flags: MessageFlags.Ephemeral,
        };
    }

    private render_poolRow(rowIndex: number): ActionRowBuilder<ButtonBuilder> {
        const rowBuilder = new ActionRowBuilder<ButtonBuilder>();

        const rowOffset = rowIndex * this.PoolGridWidth + 1;
        for (let colIndex = 0; colIndex < this.PoolGridWidth; colIndex++) {
            rowBuilder.addComponents(this.render_poolButton(rowOffset + colIndex));
        }

        return rowBuilder;
    }

    private render_poolButton(value: number): ButtonBuilder {
        return new ButtonBuilder()
            .setStyle(value <= this.model.riskDice ? ButtonStyle.Danger : value <= this.model.dicePool ? ButtonStyle.Primary : ButtonStyle.Secondary)
            .setLabel(`${value}`)
            .setCustomId(`pool_${value}`);
    }
}