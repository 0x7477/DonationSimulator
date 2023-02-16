<script lang="ts">
	import PercentSlider from "./PercentSlider.svelte";

	export let label_text:string = "";
	export let param:number;
	export let bool:boolean;
</script>

<label for="slider">{label_text}: {(100*param).toPrecision(3)}%</label>
<input type="checkbox" bind:checked={bool}/><br>
{#if bool}
<PercentSlider hide_percent bind:param={param}/>
{/if}