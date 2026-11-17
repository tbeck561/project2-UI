<script>
	import '@fontsource/fredoka/500.css';
	import '@fontsource/fredoka/600.css';
	import '@fontsource/fredoka/700.css';
	import '@fontsource/atkinson-hyperlegible/400.css';
	import '@fontsource/atkinson-hyperlegible/700.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import { initStore } from '$lib/state.svelte.js';

	let { children } = $props();
	onMount(initStore);
</script>

<a class="skip" href="#main">Skip to content</a>
<Header />
<main id="main">
	{@render children()}
</main>
<Footer />
<Toasts />

<style>
	.skip {
		position: absolute;
		left: 12px;
		top: -60px;
		background: var(--yellow);
		color: var(--on-yellow);
		padding: 10px 14px;
		border: 0;
		border-radius: 10px;
		z-index: 200;
		font-weight: 700;
	}
	.skip:focus {
		top: 12px;
	}
</style>
