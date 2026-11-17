<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import GameCard from '$lib/components/GameCard.svelte';
	import { categories, search } from '$lib/data.js';

	const q = $derived(browser ? (page.url.searchParams.get('q') ?? '') : '');
	const results = $derived(search(q));
</script>

<svelte:head><title>Search: {q} · Coolmath Games redesign</title></svelte:head>

<div class="wrap">
	<h1>{results.length} {results.length === 1 ? 'game matches' : 'games match'} “{q}”</h1>
	{#if results.length}
		<div class="game-grid">
			{#each results as g (g.slug)}<GameCard game={g} />{/each}
		</div>
	{:else}
		<p>Check the spelling, or browse a category instead:</p>
		<ul>
			{#each categories as c}<li><a href="{base}/c/{c.slug}/">{c.name}</a>: {c.blurb}</li>{/each}
		</ul>
	{/if}
</div>

<style>
	h1 {
		margin: 32px 0 18px;
		font-size: 2rem;
	}
	li {
		margin: 6px 0;
	}
</style>
