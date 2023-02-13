<script lang="ts">
	// import { draw } from 'svelte/transition';
	
	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import { line, curveBasis } from 'd3-shape';

    import data from '$lib/ts/bell_curve_data';

    export let percent: [number, number] = [0.4,0.6];


    var x_min:number = 0;
    var x_max:number = 100;


    var y_min:number = 0;
    var y_max:number = 15;

	const xScale = scaleLinear()
		.domain(extent(data.map(d => d.x)))
		.range([x_min, x_max]);
	
	const yScale = scaleLinear()
		.domain(extent(data.map(d => -d.y)))
		.range([y_min, y_max]);
	
	// the path generator
	const pathLine = line()
		.x(d => xScale(d.x))
		.y(d => yScale(-d.y))
		.curve(curveBasis);

    let center_line = [{x:0   ,y:0.39894228},{x:0   ,y:0}]
        
    $: left = pathLine([{x:6*(percent[0]-0.5)   ,y:1},{x:6*(percent[0]-0.5)   ,y:0}])
    $: right = pathLine([{x:6*(percent[1]-0.5)   ,y:1},{x:6*(percent[1]-0.5)   ,y:0}])
</script>

<svg viewBox="0 -1 100 17">
    <path stroke="purple" d={pathLine(data)} />
    <path stroke="purple" d={pathLine(center_line)} />
    <path stroke="green" d={left} />
    <path stroke="green" d={right} />

</svg>

<style>
	path {
		/* stroke: purple; */
		stroke-width: 0.2;
		fill: none;
		stroke-linecap: round;
	}

    svg {
        margin-left: 2px;
        margin-right: 2px;
    }


</style>