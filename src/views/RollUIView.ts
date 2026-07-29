import { ActionRowBuilder, APIMessageTopLevelComponent, ButtonBuilder, ButtonStyle, InteractionReplyOptions, InteractionUpdateOptions, JSONEncodable, MessageFlags, SeparatorBuilder } from "discord.js";

import { RollUIModel } from "@/models";

export default class RollUIView {
    private readonly PoolGridWidth: number = 5;
    private readonly PoolGridHeight: number = 4;

    constructor(private model: RollUIModel) {}

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
            .setCustomId(`${RollUIModel.PoolPrefix}_${value}`);
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
            .setCustomId('roll');
    }

    private render_separator(): SeparatorBuilder {
        return new SeparatorBuilder();
    }
}
