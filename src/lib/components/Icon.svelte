<script>
	// Icons are decorative: every place that uses one also shows a text label next to it.
	let { name, size = 20 } = $props();
	const paths = {
		heart: 'M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.1 1.8-1.9 3.3-3.1 5.4-3.1 3.6 0 5.4 3.7 3.8 6.9C19 15.6 12 20 12 20z',
		dice: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
		search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM20 20l-4.6-4.6',
		browse: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
		gamepad: 'M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7.2 2.4L14 14h-4l-.8 1.4A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4zM7 10v4M5 12h4',
		restart: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5',
		expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
		menu: 'M4 7h16M4 12h16M4 17h16',
		close: 'M6 6l12 12M18 6L6 18',
		play: 'M8 5v14l11-7z',
		clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
		users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.6M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
		info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5v.5',
		chevron: 'M6 9l6 6 6-6',
		back: 'M15 6l-6 6 6 6',
		device: 'M4 5h16v11H4zM9 20h6M12 16v4',
		check: 'M5 12.5l4.5 4.5L19 7'
	};
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
	{#if name === 'dice'}
		<path d={paths.dice} />
		<circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
		<circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
		<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
	{:else if name === 'heart-filled'}
		<path d={paths.heart} fill="currentColor" />
	{:else}
		<path d={paths[name]} />
	{/if}
</svg>
