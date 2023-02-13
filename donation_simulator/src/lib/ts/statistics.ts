import jStat from 'jstat';

export namespace Statistics
{
    // export const total_private_wealth_germany = 7475000000000;
    // export const total_population_germany = 84488206;
    // export const average_num_of_charities_supported = 4.5;


    export function wealthDonationShare(wealth:number) 
    {
        var x = Math.log10(wealth);
        var share = (2.4 * (x - 5.9)*(x - 5.9) +3.9 + 0.0725*x)/100;
        return Math.min(share,10);
    }

    export function gaussianRandom(mean=0, stdev=1) 
    {
        return jStat.normal.sample(mean,stdev);
    }

    export function invCdfNormal (x:number, mean:number = 0, standard_deviation:number = 1) 
    {
        return jStat.normal.inv(x,mean,standard_deviation);
    }

    export function cdfNormal (x:number, mean:number = 0, standard_deviation:number = 1) 
    {
        return jStat.normal.cdf(x,mean,standard_deviation);
    }
};