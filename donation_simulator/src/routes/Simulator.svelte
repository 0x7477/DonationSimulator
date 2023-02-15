<script lang="ts">
	import GlobalParameter from './GlobalParameter.svelte';
	import CharityParameter from './CharityParameter.svelte';

    import { Charity } from '$lib/ts/charity';
	import { Parameter } from '$lib/ts/parameter';
	import { Donator } from '$lib/ts/donator';
	import type { DonatorDataPoint } from '$lib/ts/donator_info';
	import ScatterPlot from './ScatterPlot.svelte';

	import { Tabs, TabItem } from 'flowbite-svelte';

	let params = new Parameter();

	let charities:Charity[] = [];
	let data:DonatorDataPoint[][] = [];
	let amount_of_charities:number = 0;

	let x_index:number;

	addCharity();

	function removeCharity()
	{
		charities.pop();
		amount_of_charities-=1;
		charities = charities;
	}

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
			charities[c].total_donations = 0;

			for(var i = 0; i < params.number_of_simulations; i++)
			{
				let donator = new Donator(params);
				var dp = donator.getDataPoint(charities[c]);
				if(dp.data[5] == 0) continue;

				charities[c].total_donations += dp.data[5];
				data[c].push(dp);

				// if(dp.data[0] < dp.data[5])
				// 	console.log(donator,dp.data[5]);
			}

			console.log(charities[c].name, charities[c].total_donations,charities[c].total_donations / params.number_of_simulations);
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
			<div id="charity_params">
				{#if amount_of_charities > 0}
				<Tabs>
					{#each charities as c,i}
					<TabItem title={c.name} open={i==0}>
						<CharityParameter bind:params={params} bind:charity={c}/>
					</TabItem>
					{/each}		
				</Tabs>
				{/if}
			</div>
		</div>
	</div>
	<hr>

	<div id="control">
		<input type="button" on:click={simulate} value="simulate">
		<input type="button" on:click={addCharity} value="add charity">
		<input type="button" on:click={removeCharity} value="remove charity">

	</div>
	<div id="plot">

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

	<ScatterPlot {x_index} data={data[shown_charity]}/>
	</div>
</div>

<style>
	#ParameterContainer
	{
		display: flex;
		flex-wrap: wrap;
	}

	#ParameterContainer div
	{
		flex:1;
		min-width: 600px;
		margin: 1em;
	}

	#control
	{
		margin: 1em;
	}

	#plot
	{
		margin: 0 1em 0 1em;
	}


</style>