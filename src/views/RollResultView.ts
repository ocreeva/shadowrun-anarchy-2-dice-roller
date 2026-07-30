import {
    type APIMessageTopLevelComponent,
    type BaseInteraction,
    ContainerBuilder,
    type InteractionReplyOptions,
    type JSONEncodable,
    MessageFlags,
    TextDisplayBuilder,
} from "discord.js";

import { RollResultModel } from "@/models";

class RollResultView {
    private static readonly glitchTextLookup: string[] = [
        '',
        '*Minor Glitch*',
        '**Critical Glitch**',
        '***DISASTER***',
    ];

    constructor(private readonly interaction: BaseInteraction, private readonly model: RollResultModel) {}

    public generate(): InteractionReplyOptions {
        return {
            components: this.render_components(),
            flags: MessageFlags.IsComponentsV2,
        };
    }

    private render_components(): JSONEncodable<APIMessageTopLevelComponent>[] {
        const components: JSONEncodable<APIMessageTopLevelComponent>[] = [];

        if (this.model.risk.length > 0) {
            components.push(this.render_riskDice());
        }

        if (this.model.pool.length > 0) {
            components.push(this.render_poolDice());
        }

        components.push(this.render_summary());

        return components;
    }

    private render_poolDice(): JSONEncodable<APIMessageTopLevelComponent> {
        return RollResultView.render_diceContainer(this.model.pool, 0x0000ff);
    }

    private render_riskDice(): JSONEncodable<APIMessageTopLevelComponent> {
        return RollResultView.render_diceContainer(this.model.risk, 0xff0000);
    }

    private render_summary(): JSONEncodable<APIMessageTopLevelComponent> {
        const actorText = `<@${this.interaction.user.id}>`;
        const hitText = this.model.hits === 1 ? 'hit' : 'hits';
        const glitchText = RollResultView.glitchTextLookup[this.model.glitchSeverity];

        return new TextDisplayBuilder()
            .setContent(`${actorText} rolled ${this.model.hits} ${hitText}. ${glitchText}`);
    }

    private static render_diceContainer(values: number[], color: number): JSONEncodable<APIMessageTopLevelComponent> {
        return new ContainerBuilder()
            .setAccentColor(color)
            .addTextDisplayComponents(...RollResultView.render_diceValues(values));
    }

    private static *render_diceValues(values: number[]): Generator<TextDisplayBuilder> {
        yield new TextDisplayBuilder()
            .setContent(values.map(value => `:number_${value}:`).join(' '));
    }
}

export default RollResultView;
