<script>
	import { onMount } from 'svelte';
	let { onscore = () => {} } = $props();

	const WORDS = ['PLANET', 'GARDEN', 'PUZZLE', 'ROCKET', 'PENCIL', 'TURTLE', 'BRIDGE', 'CASTLE', 'ORANGE', 'JUNGLE', 'MAGNET', 'WINTER', 'TICKET', 'SPIDER', 'BASKET', 'FOREST', 'NUMBER', 'ISLAND', 'POCKET', 'SILVER', 'FROG', 'LAMP', 'CLOUD', 'TRAIN', 'SNAKE', 'MOUSE', 'PIANO', 'TIGER'];
	const LENGTH = 90;

	let word = $state('');
	let letters = $state([]);
	let guess = $state('');
	let score = $state(0);
	let left = $state(LENGTH);
	let msg = $state('');
	let tone = $state('');
	let over = $state(false);
	let best = $state(0);
	let input, timer;
	let used = new Set();

	function shuffle(w) {
		let s;
		do {
			s = w.split('').sort(() => Math.random() - 0.5).join('');
		} while (s === w && w.length > 1);
		return s.split('');
	}
	function next() {
		const pool = WORDS.filter((w) => !used.has(w));
		word = pool[Math.floor(Math.random() * pool.length)] ?? WORDS[0];
		used.add(word);
		letters = shuffle(word);
		guess = '';
	}
	function check(e) {
		e?.preventDefault();
		if (over || !guess) return;
		if (guess.trim().toUpperCase() === word) {
			score++;
			msg = `Yes! ${word}`;
			tone = 'right';
			next();
		} else {
			msg = 'Not that one. Try again, or press Skip.';
			tone = 'wrong';
		}
		input.focus();
	}
	function skip() {
		msg = `Skipped: it was ${word}`;
		tone = '';
		next();
		input.focus();
	}
	function onKey(e) {
		if (e.key === 'Tab' && !over) {
			e.preventDefault();
			skip();
		}
	}
	function start() {
		clearInterval(timer);
		used = new Set();
		score = 0;
		left = LENGTH;
		over = false;
		msg = '';
		next();
		timer = setInterval(() => {
			if (--left <= 0) {
				clearInterval(timer);
				over = true;
				best = Math.max(best, score);
				onscore(score);
			}
		}, 1000);
		setTimeout(() => input?.focus());
	}
	onMount(() => {
		start();
		return () => clearInterval(timer);
	});
</script>

<div class="jumble">
	<p class="status"><span>Score <b>{score}</b></span><span class:low={left <= 10}>{left}s left</span></p>
	<div class="tiles" aria-label="Scrambled letters: {letters.join(' ')}">
		{#each letters as l, i (i + l + word)}<span>{l}</span>{/each}
	</div>
	<form onsubmit={check}>
		<label class="sr-only" for="jumble-guess">Your word</label>
		<input id="jumble-guess" bind:this={input} bind:value={guess} onkeydown={onKey} autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength={word.length} disabled={over} />
		<button class="btn primary big" disabled={over}>Check</button>
		<button type="button" class="btn big" onclick={skip} disabled={over}>Skip</button>
	</form>
	<p class="msg {tone}" aria-live="polite">{msg || 'Type the word and press Enter.'}</p>

	{#if over}
		<div class="over" role="status">
			<p class="big">Time! {score} {score === 1 ? 'word' : 'words'}</p>
			<p>Best: {best}</p>
			<button class="btn primary big" onclick={start}>Play again</button>
		</div>
	{/if}
</div>

<style>
	.jumble {
		position: relative;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 50% 30%, #3a2c18, var(--bg) 80%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 16px;
	}
	.status {
		display: flex;
		gap: 24px;
		margin: 0;
		font-size: 1.15rem;
	}
	.status .low {
		color: #ff8fab;
		font-weight: 700;
	}
	.tiles {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.tiles span {
		width: clamp(40px, 8vw, 62px);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		background: var(--yellow);
		color: var(--on-yellow);
		border-radius: 10px;
		box-shadow: 0 4px 0 #b59f00;
		font: 700 clamp(1.4rem, 4vw, 2.2rem) var(--display);
	}
	.tiles span:nth-child(odd) {
		transform: rotate(-4deg);
	}
	.tiles span:nth-child(even) {
		transform: rotate(3deg);
	}
	form {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
	}
	input {
		font: 700 1.6rem var(--display);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		width: 9ch;
		text-align: center;
		border: 2px solid var(--line);
		background: var(--panel);
		border-radius: 12px;
		color: var(--text);
	}
	.msg {
		margin: 0;
		font-weight: 700;
		min-height: 1.5em;
	}
	.right {
		color: #4ade80;
	}
	.wrong {
		color: #ff8fab;
	}
	.over {
		position: absolute;
		inset: 0;
		background: rgba(6, 13, 25, 0.84);
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
	.over .btn {
		margin-top: 12px;
	}
</style>
