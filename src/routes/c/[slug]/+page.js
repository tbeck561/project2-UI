import { error } from '@sveltejs/kit';
import { categories, categoryBySlug, gamesIn } from '$lib/data.js';

export const entries = () => categories.map((c) => ({ slug: c.slug }));

export function load({ params }) {
	const category = categoryBySlug[params.slug];
	if (!category) error(404, 'No category with that name');
	return { category, list: gamesIn(params.slug) };
}
