<script>
	import { onMount } from 'svelte';
	let { onscore = () => {} } = $props();

	const LENGTH = 60;
	let a = $state(0), b = $state(0), op = $state('+');
	let answer = $state('');
	let score = $state(0);
	let streak = $state(0);
	let left = $state(LENGTH);
	let feedback = $state(null); // 'right' | 'wrong'
	let lastWrong = $state('');
	let over = $state(false);
	let best = $state(0);
	let input, timer;

	function next() {
		const level = Math.min(3, Math.floor(score / 5));
		const ops = ['+', '+', '−', ...(level >= 1 ? ['×'] : [])];
		op = ops[Math.floor(Math.random() * ops.length)];
		const max = [10, 20, 40, 60][level];
		if (op === '×') {
			a = 2 + Math.floor(Math.random() * (level >= 2 ? 11 : 8));
			b = 2 + Math.floor(Math.random() * 8);
		} else {
			a = 1 + Math.floor(Math.random() * max);
			b = 1 + Math.floor(Math.random() * max);
			if (op === '−' && b > a) [a, b] = [b, a];
		}
		answer = '';
	}
	const correct = $derived(op === '+' ? a + b : op === '−' ? a - b : a * b);

	function check(e) {
		e.preventDefault();
		if (over || answer === '') return;
		if (Number(answer) === correct) {
			score++;
			streak++;
			feedback = 'right';
		} else {
			streak = 0;
			feedback = 'wrong';
			lastWrong = `${a} ${op} ${b} = ${correct}`;
		}
		next();
		input.focus();
	}

	function start() {
		clearInterval(timer);
		score = 0;
		streak = 0;
		left = LENGTH;
		over = false;
		feedback = null;
		next();
		timer = setInterval(() => {
			left--;
			if (left <= 0) {
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

<div class="sums">
	<div class="top">
		<div class="timer" class:low={left <= 10}>
			<span style="width:{(left / LENGTH) * 100}%"></span>
			<b>{left}s left</b>
		</div>
		<p class="score">Score <b>{score}</b>{#if streak >= 3}<em> · {streak} in a row!</em>{/if}</p>
	</div>

	<form onsubmit={check}>
		<p class="q" aria-live="polite">{a} {op} {b} =</p>
		<label class="sr-only" for="sum-answer">Your answer</label>
		<input id="sum-answer" bind:this={input} bind:value={answer} inputmode="numeric" pattern="-?[0-9]*" autocomplete="off" maxlength="4" disabled={over} />
		<button class="btn primary big" disabled={over}>Check</button>
	</form>
	<p class="fb {feedback}" aria-live="polite">
		{#if feedback === 'right'}Correct!{:else if feedback === 'wrong'}Not quite: {lastWrong}{:else}Type the answer, then press Enter{/if}
	</p>

	{#if over}
		<div class="over" role="status">
			<p class="big">Time! You scored {score}</p>
			<p>Best: {best}</p>
			<button class="btn primary big" onclick={start}>Play again</button>
		</div>
	{/if}
</div>

<style>
	.sums {
		position: relative;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 50% 30%, #1d3150, var(--bg) 80%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		gap: 12px;
	}
	.top {
		width: min(520px, 100%);
	}
	.timer {
		position: relative;
		height: 34px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--panel);
		overflow: hidden;
	}
	.timer span {
		position: absolute;
		inset: 0 auto 0 0;
		background: var(--yellow);
		transition: width 1s linear;
	}
	.timer.low span {
		background: var(--heart);
	}
	.timer b {
		position: relative;
		display: block;
		text-align: center;
		line-height: 32px;
		color: var(--on-yellow);
	}
	.timer.low b {
		color: #fff;
	}
	.score {
		text-align: center;
		margin: 8px 0 0;
		font-size: 1.1rem;
	}
	.score em {
		font-style: normal;
		color: #4ade80;
		font-weight: 700;
	}
	form {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
	}
	.q {
		font: 700 clamp(2.4rem, 7vw, 4rem) var(--display);
		margin: 0;
	}
	input {
		width: 4.2ch;
		font: 700 clamp(2.4rem, 7vw, 4rem) var(--display);
		text-align: center;
		border: 2px solid var(--line);
		background: var(--panel);
		border-radius: 12px;
		padding: 0 4px;
		color: var(--text);
	}
	.fb {
		margin: 0;
		min-height: 1.6em;
		font-weight: 700;
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
