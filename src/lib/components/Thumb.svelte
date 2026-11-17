<script>
	// Original procedural thumbnail art: a simple scene per "motif", drawn in the category's color.
	import { categoryBySlug } from '$lib/data.js';
	let { game, label = true } = $props();
	const cat = $derived(categoryBySlug[game.category]);
	const c = $derived(cat.color);
	const t = $derived(cat.tint);
	const ink = '#14213D';
	const sun = '#FFE420';
	const id = $derived('g' + game.slug);
	const sums = ['7+5=', '6×4=', '9−3=', '8+8=', '3×7='];
	const sum = $derived(sums[game.title.length % sums.length]);
	const word = $derived(game.title.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 4));
</script>

<svg viewBox="0 0 160 100" role={label ? 'img' : 'presentation'} aria-label={label ? `${game.title} artwork` : undefined} preserveAspectRatio="xMidYMid slice">
	<defs>
		<pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
			<path d="M10 0H0V10" fill="none" stroke={c} stroke-opacity=".14" stroke-width="1" />
		</pattern>
	</defs>
	<rect width="160" height="100" fill={t} />
	<rect width="160" height="100" fill="url(#{id})" />

	{#if game.motif === 'runner'}
		<rect x="0" y="70" width="58" height="30" fill={ink} />
		<rect x="78" y="62" width="82" height="38" fill={ink} />
		<rect x="112" y="48" width="14" height="14" rx="2" fill={c} />
		<circle cx="40" cy="44" r="7" fill={sun} stroke={ink} stroke-width="3" />
		<path d="M40 51 L36 64 M40 56 L48 50 M37 64 L30 70 M37 64 L46 68" stroke={ink} stroke-width="4" stroke-linecap="round" />
		<path d="M54 40 q12 -12 24 0" stroke={c} stroke-width="3" fill="none" stroke-dasharray="3 4" />
	{:else if game.motif === 'tiles'}
		{#each [[2, '#fff'], [4, sun], [8, c], [16, ink]] as [n, f], i}
			<rect x={34 + (i % 2) * 48} y={8 + Math.floor(i / 2) * 44} width="42" height="40" rx="8" fill={f} stroke={ink} stroke-width="3" />
			<text x={55 + (i % 2) * 48} y={36 + Math.floor(i / 2) * 44} text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill={f === ink || f === c ? '#fff' : ink}>{n}</text>
		{/each}
	{:else if game.motif === 'numbers'}
		<rect x="26" y="20" width="108" height="60" rx="10" fill="#fff" stroke={ink} stroke-width="3" />
		<text x="80" y="60" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill={ink}>{sum}<tspan fill={c}>?</tspan></text>
	{:else if game.motif === 'grid'}
		{#each Array(15) as _, i}
			<circle cx={40 + (i % 5) * 20} cy={30 + Math.floor(i / 5) * 20} r="7" fill={[1, 3, 6, 7, 8, 11, 13].includes(i) ? sun : ink} stroke={ink} stroke-width="2" />
		{/each}
	{:else if game.motif === 'letters' || game.motif === 'hive'}
		{#each word.split('') as ch, i}
			<rect x={22 + i * 30} y={i % 2 ? 40 : 28} width="26" height="30" rx="5" fill={i === 1 ? c : '#fff'} stroke={ink} stroke-width="3" transform="rotate({i % 2 ? 6 : -6} {35 + i * 30} 45)" />
			<text x={35 + i * 30} y={i % 2 ? 62 : 50} text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="18" fill={i === 1 ? '#fff' : ink} transform="rotate({i % 2 ? 6 : -6} {35 + i * 30} 45)">{ch}</text>
		{/each}
	{:else if game.motif === 'shop'}
		<rect x="30" y="38" width="100" height="50" fill="#fff" stroke={ink} stroke-width="3" />
		<path d="M24 38 L36 18 H124 L136 38 Z" fill={c} stroke={ink} stroke-width="3" />
		{#each [0, 1, 2, 3, 4] as i}<path d="M{36 + i * 22} 38 q11 10 22 0" fill={sun} stroke={ink} stroke-width="2" />{/each}
		<circle cx="80" cy="66" r="14" fill={sun} stroke={ink} stroke-width="3" />
		<circle cx="75" cy="62" r="3" fill={c} /><circle cx="85" cy="70" r="3" fill={c} />
	{:else if game.motif === 'board' || game.motif === 'sudoku'}
		{#each Array(game.motif === 'board' ? 16 : 9) as _, i}
			{@const n = game.motif === 'board' ? 4 : 3}
			{@const s = game.motif === 'board' ? 18 : 24}
			<rect x={80 - (n * s) / 2 + (i % n) * s} y={50 - (n * s) / 2 + Math.floor(i / n) * s} width={s} height={s} fill={(i + Math.floor(i / n)) % 2 ? ink : '#fff'} stroke={ink} stroke-width="1.5" />
			{#if game.motif === 'sudoku' && [0, 4, 5, 8].includes(i)}
				<text x={80 - 36 + (i % 3) * 24 + 12} y={50 - 36 + Math.floor(i / 3) * 24 + 18} text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill={(i + Math.floor(i / 3)) % 2 ? '#fff' : c}>{[3, 0, 0, 0, 7, 1, 0, 0, 9][i]}</text>
			{/if}
		{/each}
		{#if game.motif === 'board'}<circle cx="89" cy="41" r="6" fill={sun} stroke={ink} stroke-width="2" />{/if}
	{:else if game.motif === 'water'}
		<rect y="58" width="160" height="42" fill={c} />
		<path d="M0 58 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill={c} />
		<path d="M110 10 L110 56" stroke={ink} stroke-width="2" />
		<path d="M30 76 q14 -10 28 0 q-14 10 -28 0 l-8 -6 v12 z" fill={sun} stroke={ink} stroke-width="2.5" />
	{:else if game.motif === 'globe' || game.motif === 'planets'}
		<circle cx="80" cy="50" r="30" fill={c} stroke={ink} stroke-width="3" />
		{#if game.motif === 'globe'}
			<path d="M64 36 q10 6 6 14 q-8 4 -4 12 M88 28 q-4 10 6 14 q8 2 4 14" stroke={sun} stroke-width="5" fill="none" stroke-linecap="round" />
		{:else}
			<ellipse cx="80" cy="50" rx="46" ry="10" fill="none" stroke={sun} stroke-width="4" />
			<circle cx="132" cy="22" r="6" fill={sun} stroke={ink} stroke-width="2" />
		{/if}
	{:else if game.motif === 'blocks' || game.motif === 'crates'}
		{#each [[40, 66], [58, 66], [76, 66], [94, 66], [58, 48], [76, 48], [112, 66], [94, 30]] as [x, y], i}
			<rect {x} {y} width="18" height="18" fill={i === 7 ? sun : i % 3 ? c : ink} stroke={ink} stroke-width="2" />
			{#if game.motif === 'crates'}<path d="M{x} {y} l18 18 M{x + 18} {y} l-18 18" stroke={ink} stroke-width="1.5" />{/if}
		{/each}
	{:else if game.motif === 'towers'}
		{#each [30, 70, 110] as x, i}
			<rect {x} y={40 + i * 6} width="22" height={50 - i * 6} fill={i === 1 ? c : '#fff'} stroke={ink} stroke-width="3" />
			<path d="M{x - 2} {40 + i * 6} h26 v-8 h-6 v4 h-5 v-4 h-4 v4 h-5 v-4 h-6 z" fill={i === 1 ? c : '#fff'} stroke={ink} stroke-width="2" />
		{/each}
		<circle cx="140" cy="24" r="8" fill={sun} stroke={ink} stroke-width="2" />
	{:else if game.motif === 'bounce'}
		<path d="M30 82 q20 -10 40 0 M90 82 q20 -10 40 0" stroke={ink} stroke-width="5" fill="none" />
		<circle cx="50" cy="40" r="10" fill={c} stroke={ink} stroke-width="3" />
		<circle cx="110" cy="28" r="10" fill={sun} stroke={ink} stroke-width="3" />
	{:else if game.motif === 'road'}
		<path d="M0 100 Q60 30 160 50 L160 80 Q70 60 30 100 Z" fill={ink} />
		<path d="M14 100 Q66 46 160 64" stroke={sun} stroke-width="3" stroke-dasharray="8 8" fill="none" />
		<rect x="88" y="44" width="28" height="14" rx="4" fill={c} stroke="#fff" stroke-width="2" transform="rotate(-8 102 51)" />
	{:else if game.motif === 'discs'}
		<rect x="36" y="16" width="88" height="72" rx="8" fill={c} stroke={ink} stroke-width="3" />
		{#each Array(12) as _, i}
			<circle cx={50 + (i % 4) * 20} cy={32 + Math.floor(i / 4) * 20} r="7" fill={[5, 8, 9, 10].includes(i) ? sun : [6, 11].includes(i) ? ink : '#fff'} />
		{/each}
	{:else if game.motif === 'pie'}
		<circle cx="80" cy="50" r="32" fill={sun} stroke={ink} stroke-width="3" />
		<path d="M80 50 L80 18 A32 32 0 0 1 112 50 Z" fill={c} stroke={ink} stroke-width="3" />
		<path d="M80 50 L48 50 M80 50 L80 82" stroke={ink} stroke-width="3" />
	{:else if game.motif === 'snake'}
		<path d="M24 70 h40 v-30 h40 v30 h20" stroke={c} stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" />
		<circle cx="124" cy="70" r="8" fill={ink} />
		<text x="130" y="38" font-family="Fredoka" font-weight="700" font-size="18" fill={ink}>9</text>
	{:else if game.motif === 'rocket'}
		<path d="M80 14 q16 18 12 50 h-24 q-4 -32 12 -50 z" fill="#fff" stroke={ink} stroke-width="3" />
		<circle cx="80" cy="40" r="6" fill={c} stroke={ink} stroke-width="2" />
		<path d="M72 64 q8 26 16 0" fill={sun} stroke={ink} stroke-width="2" />
	{:else if game.motif === 'farm'}
		<rect y="66" width="160" height="34" fill={c} />
		<path d="M50 66 v-24 l20 -14 l20 14 v24 z" fill="#fff" stroke={ink} stroke-width="3" />
		<rect x="63" y="50" width="14" height="16" fill={sun} stroke={ink} stroke-width="2" />
		{#each [110, 124, 138] as x}<path d="M{x} 66 v-12 m0 4 q-6 -4 -6 -10 q6 2 6 10 q6 -8 6 -10 q0 6 -6 10" stroke={ink} stroke-width="2" fill={sun} />{/each}
	{/if}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
