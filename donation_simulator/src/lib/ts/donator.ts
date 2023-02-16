import { Statistics } from "./statistics.js";
import type { Charity } from "./charity.js";
import type { Parameter } from "./parameter.js";
import { DonatorDataPoint } from "./donator_info.js";

import donator_share_per_wealth from './data/donator_share_per_wealth.js';
import income_data from './data/income_data.js';
import percent_of_donators from './data/percent_of_donators.js';
import { FunctionEstimator } from "./function_estimator.js";

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

    public getRisk()
    {
        return this.risk;
    }

    public getEmpathy()
    {
        return this.empathy;
    }
    public getInteressts()
    {
        return this.interests;
    }
    public getPopularity()
    {
        return this.popularity;
    }
    public setWealth(wealth:number)
    {
        this.wealth = wealth;
    }

    public setPopularity(popularity:number)
    {
        this.popularity = popularity;
    }

    private randomPopularity()
    {
        return Donator.calculatePopularity(Math.random());
    }

    static calculatePopularity(x:number)
    {
        return Math.max(0,-120 / (x-1)-200);
    }


    private randomWealth()
    {
        let estimator = new FunctionEstimator(income_data);

        let x = Math.random();
        return estimator.getValue(x);
    }

    private doesAdvertiseCharity(charity: Charity)
    {
        var probability = (10*((1-this.getNormalizedInterestDifference(charity))-0.5)) * this.params.percent_of_people_advertising_after_donation;

        return Math.random() < probability;
    }


    private getInterestDifference(charity: Charity)
    {
        return Math.abs(this.interests - charity.topic);
    }

    private getNormalizedInterestDifference(charity: Charity)
    {
        return this.getInterestDifference(charity) / this.params.getMaximalInterestDistance();
    }

    private doesDonateAtAll()
    {
        
        let estimator = new FunctionEstimator(percent_of_donators);
        var x = Math.random();

        return x <= estimator.getValue(this.wealth);
    }


    private doesDonate(charity: Charity, has_been_informed: boolean = false)
    {
        if(this.wealth < 0) 
        {
            // // console.log("too poor to donate");
            return false; // too poor to donate
        }

        if(!this.doesDonateAtAll()) 
        {
            return false; // doesn't participate in donations at all
        }
        if(!has_been_informed && charity.popularity < Math.random())
        {
            // // console.log("doesn't know the charity");
            return false; //doesn't know the charity
        }    

        if(this.getInterestDifference(charity) > this.params.getMaximalInterestDistance()) 
        {
            // // console.log("user is not interested in the charity");
            return false; //user is not interested in the charity
        }

        
        if(charity.uses_downline_distribution && charity.downline_distribution_share > 0 && this.risk < this.params.getMininmalRiskForApprovingDownlineDistribution())
        {
            // // console.log("charity is deemed too risky");
            return false;
        } 

        // // console.log("user donates");
        return true;
    }

    private calculatePotentialFinancialCompensation(charity: Charity, investment:number)
    {
        var charity_return = charity.getMonetaryPresentReturn(investment);

        var downline_distribution_return = charity.getDownlineDistributionReturn(this,investment);
        
        return charity_return + downline_distribution_return;
    }

    private getTotalDonationAmount() 
    {
        let estimator = new FunctionEstimator(donator_share_per_wealth);

        let randomisator = Statistics.gaussianRandom(1,0.5);

        let total_share = this.empathy * randomisator * estimator.getValue(this.wealth) / 100;

        return this.wealth * Math.max(total_share, 0.01);
    }

    private getRiskReturnInfluence()
    {
        //very high risk individuals give up to 100% more
        //very low risk individuals give up to 100% less

        //3 is a very good guess for the highest x in a bell curve
        return this.risk / 3;
    }

    public getDonationAmount(charity: Charity)
    {
        var total_donations =  this.getTotalDonationAmount();
        //now we know how much this person donates yearly
        //how much does this go to this charity?

        //if the interest matches completely donate all
        //if the interest matches not too much donate a little
        var interest_percent = Math.max(0,1 - this.getNormalizedInterestDifference(charity)); //not less than 0
        var donation_amount = total_donations * interest_percent;

        var potential_return = this.calculatePotentialFinancialCompensation(charity, donation_amount);

        var compensation_percent = Math.min(1,potential_return / donation_amount); //not more than 100%
        if(isNaN(compensation_percent)) compensation_percent= 0;
        //if we are compensated for 0% we don't give additional money
        //if we are compensated for 10% we give depending on our risk value (normally we give nothing extra, with higher risk we give more, with less risk we give less)

        var additional_donation_percent = compensation_percent * this.getRiskReturnInfluence();

        //add a bonus if the charity gives emotional presents
        //nobody gives less when exposed to emotional return

        var emotional_bonus = charity.getMonetaryEmotionalBonus(this);

        var total_additional_donation_percent = additional_donation_percent+emotional_bonus; 
        var final_donation = donation_amount * (1 + total_additional_donation_percent);

        var charity_return = charity.getMonetaryPresentReturn(final_donation);

        return final_donation - charity_return;
    }

    public getDataPoints(charity:Charity,isFollower:boolean = false)
    {
        if(!this.doesDonate(charity)) return [];

        //ok we donate but how much?
        var own_donation = this.getDataPoint(charity);

        if(isFollower || !this.doesAdvertiseCharity(charity)) return [this.getDataPoint(charity)];

        var donation_data_points:DonatorDataPoint[] = [];// = [own_donation];
        //we are advertising to others our charity

        for(var i = 0; i < this.popularity * this.params.conversion_rate_estimate; i++)
        {
            var follower = this.generateFollower();
            var follower_data_point = follower.getDataPoint(charity);
            donation_data_points.push(follower_data_point);
        }

        for(var i = 0; i < this.params.average_number_of_friends_one_would_ask_to_donate; i++)
        {
            var friend = this.generateFriend();
            var friend_data_point = friend.getDataPoint(charity);
            donation_data_points.push(friend_data_point);
        }

        for(var i = 0; i < donation_data_points.length; i++)
            donation_data_points[i].data[5] *= (1 - charity.downline_distribution_share);
        

        donation_data_points.push(own_donation);

        return donation_data_points;
        
    }
    public getDataPoint(charity:Charity)
    {
        return new DonatorDataPoint([this.wealth,this.risk,this.empathy,this.interests,this.popularity,this.getDonationAmount(charity)]);
    }


    private addSimilarity(base : number, influence: number)
    {
        return (base + 3*influence)/4;
    }

    public generateFollower()
    {       
        var follower = new Donator(this.params);

        // we assume that follower are somewhat similar to ourselves
        follower.risk = this.addSimilarity(follower.risk, this.risk);
        follower.empathy = this.addSimilarity(follower.empathy, this.empathy);
        follower.interests = this.addSimilarity(follower.interests, this.interests);

        return follower;


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
        this.popularity = 1+this.randomPopularity();
        this.wealth = Math.max(this.popularity/10, this.randomWealth());
        this.risk = Statistics.gaussianRandom();
        this.empathy = Statistics.gaussianRandom();
        this.interests = Statistics.gaussianRandom();
    }
}