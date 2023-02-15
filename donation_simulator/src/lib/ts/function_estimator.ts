export class FunctionEstimator
{
    public constructor
    (
        private datapoints:{x:number,y:number}[]
    ){}

    private getLeftXIndex(x:number)
    {
        var index = 0;
        while(index < this.datapoints.length-1 && x > this.datapoints[index+1].x)
            index++;
         
        return index;
    }

    private getRightXIndex(index:number)
    {
        return Math.min(this.datapoints.length-1, index+1);
    }


    private map(x:number, x_min:number, x_max:number, y_min:number, y_max:number) 
    {
        return (x - x_min) * (y_max - y_min) / (x_max - x_min) + y_min;
    }

    public getValue(x:number)
    {
        var l_index = this.getLeftXIndex(x);
        var r_index = this.getRightXIndex(l_index);

        var l_x = this.datapoints[l_index].x;
        var l_y = this.datapoints[l_index].y;

        if(x < this.datapoints[0].x) return l_y;

        var r_x = this.datapoints[r_index].x;
        var r_y = this.datapoints[r_index].y;

        if(r_x < x) return r_y;
        return this.map(x,l_x,r_x,l_y,r_y);
    }
}