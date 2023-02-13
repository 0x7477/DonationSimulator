<script lang="ts">
	import type { Parameter } from '$lib/ts/parameter';
    import PercentSlider from './PercentSlider.svelte';
    
	export let params:Parameter;
</script>

<div>
	<h2>GlobalParameter</h2>

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
    label_text="Percent of friends each person can recruit"
    bind:param={params.conversion_rate_estimate}
    />


	<!-- {(console.log(params), '')} -->
</div>