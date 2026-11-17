<script>
	import { base } from '$app/paths';
	import Thumb from '$lib/components/Thumb.svelte';
	import GameCard from '$lib/components/GameCard.svelte';
	import AdSlot from '$lib/components/AdSlot.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { categories, categoryBySlug, gameBySlug, gamesIn, popular } from '$lib/data.js';
	import { store, timeAgo, clearRecent } from '$lib/state.svelte.js';

	const starters = ['sky-dash', 'tile-twins', 'quick-sums', 'switchboard'].map((s) => gameBySlug[s]);
	const recent = $derived(store.recent.map((r) => ({ ...r, game: gameBySlug[r.slug] })).filter((r) => r.game));
	const returning = $derived(store.ready && recent.length > 0);
	const lead = $derived(returning ? recent[0].game : starters[0]);
	const others = $derived(returning ? recent.slice(1, 4) : starters.slice(1).map((game) => ({ game })));
</script>

<svelte:head>
	<title>Coolmath Games, redesigned</title>
</svelte:head>

<div class="wrap">
	<!-- 1. Continue playing (slide 7, fix 1). On a first visit: a place to start. -->
	<section class="hero" aria-labelledby="hero-title">
		<div class="hero-text">
			{#if returning}
				<h1 id="hero-title">Continue playing</h1>
				<p>Your recent games, saved on this device.</p>
			{:else}
				<h1 id="hero-title">Pick a game. Start playing.</h1>
				<p>No countdowns, no sign-up. Games you play will show up here under Continue playing.</p>
			{/if}
		</div>

		<div class="hero-grid">
			<a class="lead" href="{base}/play/{lead.slug}/" style="--cat:{categoryBySlug[lead.category].color}">
				<div class="lead-art"><Thumb game={lead} /></div>
				<div class="lead-info">
					<span class="kicker">{returning ? `Played ${timeAgo(recent[0].at)}` : 'Start here'}</span>
					<h2>{lead.title}</h2>
					<p>{lead.blurb}</p>
					{#if returning && recent[0].best}<p class="best">Your best: <b>{recent[0].best}</b></p>{/if}
					<span class="btn primary big"><Icon name="play" /> {returning ? 'Continue' : 'Play'} {lead.title}</span>
				</div>
			</a>

			<ul class="side" aria-label={returning ? 'More recent games' : 'Other games to start with'}>
				{#each others as r}
					<li>
						<a href="{base}/play/{r.game.slug}/">
							<span class="side-art"><Thumb game={r.game} label={false} /></span>
							<span class="side-text">
								<b>{r.game.title}</b>
								<small>{r.at ? `Played ${timeAgo(r.at)}` : categoryBySlug[r.game.category].name}</small>
							</span>
							<span class="go" aria-hidden="true"><Icon name="play" size={18} /></span>
						</a>
					</li>
				{/each}
				{#if returning}
					<li class="clear"><button onclick={clearRecent}>Clear play history</button></li>
				{/if}
			</ul>
		</div>
	</section>

	<!-- 2. Categories: six, no overlap, each says what's inside -->
	<section aria-labelledby="cats-title">
		<div class="section-head">
			<div>
				<h2 id="cats-title">What do you feel like playing?</h2>
				<p>Every game is in exactly one of these.</p>
			</div>
		</div>
		<ul class="cats">
			{#each categories as c}
				{@const list = gamesIn(c.slug)}
				<li>
					<a href="{base}/c/{c.slug}/" style="--cat:{c.color}">
						<span class="cat-thumbs" aria-hidden="true">
							{#each list.slice(0, 3) as g}<span><Thumb game={g} label={false} /></span>{/each}
						</span>
						<span class="cat-text">
							<b>{c.name}</b>
							<span>{c.blurb}</span>
						</span>
						<span class="cat-count">{list.length} games</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- 3. Popular -->
	<section aria-labelledby="pop-title">
		<div class="section-head">
			<div>
				<h2 id="pop-title">Popular right now</h2>
				<p>The most-played games this week.</p>
			</div>
			<a href="{base}/all/">See all 30 games</a>
		</div>
		<div class="game-grid">
			{#each popular.slice(0, 8) as g}
				<GameCard game={g} />
			{/each}
		</div>
	</section>

	<div class="ad-row"><AdSlot /></div>
</div>

<style>
	.hero {
		margin-top: 36px;
	}
	.hero-text h1 {
		font-size: clamp(2.1rem, 5vw, 3.2rem);
		margin: 0;
	}
	.hero-text p {
		margin: 6px 0 22px;
		font-size: 1.15rem;
		max-width: 60ch;
		color: var(--text-soft);
	}
	.hero-grid {
		display: grid;
		grid-template-columns: 1.9fr 1fr;
		gap: 18px;
		align-items: stretch;
	}
	.lead {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		background: var(--panel);
		border-radius: 18px;
		overflow: hidden;
		color: var(--text);
		text-decoration: none;
		transition: box-shadow 0.15s;
	}
	.lead:hover,
	.lead:focus-visible {
		box-shadow: 0 0 0 3px var(--yellow);
		outline: none;
	}
	.lead:hover .btn {
		background: var(--yellow-hover);
	}
	.lead-art {
		min-height: 250px;
	}
	.lead-info {
		padding: 24px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}
	.kicker {
		font-weight: 700;
		color: var(--yellow);
		font-size: 0.95rem;
	}
	.lead h2 {
		font-size: 2.2rem;
		margin: 0;
	}
	.lead p {
		margin: 0;
		color: var(--text-soft);
	}
	.best b {
		font-family: var(--display);
		font-size: 1.2rem;
		color: var(--text);
	}
	.lead .btn {
		margin-top: auto;
	}
	.side {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.side a {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--panel);
		border-radius: var(--radius);
		padding: 8px;
		color: var(--text);
		text-decoration: none;
	}
	.side a:hover,
	.side a:focus-visible {
		background: var(--raised);
		outline: none;
		box-shadow: 0 0 0 3px var(--yellow);
	}
	.side-art {
		width: 92px;
		height: 58px;
		border-radius: 8px;
		overflow: hidden;
		flex: none;
	}
	.side-text {
		flex: 1;
		min-width: 0;
	}
	.side-text b {
		display: block;
		font: 600 1.1rem var(--display);
	}
	.side-text small {
		color: var(--text-soft);
		font-size: 0.9rem;
	}
	.go {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--yellow);
		color: var(--on-yellow);
		display: grid;
		place-items: center;
		flex: none;
	}
	.clear button {
		background: none;
		border: 0;
		color: var(--text-soft);
		text-decoration: underline;
		font: inherit;
		font-size: 0.92rem;
		cursor: pointer;
		padding: 4px 0;
	}

	.cats {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 14px;
	}
	.cats a {
		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100%;
		padding: 14px 14px 16px;
		background: linear-gradient(160deg, color-mix(in srgb, var(--cat) 22%, var(--panel)) 0%, var(--panel) 65%);
		border-radius: 16px;
		border-top: 5px solid var(--cat);
		color: var(--text);
		text-decoration: none;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.cats a:hover,
	.cats a:focus-visible {
		transform: translateY(-3px);
		box-shadow: 0 0 0 3px var(--yellow);
		outline: none;
	}
	.cat-thumbs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.cat-thumbs span {
		aspect-ratio: 16/10;
		border-radius: 6px;
		overflow: hidden;
	}
	.cat-text {
		color: var(--text-soft);
	}
	.cat-text b {
		display: block;
		font: 600 1.45rem/1.1 var(--display);
		color: var(--text);
		margin-bottom: 2px;
	}
	.cat-count {
		font-weight: 700;
		font-size: 0.9rem;
		margin-top: auto;
		color: var(--text-soft);
	}
	.ad-row {
		margin-top: 56px;
	}

	@media (max-width: 960px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.cats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 620px) {
		.lead {
			grid-template-columns: 1fr;
		}
		.lead-art {
			min-height: 0;
			aspect-ratio: 16/10;
		}
		.cats {
			grid-template-columns: 1fr;
		}
	}
</style>
