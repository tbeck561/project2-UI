<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Icon from '$lib/components/Icon.svelte';
	import Thumb from '$lib/components/Thumb.svelte';
	import AdSlot from '$lib/components/AdSlot.svelte';
	import Runner from '$lib/games/Runner.svelte';
	import Merge from '$lib/games/Merge.svelte';
	import Sums from '$lib/games/Sums.svelte';
	import Lights from '$lib/games/Lights.svelte';
	import Jumble from '$lib/games/Jumble.svelte';
	import { games, categoryBySlug, formatPlays } from '$lib/data.js';
	import { store, toggleFavorite, recordPlay, toast } from '$lib/state.svelte.js';

	let { data } = $props();
	const game = $derived(data.game);
	const cat = $derived(data.category);
	const engines = { runner: Runner, merge: Merge, sums: Sums, lights: Lights, jumble: Jumble };
	const Engine = $derived(game.playable ? engines[game.playable] : null);
	const saved = $derived(store.favorites.includes(game.slug));
	const playableGames = games.filter((g) => g.playable);

	// 'loading' (short, real asset load, ~1s) -> 'ready' (press Play) -> 'playing'
	let phase = $state('loading');
	let run = $state(0);
	let frame;
	let isFull = $state(false);

	$effect(() => {
		game.slug; // restart the flow whenever the game changes
		phase = 'loading';
		const t = setTimeout(() => (phase = 'ready'), 900);
		return () => clearTimeout(t);
	});

	function play() {
		phase = 'playing';
		run++;
		recordPlay(game.slug, 0);
	}
	function restart() {
		if (phase !== 'playing') return play();
		run++;
		toast(`Restarted ${game.title}`);
	}
	function onscore(s) {
		recordPlay(game.slug, s);
	}
	async function fullscreen() {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await frame.requestFullscreen();
		} catch {
			toast('Full screen isn’t available in this browser');
		}
	}
	function surprise() {
		const pool = games.filter((g) => g.slug !== game.slug);
		const g = pool[Math.floor(Math.random() * pool.length)];
		toast(`Surprise! Opening ${g.title} (${categoryBySlug[g.category].name})`);
		goto(`${base}/play/${g.slug}/`);
	}
</script>

<svelte:head><title>Play {game.title} · Coolmath Games redesign</title></svelte:head>
<svelte:document onfullscreenchange={() => (isFull = !!document.fullscreenElement)} />

