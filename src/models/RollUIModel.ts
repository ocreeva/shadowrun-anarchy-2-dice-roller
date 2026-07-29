export default class RollUIModel {
    public static readonly PoolPrefix: string = 'pool';
    public static readonly RiskPrefix: string = 'risk';
    public static readonly RollPrefix: string = 'roll';

    public static readonly MaxDicePool: number = 20;
    public static readonly MaxRiskReduction: number = 3;

    public dicePool: number = 1;
    public riskDice: number = 0;
    public riskReduction: number = 0;
    public hasAdvantage: boolean = false;
    public hasDisadvantage: boolean = false;
}
