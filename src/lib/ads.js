// Made-up ads from fictional brands, so the prototype shows realistic ad creative
// without using any real company's name or artwork.
// Each ad keeps its own fonts and colors and never uses the site's yellow (#FFE420),
// so an ad can't be mistaken for one of the site's own buttons.

export const ads = [
	{
		id: 'story-sprout',
		brand: 'Story Sprout',
		headline: 'Read 10 minutes a day, grow a reading garden',
		body: 'Kids’ e-books with a plant that grows every time you finish a chapter.',
		cta: 'Try free for 14 days',
		art: 'sprout',
		bg: '#F3EEDC',
		fg: '#2D3B22',
		accent: '#4E8A3A',
		ctaBg: '#2D5A1F',
		ctaFg: '#FFFFFF',
		font: "Georgia, 'Times New Roman', serif"
	},
	{
		id: 'crunch-comets',
		brand: 'Crunch Comets',
		headline: 'Now with marshmallow moons',
		body: 'The cereal that’s out of this world. Part of a balanced breakfast.',
		cta: 'Find it in stores',
		art: 'cereal',
		bg: '#3B1F6B',
		fg: '#FFFFFF',
		accent: '#FF8A3D',
		ctaBg: '#FF8A3D',
		ctaFg: '#2A1450',
		font: "'Trebuchet MS', Verdana, sans-serif"
	},
	{
		id: 'fern-hollow',
		brand: 'Fern Hollow Science Camp',
		headline: 'Build robots. Launch rockets. Summer 2027.',
		body: 'Week-long day camps for ages 9–14. Sign-ups open now.',
		cta: 'See camp dates',
		art: 'rocket',
		bg: '#E3F4F4',
		fg: '#0F3B47',
		accent: '#1C8C99',
		ctaBg: '#0F3B47',
		ctaFg: '#FFFFFF',
		font: "Verdana, Geneva, sans-serif"
	},
	{
		id: 'glowtrail',
		brand: 'Glowtrail',
		headline: 'Sneakers that light up every step',
		body: 'Rechargeable soles, 8 colors, one tap to switch.',
		cta: 'Shop kids’ sizes',
		art: 'sneaker',
		bg: '#111111',
		fg: '#FFFFFF',
		accent: '#FF4FA3',
		ctaBg: '#FFFFFF',
		ctaFg: '#111111',
		font: "'Arial Black', Arial, sans-serif"
	},
	{
		id: 'tinker-tiles',
		brand: 'Tinker Tiles',
		headline: 'Magnetic tiles that click into anything',
		body: 'Castles, rockets, marble runs. 120-piece starter set.',
		cta: 'Explore sets',
		art: 'tiles',
		bg: '#FFFFFF',
		fg: '#1E2A44',
		accent: '#E5484D',
		ctaBg: '#E5484D',
		ctaFg: '#FFFFFF',
		font: "Tahoma, Verdana, sans-serif"
	}
];

// Same page → same ad (so prerendered HTML matches the browser); different pages → different ads.
export function adFor(key) {
	let h = 0;
	for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return ads[h % ads.length];
}
