<script>
	import { base } from '$app/paths';
	import GameCard from './GameCard.svelte';
	import { categories } from '$lib/data.js';

	let { title, description, list, current = null, color = '#FFE420' } = $props();

	let sort = $state('popular');
	let players = $state('any');
	let input = $state('any');
	let length = $state('any');

	const shown = $derived.by(() => {
		let l = list.filter(
			(g) =>
				(players === 'any' || String(g.players) === players) &&
				(input === 'any' || g.input === input || g.input === 'both') &&
				(length === 'any' || g.length === length)
		);
		if (sort === 'popular') l = [...l].sort((a, b) => b.plays - a.plays);
		if (sort === 'new') l = [...l].sort((a, b) => b.added.localeCompare(a.added));
		if (sort === 'az') l = [...l].sort((a, b) => a.title.localeCompare(b.title));
		return l;
	});
	const filtered = $derived(players !== 'any' || input !== 'any' || length !== 'any');
	function reset() {
		players = input = length = 'any';
	}
</script>

<div class="wrap">
	<nav class="crumbs" aria-label="Breadcrumb"><a href="{base}/">Home</a> <span aria-hidden="true">/</span> {title}</nav>

	<header class="head" style="--cat:{color}">
		<h1>{title}</h1>
		<p>{description}</p>
	</header>

	<nav class="switch" aria-label="Other categories">
		{#each categories as c}
			<a href="{base}/c/{c.slug}/" aria-current={current === c.slug ? 'page' : undefined} style="--cat:{c.color}">{c.name}</a>
		{/each}
		<a href="{base}/all/" aria-current={current === 'all' ? 'page' : undefined} style="--cat:#ffffff">All games</a>
	</nav>

	<div class="filters" role="group" aria-label="Filter and sort">
		<label>Players
			<select bind:value={players}><option value="any">Any</option><option value="1">1 player</option><option value="2">2 players</option></select>
		</label>
		<label>Controls
			<select bind:value={input}><option value="any">Any</option><option value="keyboard">Keyboard</option><option value="mouse">Mouse only</option></select>
		</label>
		<label>Length
			<select bind:value={length}><option value="any">Any</option><option value="quick">Quick (under 5 min)</option><option value="long">Longer</option></select>
		</label>
		<label>Sort by
			<select bind:value={sort}><option value="popular">Most played</option><option value="new">Newest</option><option value="az">A to Z</option></select>
		</label>
		<p class="count" aria-live="polite">Showing {shown.length} of {list.length} games</p>
	</div>

	{#if shown.length}
		<div class="game-grid">
			{#each shown as g (g.slug)}
				<GameCard game={g} showCategory={current === 'all' || !current} />
			{/each}
		</div>
	{:else}
		<div class="empty">
			<p><b>No games match these filters.</b> Try fewer filters to see more games.</p>
			<button class="btn" onclick={reset}>Clear filters</button>
		</div>
	{/if}
	{#if filtered && shown.length}
		<p><button class="linkish" onclick={reset}>Clear filters</button></p>
	{/if}
</div>

<style>
	.crumbs {
		margin: 24px 0 10px;
		font-size: 0.95rem;
		color: var(--text-soft);
	}
	.head {
		background: linear-gradient(110deg, color-mix(in srgb, var(--cat) 26%, var(--panel)) 0%, var(--panel) 70%);
		border-left: 8px solid var(--cat);
		border-radius: 16px;
		padding: 20px 24px;
	}
	h1 {
		font-size: clamp(2rem, 4vw, 2.8rem);
		margin: 0;
	}
	.head p {
		margin: 4px 0 0;
		font-size: 1.15rem;
		color: var(--text-soft);
	}
	.switch {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 18px 0;
	}
	.switch a {
		padding: 8px 14px;
		border-radius: 10px;
		background: var(--bar);
		border: 1px solid var(--line);
		color: var(--text);
		text-decoration: none;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.switch a:hover {
		background: var(--raised);
	}
	.switch a::before {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--cat);
	}
	.switch a[aria-current='page'] {
		background: var(--yellow);
		border-color: var(--yellow);
		color: var(--on-yellow);
	}
	.switch a[aria-current='page']::before {
		background: var(--on-yellow);
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		gap: 12px 16px;
		background: var(--bar);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 12px 16px;
		margin-bottom: 22px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-weight: 700;
		font-size: 0.9rem;
	}
	select {
		font: inherit;
		font-weight: 400;
		font-size: 1rem;
		padding: 7px 10px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--panel);
		color: var(--text);
		min-height: 42px;
	}
	.count {
		margin: 0 0 10px auto;
		color: var(--text-soft);
	}
	.empty {
		background: var(--panel);
		border: 1px dashed var(--line);
		border-radius: var(--radius);
		padding: 24px;
	}
	.linkish {
		background: none;
		border: 0;
		color: var(--blue);
		text-decoration: underline;
		font: inherit;
		cursor: pointer;
	}
	@media (max-width: 620px) {
		label {
			flex: 1 1 40%;
		}
		.count {
			margin-left: 0;
		}
	}
</style>
