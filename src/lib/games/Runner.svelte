<script>
	import { onMount } from 'svelte';
	let { onscore = () => {} } = $props();

	let canvas;
	let score = $state(0);
	let best = $state(0);
	let over = $state(false);

	const W = 800,
		H = 500,
		GROUND = 410;
	let player, obstacles, speed, t, raf, last, spawnIn, clouds;

	function reset() {
		player = { x: 130, y: GROUND - 44, vy: 0, w: 34, h: 44, onGround: true };
		obstacles = [];
		clouds = Array.from({ length: 5 }, (_, i) => ({ x: i * 180 + 40, y: 60 + (i % 3) * 40 }));
		speed = 6;
		t = 0;
		spawnIn = 70;
		score = 0;
		over = false;
	}

	function jump() {
		if (over) {
			reset();
			return;
		}
		if (player.onGround) {
			player.vy = -15.5;
			player.onGround = false;
		}
	}

	function step() {
		t++;
		speed = 6 + t / 600;
		player.vy += 0.8;
		player.y += player.vy;
		if (player.y >= GROUND - player.h) {
			player.y = GROUND - player.h;
			player.vy = 0;
			player.onGround = true;
		}
		if (--spawnIn <= 0) {
			const h = 30 + Math.random() * 40;
			const w = 26 + Math.random() * 22;
			obstacles.push({ x: W + 20, y: GROUND - h, w, h });
			spawnIn = 55 + Math.random() * 60 - Math.min(25, t / 200);
		}
		for (const o of obstacles) o.x -= speed;
		obstacles = obstacles.filter((o) => o.x + o.w > -10);
		for (const c of clouds) {
			c.x -= speed * 0.25;
			if (c.x < -120) c.x = W + 40;
		}
		for (const o of obstacles) {
			if (player.x + player.w - 6 > o.x && player.x + 6 < o.x + o.w && player.y + player.h > o.y + 4) {
				over = true;
				best = Math.max(best, score);
				onscore(score);
			}
		}
		score = Math.floor(t / 6);
	}

	function draw(ctx) {
		const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
		sky.addColorStop(0, '#0B1526');
		sky.addColorStop(1, '#1F3354');
		ctx.fillStyle = sky;
		ctx.fillRect(0, 0, W, H);
		// graph-paper sky
		ctx.strokeStyle = 'rgba(255,255,255,.05)';
		ctx.lineWidth = 1;
		const off = (t * speed * 0.3) % 25;
		for (let x = -off; x < W; x += 25) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, GROUND);
			ctx.stroke();
		}
		for (let y = 0; y < GROUND; y += 25) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(W, y);
			ctx.stroke();
		}
		ctx.fillStyle = 'rgba(255,255,255,.08)';
		for (const c of clouds) {
			ctx.beginPath();
			ctx.ellipse(c.x, c.y, 46, 16, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = '#060D19';
		ctx.fillRect(0, GROUND, W, H - GROUND);
		ctx.fillStyle = '#FFE420';
		const d = (t * speed) % 60;
		for (let x = -d; x < W; x += 60) ctx.fillRect(x, GROUND + 18, 30, 6);
		for (const o of obstacles) {
			ctx.fillStyle = '#FF5C7A';
			ctx.fillRect(o.x, o.y, o.w, o.h);
			ctx.strokeStyle = '#060D19';
			ctx.lineWidth = 4;
			ctx.strokeRect(o.x, o.y, o.w, o.h);
		}
		// player
		const p = player;
		ctx.fillStyle = '#FFE420';
		ctx.strokeStyle = '#060D19';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.roundRect(p.x, p.y, p.w, p.h, 10);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#060D19';
		ctx.fillRect(p.x + 21, p.y + 12, 6, 8);
		// score
		ctx.fillStyle = '#FFFFFF';
		ctx.font = '700 30px Fredoka, sans-serif';
		ctx.textAlign = 'right';
		ctx.fillText(`${score} m`, W - 24, 46);
		ctx.font = '600 18px Fredoka, sans-serif';
		ctx.fillStyle = '#C3CEDD';
		ctx.fillText(`Best ${best} m`, W - 24, 72);
	}

	function loop(now) {
		const ctx = canvas.getContext('2d');
		if (!last) last = now;
		let acc = Math.min(now - last, 100);
		last = now;
		while (acc > 0 && !over) {
			step();
			acc -= 1000 / 60;
		}
		draw(ctx);
		raf = requestAnimationFrame(loop);
	}

	function onKey(e) {
		if (e.target.closest?.('input, select, textarea')) return;
		if (e.code === 'Space' || e.key === 'ArrowUp') {
			e.preventDefault();
			jump();
		} else if (e.key === 'r' || e.key === 'R') reset();
	}

	onMount(() => {
		reset();
		canvas.focus();
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="runner">
	<canvas bind:this={canvas} width={W} height={H} tabindex="0" aria-label="Sky Dash game. Press space to jump." onpointerdown={jump}></canvas>
	{#if over}
		<div class="over" role="status">
			<p class="big">You ran {score} m</p>
			<p>Best: {best} m</p>
			<button class="btn primary big" onclick={reset}>Run again</button>
			<p class="hint">or press Space</p>
		</div>
	{/if}
</div>

<style>
	.runner {
		position: relative;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
	canvas {
		width: 100%;
		height: 100%;
		object-fit: contain;
		touch-action: manipulation;
		display: block;
	}
	.over {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(6, 13, 25, 0.82);
		color: #fff;
		gap: 4px;
		text-align: center;
	}
	.over p {
		margin: 0;
	}
	.big {
		font: 700 2.2rem var(--display);
	}
	.over .btn {
		margin-top: 14px;
	}
	.hint {
		font-size: 0.9rem;
		margin-top: 6px !important;
	}
</style>
