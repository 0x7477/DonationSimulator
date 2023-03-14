<script lang="ts">
	import { Scatter } from 'svelte-chartjs';
	import type { DonatorDataPoint } from '$lib/ts/donator_info';
	import type { Charity } from '$lib/ts/charity';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		CategoryScale,
		LinearScale,
		PointElement
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

	export let charities: Charity[];

	export let x_index: number;
	export let data_points: DonatorDataPoint[][];

	let colors = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

	$: x_index, data_points, setData();
	
	function setData() 
	{
		data.datasets = [];
		for (var c = 0; c < data_points.length; c++) {
			data.datasets.push({
				borderColor: colors[c % colors.length],
				backgroundColor: colors[c % colors.length],
				label: charities[c].name,
				data: [{}]
			});

			for (var i = 0; i < data_points[c].length; i++) {
				var dp = { x: data_points[c][i].data[x_index], y: data_points[c][i].data[5] };
				data.datasets[c].data.push(dp);
			}
		}
	}

	let descriptions = ["wealth", "risk", "empathy", "interests", "popularity"];
	$: options = {
		responsive: true ,
  scales: {
    y: {
		title: {
			text: "amount donated",
			display: true
		}
  },
  x: {
		title: {
			text: descriptions[x_index],
			display: true
		}
  }    
}}

	$: data = {
		labels: ['Scatter'],
		datasets: [{}]
	};
</script>

<Scatter {data} {options} />
