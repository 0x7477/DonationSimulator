<script lang="ts">
	import Axis from './Axis.svelte';

	import { spring } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import type { DonatorDataPoint } from '$lib/ts/donator_info';

	// utility function for translating elements
	const move = (x:number, y:number) => `transform: translate(${x}px, ${y}px`;

	export let data:DonatorDataPoint[] = [];
	export let x_index:number = 0;
	export let margin = {
		// typical d3 margin convention
		top: 40,
		right: 20,
		bottom: 20,
		left: 20
	};

	let width = 300;
	let height = 400;
	$: mainWidth = width - margin.right - margin.left;
	$: mainHeight = height - margin.top - margin.bottom;

	// make me some scales!

	$: xScale = scaleLinear()
    .domain(extent(data, (d) => d.data[x_index]))
    .range([0, mainWidth]);
  $: yScale = scaleLinear()
    .domain(extent(data, (d) => d.data[5]))
    .range([mainHeight, 0]);
</script>

<figure class="c" bind:clientWidth={width}>
	<svg {width} {height}>
		<g style={move(margin.top, margin.left)}>
			<Axis {mainHeight} {margin} scale={yScale} position="left" />
			{#each data as d}
			<circle style={move(xScale(d.data[x_index]), yScale((d.data[5])))} r={3} fill={"tomato"} />
			{/each}
			<Axis {mainHeight} {margin} scale={xScale} position="bottom" />
		</g>
	</svg>
</figure>