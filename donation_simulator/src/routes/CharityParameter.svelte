<script lang="ts">
	import type { Charity } from '$lib/ts/charity';
	import type { Parameter } from '$lib/ts/parameter';
    import PercentSlider from './PercentSlider.svelte';
    import CheckboxSlider from './CheckboxSlider.svelte';

    import BellCurve from './BellCurve.svelte';
    import { Statistics } from '$lib/ts/statistics';

	export let charity:Charity;
	export let params:Parameter;

    let topic_0_to_1: number = 0.5;

    $: max_distance = params.calcMaxInterestDistance(params.percent_of_interesting_charities)

    $: bell_min =  topic_0_to_1 - (max_distance)/6
    $: bell_max =  topic_0_to_1 + (max_distance)/6
    $: bell_percent = Statistics.cdfNormal(6*topic_0_to_1-3 + max_distance) -Statistics.cdfNormal(6*topic_0_to_1-3 - max_distance)

    $: charity.topic = 6*(topic_0_to_1-0.5);

    $: if(!charity.uses_downline_distribution) charity.downline_distribution_share = 0;
    $: if(!charity.uses_monetary_presents) {charity.monetary_present_amount = 0;charity.monetary_present_percent = 0;}

</script>

<div>
    <input type="text" bind:value={charity.name}>
    <PercentSlider
    label_text="How many percent of people do know this charity"
    bind:param={charity.popularity}
    />

    <PercentSlider
    label_text="How niche is this charity: {(100*bell_percent).toPrecision(3)}%"
    hide_percent
    bind:param={topic_0_to_1}
    ><BellCurve percent={[bell_min,bell_max]}/>
    </PercentSlider>

    <PercentSlider
    label_text="How big is the emotional presence of this charity"
    bind:param={charity.emotional_quality}
    />
    <CheckboxSlider bind:bool={charity.uses_downline_distribution} bind:param={charity.downline_distribution_share} label_text={"Downline Distribution"}/>
    
    <div>
        {#if charity.uses_monetary_presents}
        <label for="slider">Monetary Presents: {charity.monetary_present_amount}€ + {(100*charity.monetary_present_percent).toPrecision(3)}%</label>
        {:else}
        <label for="slider">Monetary Presents:</label>
        {/if}
        <input type="checkbox" bind:checked={charity.uses_monetary_presents}/>
        {#if charity.uses_monetary_presents}
        <br>
        <input style="width:calc(100% - 4px)" type="range" min={0} max={50} step={0.1} id="slider" bind:value={charity.monetary_present_amount}/>
        <PercentSlider hide_percent bind:param={charity.monetary_present_percent}/>  
        {/if}  
    </div>
</div>