<script>
	import { onMount } from 'svelte';
	let { onscore = () => {} } = $props();

	const N = 5;
	let on = $state([]);
	let moves = $state(0);
	let solved = $state(false);
	let level = $state(1);

	function flip(grid, i) {
		const r = Math.floor(i / N), c = i % N;
		for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
			const rr = r + dr, cc = c + dc;
			if (rr >= 0 && rr < N && cc >= 0 && cc < N) grid[rr * N + cc] = !grid[rr * N + cc];
		}
	}
	function newPuzzle() {
		// start solved and press random switches, so every puzzle can be solved
		const g = Array(N * N).fill(false);
		const presses = 3 + level * 2;
		for (let k = 0; k < presses; k++) flip(g, Math.floor(Math.random() * N * N));
		if (g.every((x) => !x)) flip(g, 12);
		on = g;
		moves = 0;
		solved = false;
	}
	function press(i) {
		if (solved) return;
		flip(on, i);
		moves++;
		if (on.every((x) => !x)) {
			solved = true;
			onscore(level);
		}
	}
	function nextLevel() {
		level++;
		newPuzzle();
	}
	const lit = $derived(on.filter(Boolean).length);
	onMount(newPuzzle);
</script>

<div class="lights">
	<div class="info">
		<p><b>Level {level}</b></p>
		<p>{lit} {lit === 1 ? 'light' : 'lights'} on</p>
		<p>{moves} {moves === 1 ? 'move' : 'moves'}</p>
		<button class="btn" onclick={newPuzzle}>New puzzle</button>
	</div>
	<div class="board" role="grid" aria-label="Switchboard, 5 by 5">
		{#each on as isOn, i}
			<button class="light" class:on={isOn} aria-label="Row {Math.floor(i / N) + 1}, column {(i % N) + 1}: {isOn ? 'on' : 'off'}" onclick={() => press(i)}></button>
		{/each}
	</div>
	{#if solved}
		<div class="over" role="status">
			<p class="big">All lights off!</p>
			<p>Solved level {level} in {moves} moves</p>
			<button class="btn primary big" onclick={nextLevel}>Next level</button>
		</div>
	{/if}
</div>

<style>
	.lights {
		position: relative;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 60% 40%, #1f2f4a, var(--bg) 80%);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 28px;
		padding: 16px;
	}
	.info p {
		margin: 0 0 6px;
		font-size: 1.1rem;
	}
	.info b {
		font: 700 1.6rem var(--display);
	}
	.info .btn {
		margin-top: 8px;
	}
	.board {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 8px;
		height: 100%;
		max-height: 400px;
		aspect-ratio: 1;
	}
	.light {
		border: 2px solid var(--bg);
		border-radius: 12px;
		background: var(--raised);
		cursor: pointer;
		transition: background 0.12s, box-shadow 0.12s;
	}
	.light.on {
		background: var(--yellow);
		box-shadow: 0 0 20px rgba(255, 228, 32, 0.65);
	}
	.light:focus-visible {
		outline: 3px solid #fff;
	}
	.over {
		position: absolute;
		inset: 0;
		background: rgba(6, 13, 25, 0.84);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.over p {
		margin: 0;
	}
	.big {
		font: 700 2rem var(--display);
	}
	.over .btn {
		margin-top: 12px;
	}
	@media (max-width: 620px) {
		.lights {
			flex-direction: column;
			gap: 10px;
		}
		.info {
			display: flex;
			gap: 12px;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
		}
		.info p {
			margin: 0;
		}
		.info .btn {
			margin: 0;
		}
		.board {
			height: auto;
			width: 100%;
			max-width: 320px;
		}
	}
</style>
