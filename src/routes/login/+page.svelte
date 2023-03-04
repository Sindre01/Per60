<script>
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Account from '../../lib/components/Account.svelte'
	import Auth from '../../lib/components/Auth.svelte'
</script>

<svelte:head>
	<title>Supabase + SvelteKit</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<Auth/>
