import income_data from "../data/income_data";
import { FunctionEstimator } from "../function_estimator";

export class DonatorIncomeEstimator
{
    private estimator:FunctionEstimator = new FunctionEstimator(income_data);

    public getY(x:number) 
    {
        return this.estimator.getValue(x);
    }
}