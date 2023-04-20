<script>
	import { page } from '$app/stores'
	import Images from '../../lib/components/Images.svelte'
    import { goto } from '$app/navigation';
	import { onMount } from 'svelte'

	onMount(() => {
	
        if (!$page.data.session){
            goto("/login")
        } 
	})

</script>

{#if $page.data.session}
	<Images session={$page.data.session} />
{/if}

