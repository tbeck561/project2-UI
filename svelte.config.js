import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		// On GitHub Pages the site lives under /<repo-name>; the deploy workflow sets BASE_PATH.
		paths: { base: process.env.BASE_PATH ?? '' }
	}
};

export default config;
