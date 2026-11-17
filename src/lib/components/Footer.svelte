<script>
	import { base } from '$app/paths';
</script>

<footer>
	<div class="wrap">
		<p>
			<b>An unofficial student redesign concept</b> of Coolmath Games by Tyler Beck and Colin Hill, built for CS 5167 at the
			University of Cincinnati. Not affiliated with Coolmath Games. Game names and artwork are placeholders.
		</p>
		<p><a href="{base}/about/">What we changed and why</a></p>
	</div>
</footer>

<style>
	footer {
		margin-top: 72px;
		background: var(--bar);
		padding: 28px 0 96px;
		font-size: 0.95rem;
		color: var(--text-soft);
	}
	p {
		max-width: 72ch;
		margin: 0 0 8px;
	}
	b {
		color: var(--text);
	}
	a {
		font-weight: 700;
	}
</style>
