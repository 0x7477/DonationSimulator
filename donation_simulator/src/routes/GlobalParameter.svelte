<script lang="ts">
	import type { Parameter } from '$lib/ts/parameter';
    import PercentSlider from './PercentSlider.svelte';
    
	export let params:Parameter;
</script>

<div>
	<h1>GlobalParameter</h1>

    <PercentSlider
    label_text="Percent of interesting charities to each person"
    bind:param={params.percent_of_interesting_charities}
    on_change={() => params.calcMaxInterestDistance()}
    />

    <PercentSlider
    label_text="Percent of people disliking downline distribution"
    bind:param={params.percent_of_people_not_liking_downline}
    on_change={() => params.calcMininmalRiskForApprovingDownlineDistribution()}
    />


    <PercentSlider
    label_text="Percent of people to promote a charity after they donated"
    bind:param={params.percent_of_people_advertising_after_donation}
    />

    <PercentSlider
    label_text="Percent of follower each person can recruit"
    bind:param={params.conversion_rate_estimate}
    />

    <div class="setting">
        <label for="slider">Amount of friends each person has on average: {params.average_number_of_friends_one_would_ask_to_donate}</label>
        <input
            type="range"
            min={0}
            max={50}
            step={1}
            id="slider"
            bind:value={params.average_number_of_friends_one_would_ask_to_donate}
        />
    </div>


    <div class="setting">
        <label for="slider">Amount of simulations: {params.number_of_simulations}</label>
        <input
            type="range"
            min={100}
            max={100000}
            step={1}
            id="slider"
            bind:value={params.number_of_simulations}
        />
    </div>



</div>



<style>
	.setting {
		display: flex;
		flex-direction: column;
	}
</style>
