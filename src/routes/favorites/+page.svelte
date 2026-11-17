<script>
	import { base } from '$app/paths';
	import GameCard from '$lib/components/GameCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { gameBySlug } from '$lib/data.js';
	import { store, toast } from '$lib/state.svelte.js';

	const favs = $derived(store.favorites.map((s) => gameBySlug[s]).filter(Boolean));
</script>

<svelte:head><title>Favorites · Coolmath Games redesign</title></svelte:head>

<div class="wrap">
	<h1>Your favorites</h1>

	<div class="where">
		<span class="ico"><Icon name="device" size={26} /></span>
		<div>
			<p><b>Saved on this device.</b> You don't need an account to keep favorites here.</p>
			<p>Want them on your school and home computers? Make a free account and we'll move these over.</p>
		</div>
		<button class="btn" onclick={() => toast('Sign-up isn’t part of this prototype', { detail: 'In the real site this opens a short sign-up form. Your saved games would carry over.' })}>Make a free account</button>
	</div>

	{#if !store.ready}
		<p>Loading…</p>
	{:else if favs.length}
		<p class="count">{favs.length} saved {favs.length === 1 ? 'game' : 'games'}, newest first</p>
		<div class="game-grid">
			{#each favs as g (g.slug)}<GameCard game={g} />{/each}
		</div>
	{:else}
		<div class="empty">
			<p><b>Nothing saved yet.</b> On any game page, press <span class="pill"><Icon name="heart" size={16} /> Save to favorites</span> and it will show up here.</p>
			<a class="btn primary" href="{base}/">Find a game</a>
		</div>
	{/if}
</div>

<style>
	h1 {
		margin: 36px 0 16px;
		font-size: clamp(2rem, 4vw, 2.8rem);
	}
	.where {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		background: var(--panel);
		border-radius: var(--radius);
		padding: 16px 18px;
		margin-bottom: 26px;
	}
	.where div {
		flex: 1 1 300px;
	}
	.where p {
		margin: 2px 0;
		color: var(--text-soft);
	}
	.where b {
		color: var(--text);
	}
	.ico {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--yellow);
		color: var(--on-yellow);
		display: grid;
		place-items: center;
	}
	.count {
		color: var(--text-soft);
	}
	.empty {
		background: var(--panel);
		border: 1px dashed var(--line);
		border-radius: 16px;
		padding: 28px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: var(--raised);
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 1px 8px;
		font-weight: 700;
		white-space: nowrap;
	}
</style>
