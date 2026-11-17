import { error } from '@sveltejs/kit';
import { games, gameBySlug, categoryBySlug, gamesIn } from '$lib/data.js';

export const entries = () => games.map((g) => ({ slug: g.slug }));

export function load({ params }) {
	const game = gameBySlug[params.slug];
	if (!game) error(404, 'We couldn’t find that game');
	const category = categoryBySlug[game.category];
	const similar = gamesIn(game.category)
		.filter((g) => g.slug !== game.slug)
		.sort((a, b) => (b.playable ? 1 : 0) - (a.playable ? 1 : 0) || b.plays - a.plays)
		.slice(0, 4);
	return { game, category, similar };
}
