<script lang="ts">
	import GlobalParameter from './GlobalParameter.svelte';
	import CharityParameter from './CharityParameter.svelte';

    import { Charity } from '$lib/ts/charity';
	import { Parameter } from '$lib/ts/parameter';
	import { Donator } from '$lib/ts/donator';
	import type { DonatorDataPoint } from '$lib/ts/donator_info';

	import { DonatorShareEstimator } from '$lib/ts/estimators/donator_share_estimator';
	import { DonatorDoesDonateEstimator } from '$lib/ts/estimators/donator_does_donate_estimator';
	import { DonatorIncomeEstimator } from '$lib/ts/estimators/income_estimator';
	import ScatterPlot from './ScatterPlot.svelte';

	// import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

	import { Tabs, TabItem } from 'flowbite-svelte';

	let params = new Parameter();
    // let charity = new Charity("Charity 1",0.5,0,false,false,false,0,0,0,0);
    // let charity2 = new Charity("Charity 2",0.5,0,false,false,false,0,0,0,0);

	let charities:Charity[] = [];
	let data:DonatorDataPoint[][] = [];
	let amount_of_charities:number = 0;

	let x_index:number;

	addCharity();

	function addCharity()
	{
		charities.push(new Charity("Charity " + (charities.length+1),0.5,0,false,false,false,0,0,0,0));
		charities = charities;
		amount_of_charities+=1;
	}

	function simulate()
	{
		data = [];
		for(var c = 0; c < charities.length; c++)
		{
			data.push([]);
			for(var i = 0; i < 100; i++)
			{
				let donator = new Donator(params);
				var dp = donator.getDataPoint(charities[c]);
				if(dp.data[5] == 0) continue;
				data[c].push(dp);

				if(dp.data[0] < dp.data[5])
					console.log(donator,dp.data[5]);
			}
		}

		data= data;
	}

	let shown_charity = 0;
</script>

<div id="Simulator">
	<div id ="ParameterContainer">
		<div>
			<GlobalParameter bind:params={params}/>
		</div>
		<div>
			<h1>CharityParameter</h1>
			<Tabs style="pill">
				{#each charities as c}
				<TabItem title={c.name}>
					<CharityParameter bind:params={params} bind:charity={c}/>
				</TabItem>
				  					{/each}
				
<!-- 
				{#each charities as c}
				{/each} -->
								<!-- {#each charities as c}
					<Tabs.Tab label={c.name}>
					</Tabs.Tab>
				{/each} -->
<!-- 
				{#each Array(amount_of_charities) as _, i}
					<Tabs.Tab label="a">a</Tabs.Tab>
				{/each} -->

			</Tabs>
		</div>
	</div>
	<hr>

	<input type="button" on:click={simulate} value="simulate">
	<input type="button" on:click={addCharity} value="add charity">

	<select bind:value={shown_charity}>
		{#each charities as c,i}
			<option value={i}>{c.name}</option>
		{/each}
	</select>

	<select id="title" name="title" bind:value={x_index}>
		<option value="0" selected>wealth</option>
		<option value="1">risk</option>
		<option value="2">empathy</option>
		<option value="3">interests</option>
		<option value="4">popularity</option>
	</select>

	<!-- <ScatterPlot {x_index} data={data[shown_charity]}/> -->
</div>

<style>
	#ParameterContainer
	{
		display: flex;
		flex-wrap: wrap;
	}

	#ParameterContainer *
	{
		flex:1;
		min-width: 600px;
	}

</style>