import percent_of_donators from "../data/percent_of_donators";
import { FunctionEstimator } from "../function_estimator";

export class DonatorDoesDonateEstimator
{
    private estimator:FunctionEstimator = new FunctionEstimator(percent_of_donators);

    public getY(x:number) 
    {
        return this.estimator.getValue(x);
    }
}