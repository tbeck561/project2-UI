<script>
	import Icon from './Icon.svelte';
	import { store, dismissToast } from '$lib/state.svelte.js';
</script>

<div class="toasts" role="status" aria-live="polite">
	{#each store.toasts as t (t.id)}
		<div class="toast">
			<span class="tick"><Icon name="check" size={18} /></span>
			<div>
				<p>{t.message}</p>
				{#if t.detail}<small>{t.detail}</small>{/if}
			</div>
			{#if t.undo}
				<button class="undo" onclick={() => { t.undo(); dismissToast(t.id); }}>Undo</button>
			{/if}
			<button class="x" aria-label="Dismiss" onclick={() => dismissToast(t.id)}><Icon name="close" size={16} /></button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		left: 50%;
		bottom: 20px;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 100;
		width: min(520px, calc(100vw - 32px));
	}
	@media (min-width: 900px) {
		.toasts {
			left: auto;
			right: 24px;
			transform: none;
		}
	}
	.toast {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		background: #ffffff;
		color: var(--on-yellow);
		border-radius: 12px;
		padding: 12px 12px 12px 14px;
		box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
		animation: pop 0.18s ease-out;
	}
	.tick {
		background: var(--yellow);
		color: var(--on-yellow);
		border-radius: 50%;
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		flex: none;
	}
	div > div {
		flex: 1;
	}
	p {
		margin: 2px 0 0;
		font-weight: 700;
	}
	small {
		display: block;
		margin-top: 3px;
		color: #3a4659;
		font-size: 0.9rem;
	}
	.undo {
		background: var(--on-yellow);
		border: 0;
		color: var(--yellow);
		font: 700 0.9rem var(--body);
		border-radius: 8px;
		padding: 6px 12px;
		cursor: pointer;
	}
	.x {
		background: none;
		border: 0;
		color: var(--on-yellow);
		cursor: pointer;
		padding: 4px;
	}
	@keyframes pop {
		from {
			transform: translateY(10px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.toast {
			animation: none;
		}
	}
</style>
