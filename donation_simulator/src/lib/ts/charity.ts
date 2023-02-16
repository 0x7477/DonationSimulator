import type { Donator } from "./donator.js";
import { Statistics } from "./statistics.js";
export class Charity
{
    public constructor(
    public name: string,
    public popularity: number,
    public topic: number,

    public uses_downline_distribution: boolean,
    public uses_monetary_presents: boolean,

    public downline_distribution_share: number,
    public monetary_present_amount: number,
    public monetary_present_percent: number,
    public emotional_quality: number){}

    public getMonetaryPresentReturn(investment:number)
    {
        if(!this.uses_monetary_presents) return 0;
        return this.monetary_present_amount + this.monetary_present_percent * investment;
    }

    public getDownlineDistributionReturn(donator:Donator, investment:number)
    {
        if(!this.uses_downline_distribution) return 0;
   
        //we assume that friends are on average equally rich and therefore donate the same amount
        var average_return_per_person = investment * donator.params.conversion_rate_estimate;

        return donator.popularity * average_return_per_person * this.downline_distribution_share;
    }

    public getMonetaryEmotionalBonus(donator:Donator)
    {
        return this.emotional_quality * donator.empathy / 3;        
    }
};

