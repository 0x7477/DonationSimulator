<script lang="ts">
	import GlobalParameter from './GlobalParameter.svelte';
	import CharityParameter from './CharityParameter.svelte';

	import { Charity } from '$lib/ts/charity';
	import { Parameter } from '$lib/ts/parameter';
	import { Donator } from '$lib/ts/donator';
	import type { DonatorDataPoint } from '$lib/ts/donator_info';
	import ScatterPlot from './ScatterPlot.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';

	import { Doughnut } from 'svelte-chartjs';

	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let charity_funding_graph_data = {
		labels: [''],
		datasets: [
			{
				data: [0],
				backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
				hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774']
			},
			{
				data: [0],
				backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
				hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774']
			}
		]
	};

	let params = new Parameter();

	let charities: Charity[] = [];
	let charity_funding_data: DonatorDataPoint[][] = [];
	let amount_of_charities: number = 0;

	let x_index: number;

	addCharity();

	function removeCharity() {
		charities.pop();
		amount_of_charities -= 1;
		charities = charities;
	}

	function addCharity() {
		charities.push(
			new Charity('Charity ' + (charities.length + 1), 0.5, 0, false, false, 0, 0, 0, 0.5)
		);
		charities = charities;
		amount_of_charities += 1;
	}

	function simulate() {
		charity_funding_data = [];
		charity_funding_graph_data.datasets[0].data = [];
		charity_funding_graph_data.datasets[1].data = [];
		charity_funding_graph_data.labels = [];

		for (var c = 0; c < charities.length; c++) {
			charity_funding_data.push([]);
			charity_funding_graph_data.datasets[0].data.push(0);
			charity_funding_graph_data.datasets[1].data.push(0);
			charity_funding_graph_data.labels.push(charities[c].name);

			for (var i = 0; i < params.number_of_simulations; i++) {
				let donator = new Donator(params);
				var dp = donator.getDataPoints(charities[c]);
				if (dp.length == 0) continue;

				for (var j = 0; j < dp.length; j++) {
					charity_funding_graph_data.datasets[0].data[c] += dp[j].data[5];
					charity_funding_graph_data.datasets[1].data[c] += Math.sign(dp[j].data[5])*Math.sqrt(Math.abs(dp[j].data[5]));
				}

				charity_funding_data[c] = charity_funding_data[c].concat(dp);
			}

			charity_funding_graph_data.datasets[1].data[c] *=
				charity_funding_graph_data.datasets[1].data[c];
		}
		charity_funding_graph_data = charity_funding_graph_data;
		charity_funding_data = charity_funding_data;
	}
</script>

<div id="Simulator">
	<div id="ParameterContainer">
		<div>
			<GlobalParameter bind:params />
		</div>
		<div>
			<h1>CharityParameter</h1>
			<div id="charity_params">
				{#if amount_of_charities > 0}
					<Tabs>
						{#each charities as c, i}
							<TabItem title={c.name} open={i == 0}>
								<CharityParameter bind:params bind:charity={c} />
							</TabItem>
						{/each}
					</Tabs>
				{/if}
			</div>
		</div>
	</div>
	<hr />

	<div id="control">
		<input type="button" on:click={simulate} value="simulate" />
		<input type="button" on:click={addCharity} value="add charity" />
		<input type="button" on:click={removeCharity} value="remove charity" />
	</div>
	<hr />

	{#if charity_funding_graph_data.labels[0] != ''}
		<div id="plot">
			<select id="title" name="title" bind:value={x_index}>
				<option value="0" selected>wealth</option>
				<option value="1">risk</option>
				<option value="2">empathy</option>
				<option value="3">interests</option>
				<option value="4">popularity</option>
			</select>

			<ScatterPlot {x_index} data_points={charity_funding_data} {charities} />
		</div>

		<div id="funding_plots">
			<div>
				<h3>Donation Plot</h3>
				<br />
				<span><bold>Outer Circle:</bold> Donation Share</span><br />
				<span><bold>Inner Circle:</bold> Donation Share after Quadratic Funding</span><br />
			</div>
			<Doughnut data={charity_funding_graph_data} options={{ responsive: true }} />
		</div>
	{/if}
</div>

<style>
	#ParameterContainer {
		display: flex;
		flex-wrap: wrap;
	}

	#ParameterContainer div {
		flex: 1;
		min-width: 600px;
		margin: 1em;
	}

	#control {
		margin: 1em;
	}

	#plot {
		margin: 0 1em 0 1em;
	}

	#funding_plots {
		height: 300px;
		display: flex;
		justify-content: center;
	}
</style>
