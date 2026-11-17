<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import Thumb from './Thumb.svelte';
	import { categories, categoryBySlug, gamesIn, games, search } from '$lib/data.js';
	import { store, toast } from '$lib/state.svelte.js';

	let menuOpen = $state(false);
	let q = $state('');
	let focused = $state(false);
	let active = $state(-1);
	const results = $derived(search(q).slice(0, 5));
	const showResults = $derived(focused && q.trim().length > 0);

	function surprise() {
		const current = page.params.slug;
		const pool = games.filter((g) => g.slug !== current);
		const g = pool[Math.floor(Math.random() * pool.length)];
		toast(`Surprise! Opening ${g.title} (${categoryBySlug[g.category].name})`);
		goto(`${base}/play/${g.slug}/`);
	}

	function onKey(e) {
		if (!showResults) return;
		if (e.key === 'ArrowDown') {
			active = Math.min(active + 1, results.length - 1);
			e.preventDefault();
		} else if (e.key === 'ArrowUp') {
			active = Math.max(active - 1, -1);
			e.preventDefault();
		} else if (e.key === 'Escape') {
			focused = false;
		}
	}

	function submit(e) {
		e.preventDefault();
		const pick = results[active];
		focused = false;
		if (pick) goto(`${base}/play/${pick.slug}/`);
		else if (q.trim()) goto(`${base}/search/?q=${encodeURIComponent(q.trim())}`);
		active = -1;
	}

	function pickResult() {
		focused = false;
		q = '';
	}

	// close menus on navigation
	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<header>
	<div class="bar wrap">
		<a class="logo" href="{base}/" aria-label="Coolmath Games redesign, home">
			<svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#FFE420" /><path d="M16 40 L28 24 L36 34 L48 18" stroke="#060D19" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>
			<span class="word">coolmath<b>games</b></span>
		</a>

		<div class="browse">
			<button class="btn ghost" aria-expanded={menuOpen} aria-controls="browse-menu" onclick={() => (menuOpen = !menuOpen)}>
				<Icon name="browse" /> Browse <span class="chev" class:up={menuOpen}><Icon name="chevron" size={16} /></span>
			</button>
		</div>

		<form class="search" role="search" onsubmit={submit}>
			<label for="site-search" class="sr-only">Search games</label>
			<Icon name="search" />
			<input
				id="site-search"
				type="search"
				placeholder="Search 30 games"
				autocomplete="off"
				bind:value={q}
				onfocus={() => (focused = true)}
				onblur={() => setTimeout(() => (focused = false), 150)}
				onkeydown={onKey}
				oninput={() => (active = -1)}
				aria-expanded={showResults}
				aria-controls="search-results"
				role="combobox"
				aria-activedescendant={active >= 0 ? `sr-${active}` : undefined}
			/>
			{#if showResults}
				<div class="results" id="search-results" role="listbox">
					{#each results as g, i}
						<a id="sr-{i}" role="option" aria-selected={i === active} class:active={i === active} href="{base}/play/{g.slug}/" onclick={pickResult}>
							<span class="mini"><Thumb game={g} label={false} /></span>
							<span><b>{g.title}</b><small>{categoryBySlug[g.category].name}</small></span>
						</a>
					{:else}
						<p class="none">No games match “{q}”. Try a category like <b>Puzzle</b> or <b>Math</b>.</p>
					{/each}
					{#if results.length}
						<button type="submit" class="all">See all results for “{q}”</button>
					{/if}
				</div>
			{/if}
		</form>

		<div class="actions">
			<button class="btn ghost" onclick={surprise}><Icon name="dice" /> Surprise me</button>
			<a class="btn ghost" href="{base}/favorites/" aria-current={page.url.pathname.includes('/favorites') ? 'page' : undefined}>
				<Icon name="heart" /> Favorites
				{#if store.favorites.length}<span class="count">{store.favorites.length}</span>{/if}
			</a>
		</div>
	</div>

	{#if menuOpen}
		<nav id="browse-menu" class="menu" aria-label="Game categories">
			<div class="wrap grid">
				{#each categories as c}
					<a href="{base}/c/{c.slug}/" style="--cat:{c.color}">
						<span class="swatch"></span>
						<span>
							<b>{c.name}</b>
							<small>{c.blurb}</small>
						</span>
						<em>{gamesIn(c.slug).length} games</em>
					</a>
				{/each}
				<a href="{base}/all/" class="allgames" style="--cat:#ffffff">
					<span class="swatch"></span>
					<span><b>All games</b><small>Every game, A to Z</small></span>
					<em>{games.length} games</em>
				</a>
			</div>
		</nav>
	{/if}
</header>
{#if menuOpen}
	<button class="scrim" aria-label="Close menu" onclick={() => (menuOpen = false)}></button>
{/if}

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: var(--bar);
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-block: 10px;
		flex-wrap: wrap;
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--text);
	}
	.word {
		font: 700 1.45rem/1 var(--display);
		letter-spacing: -0.01em;
	}
	.word b {
		color: var(--yellow);
		margin-left: 1px;
	}
	.chev {
		display: inline-flex;
		transition: transform 0.15s;
	}
	.chev.up {
		transform: rotate(180deg);
	}
	.search {
		position: relative;
		flex: 1 1 260px;
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 0 12px;
		min-height: 46px;
		color: var(--text-soft);
	}
	.search:focus-within {
		outline: 3px solid var(--focus);
		outline-offset: 2px;
	}
	.search input {
		flex: 1;
		border: 0;
		outline: 0;
		font: inherit;
		font-size: 1.05rem;
		background: transparent;
		color: var(--text);
		min-width: 0;
	}
	.search input::placeholder {
		color: var(--text-soft);
	}
	.results {
		position: absolute;
		left: -1px;
		right: -1px;
		top: calc(100% + 6px);
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
		padding: 6px;
		z-index: 40;
	}
	.results a {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px;
		border-radius: 8px;
		color: var(--text);
		text-decoration: none;
	}
	.results a.active,
	.results a:hover {
		background: var(--raised);
	}
	.results b {
		display: block;
	}
	.results small {
		color: var(--text-soft);
		font-size: 0.9rem;
	}
	.mini {
		width: 56px;
		height: 35px;
		border-radius: 6px;
		overflow: hidden;
		flex: none;
	}
	.none {
		margin: 8px;
		color: var(--text);
	}
	.all {
		width: 100%;
		margin-top: 4px;
		padding: 10px;
		border: 0;
		border-top: 1px solid var(--line);
		background: none;
		font: 700 0.95rem var(--body);
		color: var(--blue);
		cursor: pointer;
		text-align: left;
	}
	.actions {
		display: flex;
		gap: 8px;
	}
	.count {
		background: var(--yellow);
		color: var(--on-yellow);
		border-radius: 999px;
		font-size: 0.875rem;
		padding: 2px 7px;
		line-height: 1.2;
	}
	.menu {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		background: var(--bar);
		border-top: 1px solid var(--line);
		padding: 16px 0 22px;
		z-index: 35;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(330px, 100%), 1fr));
		gap: 10px;
	}
	.menu a {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 14px;
		padding: 12px 14px;
		border-radius: 12px;
		background: var(--panel);
		color: var(--text);
		text-decoration: none;
		border-left: 6px solid var(--cat);
	}
	.menu a:hover,
	.menu a:focus-visible {
		background: var(--raised);
	}
	.swatch {
		display: none;
	}
	.menu b {
		display: block;
		font: 600 1.15rem/1.2 var(--display);
	}
	.menu small {
		font-size: 0.92rem;
		color: var(--text-soft);
	}
	.menu em {
		font-style: normal;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--text-soft);
	}
	.scrim {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		border: 0;
		z-index: 25;
		cursor: default;
	}
	@media (max-width: 760px) {
		.word {
			font-size: 1.2rem;
		}
		.search {
			order: 5;
			flex-basis: 100%;
		}
		.actions {
			margin-left: auto;
		}
		.bar {
			gap: 8px;
		}
	}
	@media (max-width: 520px) {
		.bar :global(.btn) {
			padding: 8px 10px;
			font-size: 0.92rem;
		}
		.word {
			display: none;
		}
	}
</style>
