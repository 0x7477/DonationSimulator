import { Statistics } from "./statistics";
import type { Charity } from "./charity";
import type { Parameter } from "./parameter";

export class Donator 
{
    private wealth: number;     //the amount of money in eur
    private risk: number;
    public empathy: number;
    private interests: number;
    public popularity: number; //the amount of people that know you
    public params: Parameter;

    public getWealth()
    {
        return this.wealth;
    }

    private randomPopularity()
    {
        var x = Math.random();
        return Math.max(0,-120 / (x-1)-200);
    }


    private randomWealth()
    {
        var x = Math.random();
        return 41.3* Math.exp(10*x) - 3800 -48400*x+360000*x*x;
    }

    private doesAdvertiseCharity(charity: Charity)
    {
        return this.getNormalizedInterestDifference(charity) < this.params.percent_of_people_advertising_after_donation;
    }


    private getInterestDifference(charity: Charity)
    {
        return Math.abs(this.interests - charity.topic);
    }

    private getNormalizedInterestDifference(charity: Charity)
    {
        return this.getInterestDifference(charity) / this.params.getMaximalInterestDistance();
    }

    private doesDonate(charity: Charity, has_been_informed: boolean = false)
    {
        if(this.wealth < 0) 
        {
            console.log("too poor to donate");
            return false; // too poor to donate
        }
        
        if(!has_been_informed && charity.popularity >= Math.random())
        {
            console.log("doesn't know the charity");
            return false; //doesn't know the charity
        }    

        if(this.getInterestDifference(charity) > this.params.getMaximalInterestDistance()) 
        {
            console.log("user is not interested in the charity");
            return false; //user is not interested in the charity
        }

        
        if(charity.uses_downline_distribution && this.risk < this.params.getMininmalRiskForApprovingDownlineDistribution())
        {
            console.log("charity is deemed too risky");
            return false;
        } 

        console.log("user donates");
        return true;
    }

    private calculatePotentialFinancialCompensation(charity: Charity, investment:number)
    {
        var charity_return = charity.getMonetaryPresentReturn(investment);

        console.log("user gets " + charity_return + " from presents");

        var downline_distribution_return = charity.getDownlineDistributionReturn(this,investment);

        console.log("user gets " + downline_distribution_return + " from downline distribution");
        
        return charity_return + downline_distribution_return;
    }

    private getTotalDonationAmount(charity: Charity)
    {
        var total_donations = this.wealth * Statistics.wealthDonationShare(this.wealth);

        console.log("user donates a total of " + total_donations + " every year");

        //now we know how much this person donates yearly
        //how much does this go to this charity?


        // var average_percent = 1/Statistics.average_num_of_charities_supported;

        //if the interest matches completely donate all
        //if the interest matches not too much donate a little
        var interest_percent = this.getNormalizedInterestDifference(charity);
        var donation_amount = total_donations * interest_percent;

        var potential_return = this.calculatePotentialFinancialCompensation(charity, donation_amount);

        var compensation_percent = potential_return / total_donations;

        //if we are compensated for 0% we don't give additional money
        //if we are compensated for 10% we just give 10% more

        var donation_percent = donation_amount + compensation_percent;

        //add a bonus if the charity gives emotional presents
        //nobody gives less when exposed to emotional return

        var emotional_bonus = charity.getMonetaryEmotionalBonus(this);

        var total_donation_percent = Math.max(0,donation_percent+emotional_bonus); //not less than 0%
        return total_donations * total_donation_percent;
    }

    public getAmountDonated(charity: Charity)
    {
        if(!this.doesDonate(charity)) return 0;

        //ok we donate but how much?
        var own_donation = this.getTotalDonationAmount(charity);

        if(!this.doesAdvertiseCharity(charity)) return own_donation;

        var external_donations = 0;
        //we are advertising to others our charity
        for(var i = 0; i < this.popularity; i++)
        {
            var friend = this.generateFriend();
            external_donations += friend.getAmountDonated(charity);
        }

        return own_donation + external_donations * (1 - charity.downline_distribution_share);
    }


    private addSimilarity(base : number, influence: number)
    {
        return (base + influence)/2;
    }

    public generateFriend()
    {
        var friend = new Donator(this.params);

        // we assume that friends are somewhat similar to ourselves
        friend.risk = this.addSimilarity(friend.risk, this.risk);
        friend.empathy = this.addSimilarity(friend.empathy, this.empathy);
        friend.wealth = this.addSimilarity(friend.wealth, this.wealth);
        friend.popularity = this.addSimilarity(friend.popularity, this.popularity);
        friend.interests = this.addSimilarity(friend.interests, this.interests);

        return friend;
    }

    public constructor(params : Parameter) 
    {
        this.params = params;
        this.risk = Statistics.gaussianRandom();
        this.empathy = Statistics.gaussianRandom();
        this.interests = Statistics.gaussianRandom();
        this.wealth = this.randomWealth();
        this.popularity = this.randomPopularity();
    }
}