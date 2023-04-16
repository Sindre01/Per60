<script>
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Auth from '../../lib/components/Auth.svelte'
</script>

<svelte:head>
	<title>Per 60 år</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	{goto("/home")}
{/if}
