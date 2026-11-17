<script>
	import { base } from '$app/paths';
	import Thumb from './Thumb.svelte';
	import Icon from './Icon.svelte';
	import { categoryBySlug, formatPlays, isNew } from '$lib/data.js';
	import { store } from '$lib/state.svelte.js';

	let { game, showCategory = true } = $props();
	const cat = $derived(categoryBySlug[game.category]);
	const saved = $derived(store.favorites.includes(game.slug));
</script>

<a class="card" href="{base}/play/{game.slug}/" style="--cat:{cat.color}">
	<div class="art">
		<Thumb {game} label={false} />
		{#if isNew(game)}<span class="badge new">New</span>{/if}
		{#if saved}<span class="badge saved"><Icon name="heart-filled" size={13} /> Saved</span>{/if}
	</div>
	<div class="body">
		<h3>{game.title}</h3>
		<p class="meta">
			{#if showCategory}<span class="cat">{cat.name}</span>{/if}
			{#if game.players === 2}<span>2 players</span>{/if}
			<span class="plays">{formatPlays(game.plays)} plays</span>
		</p>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--panel);
		border-radius: var(--radius);
		overflow: hidden;
		color: inherit;
		text-decoration: none;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.card:hover,
	.card:focus-visible {
		transform: translateY(-3px);
		box-shadow: 0 0 0 3px var(--yellow), 0 12px 24px rgba(0, 0, 0, 0.35);
		outline: none;
	}
	.art {
		position: relative;
		aspect-ratio: 16 / 10;
	}
	.badge {
		position: absolute;
		top: 8px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font: 700 0.875rem/1 var(--body);
		padding: 5px 9px;
		border-radius: 999px;
	}
	.new {
		left: 8px;
		background: var(--yellow);
		color: var(--on-yellow);
	}
	.saved {
		right: 8px;
		background: var(--bg);
		color: #fff;
	}
	.saved :global(svg) {
		color: var(--heart);
	}
	.body {
		padding: 12px 14px 14px;
	}
	h3 {
		font: 600 1.15rem/1.2 var(--display);
		margin: 0 0 5px;
	}
	.meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		font-size: 0.95rem;
		color: var(--text-soft);
	}
	.cat {
		color: var(--text);
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.cat::before {
		content: '';
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--cat);
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
