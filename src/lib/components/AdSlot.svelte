<script>
	// Ads are fenced off: dashed grey frame, "Advertisement" label on top, never touching the game or our buttons.
	// Inside, each made-up ad keeps its own brand fonts and colors and never uses the site's yellow,
	// so it can't be mistaken for one of the site's own controls.
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { ads, adFor } from '$lib/ads.js';
	import { toast } from '$lib/state.svelte.js';

	let { size = 'wide', every = 15000 } = $props();

	// One slot, rotating ads. It starts on the page's own ad (so prerendered HTML matches),
	// then moves to the next one every 15 s.
	let index = $state(ads.indexOf(adFor(page.url.pathname + size)));
	const ad = $derived(ads[index]);

	// Rotation stops while someone is looking at or using the ad, while the tab is hidden,
	// and for good if they press Pause (WCAG 2.2.2: moving content needs a way to pause it).
	let paused = $state(false);
	let hovering = $state(false);
	let focused = $state(false);
	let hidden = $state(false);
	let reduceMotion = $state(false);
	const running = $derived(!paused && !hovering && !focused && !hidden);

	onMount(() => {
		try {
			reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		} catch {}
		const onVis = () => (hidden = document.visibilityState === 'hidden');
		document.addEventListener('visibilitychange', onVis);
		return () => document.removeEventListener('visibilitychange', onVis);
	});

	$effect(() => {
		if (!running) return;
		const t = setInterval(() => (index = (index + 1) % ads.length), every);
		return () => clearInterval(t);
	});

	function open() {
		toast(`${ad.brand} is a made-up ad`, {
			detail: 'This prototype uses fictional brands. On the real site, clicking an ad opens the advertiser’s page in a new tab.'
		});
	}
</script>

