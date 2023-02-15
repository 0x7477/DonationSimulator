import donator_share_per_wealth from "../data/donator_share_per_wealth";
import { FunctionEstimator } from "../function_estimator";

export class DonatorShareEstimator
{
    private estimator:FunctionEstimator = new FunctionEstimator(donator_share_per_wealth);

    public getY(x:number) 
    {
        return this.estimator.getValue(x);
    }
}