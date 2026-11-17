<script>
	import { base } from '$app/paths';

	const fixes = [
		{
			area: 'Usability',
			problem: 'Too many sections compete on the homepage (menus, category shortcuts, New, Featured, promos, Top 10).',
			fix: 'Three sections only: Continue playing, the six categories, and Popular right now.',
			where: '/'
		},
		{
			area: 'Usability',
			problem: 'Rows like the category shortcuts and Top 10 get cut off at the right edge.',
			fix: 'Every list is a grid that wraps onto new lines, so nothing hides past the edge of the screen.',
			where: '/all/'
		},
		{
			area: 'Learnability',
			problem: 'Menu categories overlap (a game could be Skill or Logic) and Logic opens 9 subcategories.',
			fix: 'Six categories, one per game, each with a one-line description. Players, controls and length became filters instead of categories.',
			where: '/c/puzzle/'
		},
		{
			area: 'Learnability',
			problem: 'Icons have no labels: random, favorite and controls.',
			fix: 'Every button shows words next to its icon: Surprise me, Save to favorites, Restart, Full screen.',
			where: '/play/tile-twins/'
		},
		{
			area: 'Learnability',
			problem: 'Controls hide behind an unlabeled gamepad icon under the game.',
			fix: 'A How to play panel sits next to every game with the keys drawn as keys. They also show on the start screen.',
			where: '/play/sky-dash/'
		},
		{
			area: 'Errors',
			problem: 'Favorite fails until you log in, with no warning: the heart opens a log-in wall.',
			fix: 'Saving always works. Favorites save on this device and the page says so before and after you click. An account is an optional upgrade, never a wall.',
			where: '/favorites/'
		},
		{
			area: 'Errors',
			problem: 'Ads look like the site’s own buttons, so they’re easy to click by mistake.',
			fix: 'Ads live only in grey, hatched boxes labeled Advertisement, in a different font, away from the game and our buttons.',
			where: '/play/quick-sums/'
		},
		{
			area: 'Design',
			problem: 'Ads crowd the game on every side, and a 15-second countdown runs before each game.',
			fix: 'One ad slot per page, never touching the game. The game loads in about a second, then you press Play.',
			where: '/play/jumble-jam/'
		},
		{
			area: 'Design',
			problem: 'Small, low-contrast grey text.',
			fix: 'Atkinson Hyperlegible body text at 17px, with secondary text at 8:1 contrast or better. Everything works with the keyboard and shows a visible focus ring.',
			where: '/'
		}
	];
</script>

<svelte:head><title>What we changed · Coolmath Games redesign</title></svelte:head>

<div class="wrap">
	<h1>What we changed and why</h1>
	<p class="lede">
		We critiqued Coolmath Games by running two tasks: playing a game you already know (Run 3) and finding a new puzzle game to
		save. Each row below is a problem we found, and how this prototype handles it. Follow the link to try it.
	</p>

	<div class="table">
		<div class="row head" aria-hidden="true">
			<span>Area</span><span>What we found</span><span>What the redesign does</span>
		</div>
		{#each fixes as f}
			<div class="row">
				<span class="area">{f.area}</span>
				<p>{f.problem}</p>
				<p>{f.fix} <a href="{base}{f.where}">Try it</a></p>
			</div>
		{/each}
	</div>

	<h2>The two tasks, before and after</h2>
	<div class="tasks">
		<section>
			<h3>Play a game you already know</h3>
			<p><b>Before:</b> find it in search or the Top 10, wait through a 15-second countdown, sit through ads around the game, hunt for the controls icon.</p>
			<p><b>After:</b> it’s already at the top of the homepage under Continue playing. One click, about a second to load, controls on the start screen.</p>
		</section>
		<section>
			<h3>Find a new puzzle game and save it</h3>
			<p><b>Before:</b> pick from nine Logic subcategories, wait 15 seconds per game you try, click an unlabeled heart, hit a log-in wall.</p>
			<p><b>After:</b> open Puzzle, filter if you like, open a game, press Save to favorites. It saves right away, and a message says where it was saved.</p>
		</section>
	</div>
</div>

<style>
	h1 {
		margin: 36px 0 8px;
		font-size: clamp(2rem, 4vw, 2.8rem);
	}
	.lede {
		max-width: 68ch;
		font-size: 1.12rem;
		margin: 0 0 26px;
		color: var(--text-soft);
	}
	.table {
		background: var(--panel);
		border-radius: 16px;
		overflow: hidden;
	}
	.row {
		display: grid;
		grid-template-columns: 130px 1fr 1fr;
		gap: 16px;
		padding: 14px 18px;
		border-top: 1px solid var(--line);
	}
	.row p {
		margin: 0;
	}
	.row p:first-of-type {
		color: var(--text-soft);
	}
	.head {
		background: var(--yellow);
		color: var(--on-yellow);
		font-weight: 700;
		border-top: 0;
	}
	.area {
		font-weight: 700;
	}
	.row a {
		font-weight: 700;
		white-space: nowrap;
	}
	h2 {
		margin: 48px 0 14px;
		font-size: 1.75rem;
	}
	.tasks {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.tasks section {
		background: var(--panel);
		border-radius: 16px;
		padding: 18px 20px;
	}
	h3 {
		margin: 0 0 8px;
		font-size: 1.3rem;
	}
	.tasks p {
		margin: 0 0 8px;
		color: var(--text-soft);
	}
	.tasks b {
		color: var(--text);
	}
	@media (max-width: 760px) {
		.row {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.head {
			display: none;
		}
		.tasks {
			grid-template-columns: 1fr;
		}
	}
</style>