<aside
	class="ad {size}"
	aria-label="Advertisement"
	onmouseenter={() => (hovering = true)}
	onmouseleave={() => (hovering = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
>
	<div class="label">
		<span>Advertisement</span>
		<span class="dots" aria-hidden="true">{#each ads as a, i}<i class:on={i === index}></i>{/each}</span>
		<button class="remove" aria-pressed={paused} onclick={() => (paused = !paused)}>{paused ? 'Resume ads' : 'Pause ads'}</button>
		<button class="remove" onclick={() => toast('Premium isn’t part of this prototype', { detail: 'On the real site this opens the Premium plan, which removes ads.' })}>Remove ads</button>
	</div>

	<div class="stack">
	{#key ad.id}
	<button
		in:fade={{ duration: reduceMotion ? 0 : 350 }}
		out:fade={{ duration: reduceMotion ? 0 : 350 }}
		class="creative"
		onclick={open}
		style="--bg:{ad.bg}; --fg:{ad.fg}; --accent:{ad.accent}; --cta-bg:{ad.ctaBg}; --cta-fg:{ad.ctaFg}; font-family:{ad.font}"
		aria-label="Ad from {ad.brand}: {ad.headline}. {ad.cta}"
	>
		<span class="art" aria-hidden="true">
			<svg viewBox="0 0 120 120">
				{#if ad.art === 'sprout'}
					<rect x="22" y="70" width="76" height="34" rx="4" fill={ad.accent} opacity=".25" />
					<path d="M30 72h60l-6 32H36z" fill="#B5763C" />
					<rect x="26" y="66" width="68" height="10" rx="3" fill="#8A5428" />
					<path d="M60 66V36" stroke={ad.accent} stroke-width="5" stroke-linecap="round" />
					<path d="M60 48c-4-14-18-18-26-14 2 12 14 18 26 14z" fill={ad.accent} />
					<path d="M60 40c4-14 18-18 26-14-2 12-14 18-26 14z" fill="#6DB34F" />
					<rect x="40" y="16" width="40" height="12" rx="2" fill={ad.fg} opacity=".85" />
					<path d="M60 16v12" stroke={ad.bg} stroke-width="2" />
				{:else if ad.art === 'cereal'}
					<circle cx="24" cy="22" r="3" fill="#FFF" /><circle cx="96" cy="16" r="2" fill="#FFF" /><circle cx="104" cy="44" r="2.5" fill="#FFF" />
					<path d="M14 62h92c0 26-20 44-46 44S14 88 14 62z" fill={ad.accent} />
					<ellipse cx="60" cy="62" rx="46" ry="10" fill="#FFF4E6" />
					<circle cx="44" cy="58" r="7" fill="#FFF" /><path d="M41 58a4 4 0 0 0 6 0" stroke="#D8C9F2" stroke-width="2" fill="none" />
					<circle cx="66" cy="56" r="6" fill="#C9792E" /><circle cx="80" cy="60" r="5" fill="#C9792E" />
					<path d="M52 40l4-10 4 10 10 1-8 6 3 10-9-6-9 6 3-10-8-6z" fill="#FFD9A8" transform="translate(0 -4)" />
					<path d="M78 34c10-10 22-12 30-10-10 2-20 8-26 16" stroke="#FFD9A8" stroke-width="3" fill="none" stroke-linecap="round" />
				{:else if ad.art === 'rocket'}
					<circle cx="60" cy="60" r="48" fill={ad.accent} opacity=".15" />
					<path d="M60 14c14 14 18 34 12 60H48c-6-26-2-46 12-60z" fill="#FFF" stroke={ad.fg} stroke-width="4" />
					<circle cx="60" cy="44" r="8" fill={ad.accent} stroke={ad.fg} stroke-width="3" />
					<path d="M48 64l-12 14h14M72 64l12 14H70" fill={ad.accent} stroke={ad.fg} stroke-width="3" stroke-linejoin="round" />
					<path d="M52 76c2 14 6 22 8 26 2-4 6-12 8-26" fill="#FF8A3D" />
					<circle cx="24" cy="92" r="9" fill="none" stroke={ad.fg} stroke-width="4" stroke-dasharray="4 3" />
				{:else if ad.art === 'sneaker'}
					<path d="M14 74c0-14 6-28 14-32l14 10c10 6 24 8 40 10 14 2 26 6 26 16v6H14z" fill="#FFF" />
					<path d="M28 42l12 10M36 38l10 10M44 36l8 8" stroke="#111" stroke-width="3" />
					<rect x="14" y="80" width="94" height="10" rx="5" fill={ad.accent} />
					<path d="M20 98h10M44 100h14M74 98h12M96 96h8" stroke={ad.accent} stroke-width="4" stroke-linecap="round" opacity=".8" />
					<path d="M24 104h6M58 106h10M86 104h8" stroke="#4FD1FF" stroke-width="3" stroke-linecap="round" opacity=".8" />
				{:else}
					<rect x="18" y="58" width="28" height="28" fill="#E5484D" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<rect x="46" y="58" width="28" height="28" fill="#3E8EDE" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<rect x="74" y="58" width="28" height="28" fill="#2BB673" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<rect x="32" y="30" width="28" height="28" fill="#F28C28" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<rect x="60" y="30" width="28" height="28" fill="#8E5BD8" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<path d="M46 30l14-20 14 20z" fill="#E5484D" opacity=".85" stroke="#1E2A44" stroke-width="2" />
					<rect x="12" y="86" width="96" height="6" rx="3" fill="#1E2A44" opacity=".2" />
				{/if}
			</svg>
		</span>
		<span class="copy">
			<span class="brand">{ad.brand}</span>
			<span class="headline">{ad.headline}</span>
			<span class="body">{ad.body}</span>
		</span>
		<span class="cta">{ad.cta}</span>
		<span class="tag">Ad</span>
	</button>
	{/key}
	</div>
</aside>

<style>
	/* The fence: neutral grey (no navy), square corners, dashed edge, Arial label. */
	.ad {
		border: 1.5px dashed #7c838f;
		background: #22252b;
		border-radius: 2px;
		padding: 6px;
		color: #d4d8de;
		font-family: Arial, Helvetica, sans-serif;
	}
	.label {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.75rem;
		padding: 0 2px 6px;
		letter-spacing: 0.02em;
	}
	.label > span:first-child {
		margin-right: auto;
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #5b616c;
	}
	.dots i.on {
		background: #d4d8de;
	}
	/* crossfade: both ads share one grid cell so the box never jumps in height */
	.stack {
		display: grid;
	}
	.stack > :global(*) {
		grid-area: 1 / 1;
	}
	.remove {
		color: #d4d8de;
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		text-decoration: underline;
		cursor: pointer;
	}

	/* The creative: the advertiser's own look. Square-ish corners and no thick outline, unlike our cards. */
	.creative {
		position: relative;
		display: grid;
		width: 100%;
		border: 0;
		border-radius: 3px;
		padding: 0;
		margin: 0;
		background: var(--bg);
		color: var(--fg);
		text-align: left;
		cursor: pointer;
		overflow: hidden;
	}
	.creative:focus-visible {
		outline: 3px solid #29bffd;
		outline-offset: 2px;
	}
	.art {
		display: block;
	}
	.art svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.copy {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}
	.brand {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--accent);
		letter-spacing: 0.03em;
	}
	.headline {
		font-weight: 700;
		line-height: 1.2;
	}
	.body {
		font-size: 0.85rem;
		line-height: 1.35;
		opacity: 0.9;
	}
	.cta {
		background: var(--cta-bg);
		color: var(--cta-fg);
		font-weight: 700;
		font-size: 0.88rem;
		padding: 9px 14px;
		border-radius: 3px;
		white-space: nowrap;
		justify-self: start;
	}
	.tag {
		position: absolute;
		top: 4px;
		right: 4px;
		font: 700 0.65rem/1 Arial, sans-serif;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		padding: 3px 5px;
		border-radius: 2px;
	}

	/* 728 × 90 leaderboard */
	.wide .creative {
		grid-template-columns: 90px 1fr auto;
		align-items: center;
		gap: 16px;
		min-height: 90px;
		padding-right: 20px;
	}
	.wide .art {
		width: 90px;
		height: 90px;
		background: color-mix(in srgb, var(--accent) 14%, var(--bg));
	}
	.wide .headline {
		font-size: 1.15rem;
	}

	/* 300 × 250 medium rectangle */
	.tall .creative {
		grid-template-rows: 120px auto auto;
		gap: 10px;
		min-height: 250px;
		padding-bottom: 14px;
	}
	.tall .art {
		height: 120px;
		background: color-mix(in srgb, var(--accent) 14%, var(--bg));
		padding: 6px 0;
	}
	.tall .copy,
	.tall .cta {
		margin: 0 14px;
	}
	.tall .headline {
		font-size: 1.05rem;
	}

	@media (max-width: 620px) {
		.wide .creative {
			grid-template-columns: 72px 1fr;
			padding: 12px 12px 12px 0;
			gap: 10px 12px;
		}
		.wide .art {
			width: 72px;
			height: 100%;
			min-height: 90px;
			grid-row: span 2;
		}
		.wide .body {
			display: none;
		}
	}
</style>
