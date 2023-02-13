import { Statistics } from "./statistics";
export class Parameter
{
    private min_risk_for_approving_downline_distribution:number = 0;
    private max_interest_distance:number = 0;

    public getMininmalRiskForApprovingDownlineDistribution()
    {
        return this.min_risk_for_approving_downline_distribution;
    }

    public getMaximalInterestDistance()
    {
        return this.max_interest_distance;
    }

    public calcMininmalRiskForApprovingDownlineDistribution()
    {
        this.min_risk_for_approving_downline_distribution = Statistics.invCdfNormal(this.percent_of_people_not_liking_downline);
    }

    public calcMaxInterestDistance(percent_of_interesting_charities:number = this.percent_of_interesting_charities)
    {
        return Statistics.invCdfNormal((1+percent_of_interesting_charities) / 2);
    }

    public constructor(
    public percent_of_people_not_liking_downline : number = 0.5,
    public percent_of_interesting_charities : number = 0.7,
    public percent_of_people_advertising_after_donation : number = 0.02,
    public conversion_rate_estimate:number = 0.05
    )
    {
        this.calcMininmalRiskForApprovingDownlineDistribution();
        this.max_interest_distance = this.calcMaxInterestDistance();
    }
};
