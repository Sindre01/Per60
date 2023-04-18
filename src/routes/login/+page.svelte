<script>
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import Auth from '../../lib/components/Auth.svelte'

	onMount(() => {
	
        if ($page.data.session){
            goto("/home")
        } 
	})
	$: if ($page.data.session){
		goto("/home")
	} 

</script>

<svelte:head>
	<title>Per 60 år</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{/if}



