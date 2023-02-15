<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';

	export let label_text: string = "";
	export let param:number;
	export let on_change:() => void = () => {};
	export let hide_percent:boolean = false;

	export let min:number = 0 
	export let max:number = 1 
	let res:[number] = [param];
</script>


<div class="setting">
	{#if label_text!=""}
	{#if !hide_percent}
	<label for="slider">{label_text}: {(param*100).toPrecision(3)}%</label>
	{:else}
	<label for="slider">{label_text}</label>
	{/if}
	{/if}

	<slot></slot>
	<input
		type="range"
		{min}
		{max}
		step={0.001}
		id="slider"
		bind:value={param}
		on:change={on_change}
	/>
</div>

<style>
	.setting {
		display: flex;
		flex-direction: column;
	}
</style>
