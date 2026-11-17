// Guest data lives on this device (localStorage). No login wall: saving always works,
// and the UI says up front where it's saved.
import { browser } from '$app/environment';

function load(key, fallback) {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function save(key, value) {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* storage blocked: keep working in memory */
	}
}

export const store = $state({
	favorites: [], // slugs, newest first
	recent: [], // [{slug, at, best}] newest first
	toasts: [],
	ready: false
});

export function initStore() {
	if (store.ready) return;
	store.favorites = load('cm.favorites', []);
	store.recent = load('cm.recent', []);
	store.ready = true;
}

export function isFavorite(slug) {
	return store.favorites.includes(slug);
}

export function toggleFavorite(slug, title) {
	if (isFavorite(slug)) {
		store.favorites = store.favorites.filter((s) => s !== slug);
		save('cm.favorites', store.favorites);
		toast(`Removed ${title} from favorites`, { undo: () => addFavorite(slug) });
	} else {
		addFavorite(slug);
		toast(`Saved ${title} to favorites on this device`, {
			detail: 'No account needed. Sign up free to see favorites on other computers too.',
			undo: () => {
				store.favorites = store.favorites.filter((s) => s !== slug);
				save('cm.favorites', store.favorites);
			}
		});
	}
}

function addFavorite(slug) {
	if (!store.favorites.includes(slug)) store.favorites = [slug, ...store.favorites];
	save('cm.favorites', store.favorites);
}

export function recordPlay(slug, score) {
	const prev = store.recent.find((r) => r.slug === slug);
	const best = Math.max(prev?.best ?? 0, score ?? 0);
	store.recent = [{ slug, at: Date.now(), best }, ...store.recent.filter((r) => r.slug !== slug)].slice(0, 12);
	save('cm.recent', store.recent);
}

export function clearRecent() {
	const old = store.recent;
	store.recent = [];
	save('cm.recent', []);
	toast('Cleared your play history', {
		undo: () => {
			store.recent = old;
			save('cm.recent', old);
		}
	});
}

let nextId = 1;
export function toast(message, { detail = '', undo = null } = {}) {
	const id = nextId++;
	store.toasts = [...store.toasts, { id, message, detail, undo }];
	setTimeout(() => dismissToast(id), detail ? 6500 : 4000);
}
export function dismissToast(id) {
	store.toasts = store.toasts.filter((t) => t.id !== id);
}

export function timeAgo(ms) {
	const s = Math.round((Date.now() - ms) / 1000);
	if (s < 60) return 'just now';
	const m = Math.round(s / 60);
	if (m < 60) return `${m} min ago`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h} hr ago`;
	const d = Math.round(h / 24);
	return d === 1 ? 'yesterday' : `${d} days ago`;
}
