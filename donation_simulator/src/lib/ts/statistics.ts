import jStat from 'jstat';

export namespace Statistics
{
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