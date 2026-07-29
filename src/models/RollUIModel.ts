export default class RollUIModel {
    public static readonly PoolPrefix: string = 'pool';
    public static readonly RollPrefix: string = 'roll';

    public dicePool: number = 1;
    public riskDice: number = 0;
    public riskReduction: number = 0;
    public hasAdvantage: boolean = false;
    public hasDisadvantage: boolean = false;
}
