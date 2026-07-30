import GlitchSeverity from './GlitchSeverity';
import RollModel from './RollModel';

class RollResultModel {
    public static generate(roll: RollModel): RollResultModel {
        const { dicePool, riskDice } = roll;
        return new RollResultModel(
            roll,
            RollResultModel.generate_diceResults(dicePool - riskDice).toArray(),
            RollResultModel.generate_diceResults(riskDice).toArray(),
        );
    }

    private static *generate_diceResults(count: number): Generator<number> {
        for (let index = 0; index < count; index++) {
            yield Math.floor(1 + Math.random() * 6);
        }
    }

    private constructor(
        private readonly roll: RollModel,
        public readonly pool: number[],
        public readonly risk: number[],
    ) { }

    get hits(): number {
        const hitThreshold = this.roll.hitThreshold;
        const hitCheck = (value: number) => value >= hitThreshold;
        const riskHits = this.risk.filter(hitCheck).length;
        const poolHits = this.pool.filter(hitCheck).length;
        return 2 * riskHits + poolHits;
    }

    public get glitches(): number {
        return Math.max(0, this.risk.filter((value) => value === 1).length - this.roll.riskReduction);
    }

    public get glitchSeverity(): GlitchSeverity {
        return Math.min(GlitchSeverity.Disaster, this.glitches);
    }
}

export default RollResultModel;
