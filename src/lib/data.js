// Every game belongs to exactly ONE category (fixes "Skill vs. Logic" overlap).
// Things that cut across categories (2 players, mouse only, quick games) are filters, not categories.

export const categories = [
	{
		slug: 'puzzle',
		name: 'Puzzle',
		blurb: 'Solve it: logic, matching and brain teasers',
		color: '#9B7BFF',
		tint: '#E9E3FF'
	},
	{
		slug: 'action',
		name: 'Action',
		blurb: 'Quick reflexes: run, jump and dodge',
		color: '#FF5C7A',
		tint: '#FFE1E7'
	},
	{
		slug: 'strategy',
		name: 'Strategy',
		blurb: 'Plan ahead: board games, defense and building',
		color: '#22C58B',
		tint: '#DAF6EA'
	},
	{
		slug: 'math',
		name: 'Math',
		blurb: 'Play with numbers, speed and patterns',
		color: '#3D8BFF',
		tint: '#DDEAFF'
	},
	{
		slug: 'words',
		name: 'Words',
		blurb: 'Spell, guess and unscramble',
		color: '#FF9F1C',
		tint: '#FFEBCF'
	},
	{
		slug: 'simulation',
		name: 'Simulation',
		blurb: 'Run a shop, cook, farm or build a town',
		color: '#FF7A45',
		tint: '#FFE3D6'
	}
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

const K = (keys, action) => ({ keys, action });

// Game titles and art are original placeholders. Swap in real titles/thumbnails in this file.
// `playable` = a mini-game that actually runs in this prototype.
export const games = [
	// ---------- playable ----------
	{
		slug: 'sky-dash',
		title: 'Sky Dash',
		category: 'action',
		blurb: 'Run across floating rooftops and jump the gaps. How far can you get?',
		players: 1,
		input: 'keyboard',
		length: 'quick',
		plays: 7_900_000,
		added: '2026-10-02',
		motif: 'runner',
		playable: 'runner',
		goal: 'Jump over the boxes. The longer you survive, the faster it gets.',
		controls: [K(['Space', '↑'], 'Jump'), K(['Click', 'Tap'], 'Jump'), K(['R'], 'Restart')]
	},
	{
		slug: 'tile-twins',
		title: 'Tile Twins',
		category: 'puzzle',
		blurb: 'Slide matching tiles together to double them. Reach 2048!',
		players: 1,
		input: 'keyboard',
		length: 'long',
		plays: 4_300_000,
		added: '2026-09-12',
		motif: 'tiles',
		playable: 'merge',
		goal: 'Two tiles with the same number join into one. Make a 2048 tile.',
		controls: [K(['←', '↑', '→', '↓'], 'Slide all tiles'), K(['Swipe'], 'Slide (touch)')]
	},
	{
		slug: 'quick-sums',
		title: 'Quick Sums',
		category: 'math',
		blurb: 'Answer as many sums as you can in 60 seconds.',
		players: 1,
		input: 'keyboard',
		length: 'quick',
		plays: 2_100_000,
		added: '2026-11-03',
		motif: 'numbers',
		playable: 'sums',
		goal: 'Type the answer and press Enter. Every right answer adds a point.',
		controls: [K(['0–9'], 'Type answer'), K(['Enter'], 'Check answer')]
	},
	{
		slug: 'switchboard',
		title: 'Switchboard',
		category: 'puzzle',
		blurb: 'Every switch flips its neighbors too. Turn all the lights off.',
		players: 1,
		input: 'mouse',
		length: 'quick',
		plays: 1_250_000,
		added: '2026-08-21',
		motif: 'grid',
		playable: 'lights',
		goal: 'Clicking a light flips it and the lights above, below, left and right. Turn every light off.',
		controls: [K(['Click', 'Tap'], 'Flip a light')]
	},
	{
		slug: 'jumble-jam',
		title: 'Jumble Jam',
		category: 'words',
		blurb: 'Unscramble the letters before the clock runs out.',
		players: 1,
		input: 'keyboard',
		length: 'quick',
		plays: 980_000,
		added: '2026-11-10',
		motif: 'letters',
		playable: 'jumble',
		goal: 'Rearrange the letters into a real word. Use Skip if you get stuck.',
		controls: [K(['A–Z'], 'Type the word'), K(['Enter'], 'Check'), K(['Tab'], 'Skip word')]
	},

	// ---------- catalog only ----------
	{ slug: 'pizza-counter', title: 'Pizza Counter', category: 'simulation', blurb: 'Take orders, top pizzas and keep customers happy.', players: 1, input: 'mouse', length: 'long', plays: 6_800_000, added: '2026-06-01', motif: 'shop' },
	{ slug: 'checkmate-club', title: 'Checkmate Club', category: 'strategy', blurb: 'Classic chess against the computer or a friend.', players: 2, input: 'mouse', length: 'long', plays: 5_600_000, added: '2025-12-14', motif: 'board' },
	{ slug: 'pond-fishing', title: 'Pond Fishing', category: 'simulation', blurb: 'Cast your line and fill your fish journal.', players: 1, input: 'mouse', length: 'long', plays: 4_900_000, added: '2026-04-11', motif: 'water' },
	{ slug: 'map-hunt', title: 'Map Hunt', category: 'puzzle', blurb: 'Guess where in the world a photo was taken.', players: 1, input: 'mouse', length: 'quick', plays: 3_700_000, added: '2026-07-19', motif: 'globe' },
	{ slug: 'block-drop', title: 'Block Drop', category: 'puzzle', blurb: 'Fit falling shapes into full lines.', players: 1, input: 'keyboard', length: 'quick', plays: 3_500_000, added: '2025-11-02', motif: 'blocks' },
	{ slug: 'tower-patrol', title: 'Tower Patrol', category: 'strategy', blurb: 'Build towers to stop waves of robots.', players: 1, input: 'mouse', length: 'long', plays: 3_300_000, added: '2026-03-08', motif: 'towers' },
	{ slug: 'cookie-tycoon', title: 'Cookie Tycoon', category: 'simulation', blurb: 'Click cookies, hire bakers, grow an empire.', players: 1, input: 'mouse', length: 'long', plays: 3_100_000, added: '2026-02-17', motif: 'shop' },
	{ slug: 'bounce-buddies', title: 'Bounce Buddies', category: 'action', blurb: 'Two players, one screen, lots of trampolines.', players: 2, input: 'keyboard', length: 'quick', plays: 2_900_000, added: '2026-09-28', motif: 'bounce' },
	{ slug: 'drift-kings', title: 'Drift Kings', category: 'action', blurb: 'Slide around corners without hitting the walls.', players: 1, input: 'keyboard', length: 'quick', plays: 2_700_000, added: '2026-10-20', motif: 'road' },
	{ slug: 'connect-four-ever', title: 'Four in a Row', category: 'strategy', blurb: 'Drop discs and line up four before your friend does.', players: 2, input: 'mouse', length: 'quick', plays: 2_500_000, added: '2025-09-30', motif: 'discs' },
	{ slug: 'times-table-race', title: 'Times Table Race', category: 'math', blurb: 'Race your kart by answering multiplication facts.', players: 1, input: 'keyboard', length: 'quick', plays: 2_000_000, added: '2026-05-05', motif: 'numbers' },
	{ slug: 'fraction-pizza', title: 'Fraction Feast', category: 'math', blurb: 'Slice pies into the exact fraction each order needs.', players: 1, input: 'mouse', length: 'quick', plays: 1_400_000, added: '2026-10-29', motif: 'pie' },
	{ slug: 'number-snake', title: 'Number Snake', category: 'math', blurb: 'Eat numbers that add up to the target.', players: 1, input: 'keyboard', length: 'quick', plays: 1_300_000, added: '2026-07-07', motif: 'snake' },
	{ slug: 'sudoku-daily', title: 'Daily Sudoku', category: 'math', blurb: 'A new 9×9 sudoku every day, four difficulty levels.', players: 1, input: 'both', length: 'long', plays: 1_900_000, added: '2025-08-15', motif: 'sudoku' },
	{ slug: 'word-guess', title: 'Five Letters', category: 'words', blurb: 'Six tries to guess the hidden five-letter word.', players: 1, input: 'keyboard', length: 'quick', plays: 2_600_000, added: '2026-01-22', motif: 'letters' },
	{ slug: 'spelling-bee-hive', title: 'Letter Hive', category: 'words', blurb: 'Make as many words as you can from seven letters.', players: 1, input: 'keyboard', length: 'long', plays: 1_100_000, added: '2026-06-18', motif: 'hive' },
	{ slug: 'typing-rocket', title: 'Typing Rocket', category: 'words', blurb: 'Type words fast to keep your rocket flying.', players: 1, input: 'keyboard', length: 'quick', plays: 1_600_000, added: '2026-09-03', motif: 'rocket' },
	{ slug: 'crate-escape', title: 'Crate Escape', category: 'puzzle', blurb: 'Push crates onto targets without getting stuck.', players: 1, input: 'keyboard', length: 'long', plays: 1_700_000, added: '2026-02-02', motif: 'crates' },
	{ slug: 'gravity-golf', title: 'Gravity Golf', category: 'puzzle', blurb: 'Bend your shot around planets to sink the ball.', players: 1, input: 'mouse', length: 'quick', plays: 1_500_000, added: '2026-11-12', motif: 'planets' },
	{ slug: 'lava-leap', title: 'Lava Leap', category: 'action', blurb: 'Climb a tower while the lava rises below.', players: 1, input: 'keyboard', length: 'quick', plays: 2_300_000, added: '2026-08-09', motif: 'runner' },
	{ slug: 'space-dodge', title: 'Space Dodge', category: 'action', blurb: 'Weave through an asteroid field.', players: 1, input: 'mouse', length: 'quick', plays: 1_800_000, added: '2026-04-27', motif: 'planets' },
	{ slug: 'castle-builder', title: 'Castle Builder', category: 'strategy', blurb: 'Plan walls and gates before the siege begins.', players: 1, input: 'mouse', length: 'long', plays: 1_200_000, added: '2026-10-14', motif: 'towers' },
	{ slug: 'mancala-world', title: 'Stone Pits', category: 'strategy', blurb: 'An ancient counting game for two.', players: 2, input: 'mouse', length: 'quick', plays: 900_000, added: '2026-03-30', motif: 'discs' },
	{ slug: 'farm-friends', title: 'Farm Friends', category: 'simulation', blurb: 'Plant, water and sell crops season by season.', players: 1, input: 'mouse', length: 'long', plays: 2_200_000, added: '2026-09-09', motif: 'farm' },
	{ slug: 'tiny-town', title: 'Tiny Town', category: 'simulation', blurb: 'Lay out roads and houses for a growing town.', players: 1, input: 'mouse', length: 'long', plays: 1_000_000, added: '2026-11-06', motif: 'farm' }
].map((g) => ({
	controls: g.controls ?? [
		K(g.input === 'keyboard' ? ['←', '→', '↑', '↓'] : ['Click'], g.input === 'keyboard' ? 'Move' : 'Select'),
		...(g.players === 2 ? [K(['W', 'A', 'S', 'D'], 'Player 2 moves')] : [])
	],
	goal: g.goal ?? g.blurb,
	playable: g.playable ?? null,
	...g
}));

export const gameBySlug = Object.fromEntries(games.map((g) => [g.slug, g]));

export const popular = [...games].sort((a, b) => b.plays - a.plays);
export const newest = [...games].sort((a, b) => b.added.localeCompare(a.added));

export function gamesIn(slug) {
	return games.filter((g) => g.category === slug);
}

export function search(q) {
	const s = q.trim().toLowerCase();
	if (!s) return [];
	return popular
		.map((g) => {
			const t = g.title.toLowerCase();
			const cat = categoryBySlug[g.category].name.toLowerCase();
			let score = 0;
			if (t === s) score = 100;
			else if (t.startsWith(s)) score = 60;
			else if (t.includes(s)) score = 40;
			else if (cat.startsWith(s)) score = 20;
			else if (g.blurb.toLowerCase().includes(s)) score = 10;
			return { g, score };
		})
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((r) => r.g);
}

export function formatPlays(n) {
	if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	if (n >= 1_000) return Math.round(n / 1_000) + 'K';
	return String(n);
}

export function isNew(g) {
	return g.added >= '2026-10-16';
}
