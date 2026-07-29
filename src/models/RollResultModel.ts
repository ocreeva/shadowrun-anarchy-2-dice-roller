import GlitchSeverity from './GlitchSeverity';
import RollModel from './RollModel';

class RollResultModel {
    constructor(private readonly roll: RollModel) { }

    public pool: number[] = [];
    public risk: number[] = [];

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
