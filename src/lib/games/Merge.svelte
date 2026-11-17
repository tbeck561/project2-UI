<script>
	import { onMount } from 'svelte';
	let { onscore = () => {} } = $props();

	const N = 4;
	let cells = $state([]);
	let score = $state(0);
	let best = $state(0);
	let over = $state(false);
	let won = $state(false);
	let keepGoing = false;
	let el;
	let nextId = 1;

	function empty() {
		const out = [];
		cells.forEach((v, i) => !v && out.push(i));
		return out;
	}
	function addTile() {
		const e = empty();
		if (!e.length) return;
		const i = e[Math.floor(Math.random() * e.length)];
		cells[i] = { v: Math.random() < 0.9 ? 2 : 4, id: nextId++, fresh: true };
	}
	function reset() {
		cells = Array(N * N).fill(null);
		score = 0;
		over = false;
		won = false;
		keepGoing = false;
		addTile();
		addTile();
		el?.focus();
	}

	function lines(dir) {
		// returns arrays of indices, ordered in the direction tiles slide toward
		const L = [];
		for (let a = 0; a < N; a++) {
			const line = [];
			for (let b = 0; b < N; b++) {
				if (dir === 'left') line.push(a * N + b);
				if (dir === 'right') line.push(a * N + (N - 1 - b));
				if (dir === 'up') line.push(b * N + a);
				if (dir === 'down') line.push((N - 1 - b) * N + a);
			}
			L.push(line);
		}
		return L;
	}

	function move(dir) {
		if (over) return;
		let moved = false;
		const next = cells.map((c) => (c ? { ...c, fresh: false, merged: false } : null));
		for (const line of lines(dir)) {
			const tiles = line.map((i) => next[i]).filter(Boolean);
			const out = [];
			for (let k = 0; k < tiles.length; k++) {
				if (k + 1 < tiles.length && tiles[k].v === tiles[k + 1].v) {
					const v = tiles[k].v * 2;
					out.push({ v, id: nextId++, merged: true });
					score += v;
					if (v === 2048 && !keepGoing) won = true;
					k++;
				} else out.push(tiles[k]);
			}
			line.forEach((idx, k) => {
				const nv = out[k] ?? null;
				if ((next[idx]?.id ?? null) !== (nv?.id ?? null)) moved = true;
				next[idx] = nv;
			});
		}
		if (!moved) return;
		cells = next;
		addTile();
		best = Math.max(best, score);
		if (!canMove()) {
			over = true;
			onscore(score);
		}
	}

	function canMove() {
		if (empty().length) return true;
		for (let r = 0; r < N; r++)
			for (let c = 0; c < N; c++) {
				const v = cells[r * N + c].v;
				if (c + 1 < N && cells[r * N + c + 1].v === v) return true;
				if (r + 1 < N && cells[(r + 1) * N + c].v === v) return true;
			}
		return false;
	}

	const keys = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
	function onKey(e) {
		if (e.target.closest?.('input, select, textarea')) return;
		const d = keys[e.key];
		if (d) {
			e.preventDefault();
			move(d);
		}
	}
	let sx, sy;
	function down(e) {
		sx = e.clientX;
		sy = e.clientY;
	}
	function up(e) {
		const dx = e.clientX - sx,
			dy = e.clientY - sy;
		if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
		move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
	}

	const colors = { 2: '#fff', 4: '#FFF4B0', 8: '#FFE420', 16: '#FFB84D', 32: '#FF8A65', 64: '#FF5C7A', 128: '#B79CFF', 256: '#7B61FF', 512: '#2F6FEB', 1024: '#1F8A70', 2048: '#FFE420' };
	const lightText = new Set([64, 256, 512, 1024]);

	onMount(reset);
</script>

<svelte:window onkeydown={onKey} />

<div class="merge">
	<div class="scores">
		<div><small>Score</small><b>{score}</b></div>
		<div><small>Best</small><b>{best}</b></div>
	</div>
	<div class="board" bind:this={el} tabindex="0" role="application" aria-label="Tile Twins board. Use arrow keys to slide tiles." onpointerdown={down} onpointerup={up}>
		{#each cells as c, i (i)}
			<div class="cell">
				{#if c}
					{#key c.id}
						<div class="tile" class:fresh={c.fresh} class:merged={c.merged} style="background:{colors[c.v] ?? '#FFE420'}; color:{lightText.has(c.v) ? '#fff' : '#060D19'}; font-size:{c.v >= 1000 ? 1.4 : c.v >= 100 ? 1.75 : 2.1}rem">{c.v}</div>
					{/key}
				{/if}
			</div>
		{/each}
	</div>
	{#if over || won}
		<div class="over" role="status">
			<p class="big">{won ? 'You made 2048!' : 'No more moves'}</p>
			<p>Score: {score}</p>
			<div class="row">
				{#if won}<button class="btn" onclick={() => { won = false; keepGoing = true; el.focus(); }}>Keep going</button>{/if}
				<button class="btn primary big" onclick={reset}>New game</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.merge {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		padding: 16px;
		background: radial-gradient(circle at 50% 30%, #1f2f4a, var(--bg) 80%);
	}
	.scores {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.scores div {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 6px 14px;
		min-width: 90px;
		text-align: center;
	}
	.scores small {
		display: block;
		font-weight: 700;
		color: var(--text-soft);
	}
	.scores b {
		font: 700 1.5rem var(--display);
	}
	.board {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
		padding: 8px;
		background: var(--bar);
		border-radius: 14px;
		height: 100%;
		max-height: 420px;
		aspect-ratio: 1;
		touch-action: none;
	}
	.cell {
		background: var(--raised);
		border-radius: 8px;
		position: relative;
	}
	.tile {
		position: absolute;
		inset: 0;
		border-radius: 8px;
		display: grid;
		place-items: center;
		font-family: var(--display);
		font-weight: 700;
	}
	.fresh {
		animation: appear 0.14s ease-out;
	}
	.merged {
		animation: bump 0.14s ease-out;
	}
	@keyframes appear {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
	}
	@keyframes bump {
		50% {
			transform: scale(1.12);
		}
	}
	.over {
		position: absolute;
		inset: 0;
		background: rgba(6, 13, 25, 0.82);
		color: #fff;
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
	.row {
		display: flex;
		gap: 10px;
		margin-top: 12px;
	}
	@media (max-width: 620px) {
		.merge {
			flex-direction: column;
			gap: 10px;
			padding: 10px;
		}
		.scores {
			flex-direction: row;
		}
		.scores div {
			padding: 2px 10px;
		}
		.scores b {
			font-size: 1.1rem;
		}
		.board {
			max-height: none;
			height: auto;
			width: 100%;
			max-width: 340px;
		}
	}
</style>
