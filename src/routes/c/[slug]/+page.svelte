<script>
	import Browser from '$lib/components/Browser.svelte';
	let { data } = $props();
</script>

<svelte:head><title>{data.category.name} games · Coolmath Games redesign</title></svelte:head>

{#key data.category.slug}
	<Browser title="{data.category.name} games" description={data.category.blurb} list={data.list} current={data.category.slug} color={data.category.color} />
{/key}
