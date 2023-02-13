<script>
	import GlobalParameter from './GlobalParameter.svelte';
	import CharityParameter from './CharityParameter.svelte';

    import { Charity } from '$lib/ts/charity';
	import { Parameter } from '$lib/ts/parameter';
	import { Donator } from '$lib/ts/donator';

	let params = new Parameter();

    let charity = new Charity("Charity",0.5,0,false,false,false,0,0,0,0);

	function simulate()
	{
		let donator = new Donator(params);
		console.log(donator, donator.getAmountDonated(charity));
	}
</script>

<div id="Simulator">
	<GlobalParameter bind:params={params}/>
	<CharityParameter bind:params={params} bind:charity={charity}/>

	<input type="button" on:click={simulate}>
</div>
