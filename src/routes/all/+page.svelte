<script>
	import Browser from '$lib/components/Browser.svelte';
	import { games } from '$lib/data.js';
</script>

<svelte:head><title>All games · Coolmath Games redesign</title></svelte:head>

<Browser title="All games" description="Every game on the site. Use the filters to narrow it down." list={games} current="all" />