<div class="wrap page" style="--cat:{cat.color}">
	<nav class="crumbs" aria-label="Breadcrumb">
		<a href="{base}/">Home</a> <span aria-hidden="true">/</span>
		<a href="{base}/c/{cat.slug}/">{cat.name}</a> <span aria-hidden="true">/</span>
		<span aria-current="page">{game.title}</span>
	</nav>

	<div class="title-row">
		<h1>{game.title}</h1>
		<p class="facts">
			<a class="chip" href="{base}/c/{cat.slug}/">{cat.name}</a>
			<span>{game.players === 2 ? '1 or 2 players' : '1 player'}</span>
			<span>{game.input === 'mouse' ? 'Mouse or touch' : game.input === 'both' ? 'Keyboard or mouse' : 'Keyboard'}</span>
			<span>{formatPlays(game.plays)} plays</span>
		</p>
	</div>

	<div class="layout">
		<div class="stage-col">
			<div class="frame" class:full={isFull} bind:this={frame}>
				{#if !Engine}
					<div class="screen">
						<div class="screen-art"><Thumb {game} /></div>
						<p class="big">{game.title} isn’t in this prototype</p>
						<p>Five games are playable in this redesign demo. Try one:</p>
						<div class="chips">
							{#each playableGames as g}<a class="btn" href="{base}/play/{g.slug}/">{g.title}</a>{/each}
						</div>
					</div>
				{:else if phase === 'loading'}
					<div class="screen" role="status">
						<p class="big">Loading {game.title}…</p>
						<div class="bar"><span></span></div>
						<p>No countdown. The game starts as soon as it’s ready.</p>
					</div>
				{:else if phase === 'ready'}
					<div class="screen">
						<p class="big">{game.title}</p>
						<ul class="keys">
							{#each game.controls as c}
								<li>{#each c.keys as k, i}{#if i}<span class="or">or</span>{/if}<kbd>{k}</kbd>{/each}<span>{c.action}</span></li>
							{/each}
						</ul>
						<button class="btn primary big" onclick={play}><Icon name="play" /> Play</button>
					</div>
				{:else}
					{#key run}<Engine {onscore} />{/key}
				{/if}
				{#if isFull}
					<button class="btn exit" onclick={fullscreen}><Icon name="close" /> Exit full screen</button>
				{/if}
			</div>

			<div class="toolbar" role="toolbar" aria-label="Game controls">
				<button class="btn" class:on={saved} aria-pressed={saved} onclick={() => toggleFavorite(game.slug, game.title)}>
					<Icon name={saved ? 'heart-filled' : 'heart'} />
					{saved ? 'Saved to favorites' : 'Save to favorites'}
				</button>
				<button class="btn" onclick={restart} disabled={!Engine}><Icon name="restart" /> Restart</button>
				<button class="btn" onclick={fullscreen} disabled={!Engine}><Icon name="expand" /> Full screen</button>
				<button class="btn" onclick={surprise}><Icon name="dice" /> Surprise me</button>
			</div>
			<p class="save-note"><Icon name="device" size={16} /> Favorites save on this device. No account needed.</p>

			<section class="about">
				<h2>About {game.title}</h2>
				<p>{game.blurb}</p>
			</section>
		</div>

		<aside class="side">
			<section class="how">
				<h2><Icon name="gamepad" size={24} /> How to play</h2>
				<p>{game.goal}</p>
				<ul class="keys list">
					{#each game.controls as c}
						<li><span class="k">{#each c.keys as k, i}{#if i}<span class="or">or</span>{/if}<kbd>{k}</kbd>{/each}</span><span>{c.action}</span></li>
					{/each}
				</ul>
			</section>

			<section class="more">
				<h2>More {cat.name.toLowerCase()} games</h2>
				<ul>
					{#each data.similar as g}
						<li>
							<a href="{base}/play/{g.slug}/">
								<span class="mini"><Thumb game={g} label={false} /></span>
								<span><b>{g.title}</b><small>{g.blurb}</small></span>
							</a>
						</li>
					{/each}
				</ul>
				<a class="all" href="{base}/c/{cat.slug}/">See all {cat.name.toLowerCase()} games</a>
			</section>

			<div class="ad-gap"><AdSlot size="tall" /></div>
		</aside>
	</div>
</div>

<style>
	.crumbs {
		margin: 22px 0 8px;
		font-size: 0.95rem;
		color: var(--text-soft);
	}
	.title-row {
		display: flex;
		align-items: baseline;
		gap: 8px 20px;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	h1 {
		font-size: clamp(2rem, 4vw, 2.7rem);
		margin: 0;
	}
	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 16px;
		margin: 0;
		color: var(--text-soft);
		align-items: center;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: var(--bar);
		border: 1px solid var(--line);
		color: var(--text);
		font-weight: 700;
		border-radius: 999px;
		padding: 3px 12px;
		text-decoration: none;
	}
	.chip::before {
		content: '';
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--cat);
	}
	.chip:hover {
		background: var(--raised);
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 28px;
		align-items: start;
	}
	.frame {
		position: relative;
		aspect-ratio: 16 / 10;
		background: #000;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 0 0 1px var(--line), 0 20px 50px rgba(0, 0, 0, 0.5);
	}
	.frame.full {
		border-radius: 0;
	}
	.screen {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 20px;
		color: var(--text);
		text-align: center;
		background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--cat) 28%, var(--panel)), var(--bg) 75%);
	}
	.screen p {
		margin: 0;
		color: var(--text-soft);
	}
	.screen p.big {
		color: var(--text);
	}
	.big {
		font: 700 clamp(1.5rem, 3vw, 2.2rem) var(--display);
	}
	.screen-art {
		width: 180px;
		aspect-ratio: 16/10;
		border-radius: 10px;
		overflow: hidden;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		margin-top: 6px;
	}
	.bar {
		width: min(320px, 80%);
		height: 12px;
		border-radius: 999px;
		background: var(--raised);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		background: var(--yellow);
		animation: load 0.9s ease-out forwards;
	}
	@keyframes load {
		from {
			width: 5%;
		}
		to {
			width: 100%;
		}
	}
	.keys {
		list-style: none;
		padding: 0;
		margin: 4px 0 10px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 22px;
	}
	.keys li {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	kbd {
		font: 700 0.95rem var(--body);
		background: #ffffff;
		color: var(--on-yellow);
		border-bottom: 3px solid #9aa7bb;
		border-radius: 7px;
		padding: 3px 8px;
		min-width: 30px;
		text-align: center;
	}
	.or {
		font-size: 0.9rem;
		color: var(--text-soft);
	}
	.exit {
		position: absolute;
		top: 12px;
		right: 12px;
	}
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 18px;
	}
	.toolbar .btn.on {
		background: color-mix(in srgb, var(--heart) 18%, var(--raised));
		border-color: var(--heart);
	}
	.toolbar .btn.on :global(svg) {
		color: var(--heart);
	}
	.toolbar .btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.save-note {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--text-soft);
		font-size: 0.92rem;
		margin: 10px 0 0;
	}
	.about h2,
	.side h2 {
		font-size: 1.35rem;
		margin: 0 0 8px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.about {
		margin-top: 26px;
		max-width: 68ch;
	}
	.about p {
		margin: 0;
		color: var(--text-soft);
	}
	.side {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.how,
	.more {
		background: var(--panel);
		border-radius: 16px;
		padding: 16px;
	}
	.how {
		border-top: 5px solid var(--cat);
	}
	.how h2 :global(svg) {
		color: var(--yellow);
	}
	.how p {
		margin: 0 0 12px;
		color: var(--text-soft);
	}
	.keys.list {
		flex-direction: column;
		align-items: stretch;
		margin: 0;
		gap: 8px;
	}
	.keys.list li {
		justify-content: space-between;
		background: var(--bar);
		border-radius: 10px;
		padding: 7px 10px;
	}
	.keys.list li > span:last-child {
		font-weight: 700;
	}
	.k {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}
	.more ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.more a {
		display: flex;
		gap: 10px;
		align-items: center;
		text-decoration: none;
		color: var(--text);
		border-radius: 10px;
		padding: 5px;
	}
	.more a:hover {
		background: var(--raised);
	}
	.more b {
		display: block;
		font: 600 1.05rem var(--display);
	}
	.more small {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.92rem;
		color: var(--text-soft);
	}
	.mini {
		width: 84px;
		height: 52px;
		border-radius: 8px;
		overflow: hidden;
		flex: none;
	}
	.more .all {
		display: inline-block;
		margin-top: 10px;
		font-weight: 700;
		color: var(--blue);
		text-decoration: underline;
	}
	.ad-gap {
		margin-top: 24px;
	}
	@media (max-width: 960px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.side {
			display: grid;
			grid-template-columns: 1fr 1fr;
			align-items: start;
		}
		.ad-gap {
			grid-column: 1 / -1;
			margin-top: 0;
		}
	}
	@media (max-width: 620px) {
		.frame {
			aspect-ratio: 3 / 4;
		}
		.side {
			grid-template-columns: 1fr;
		}
		.toolbar .btn {
			flex: 1 1 45%;
		}
	}
</style>
