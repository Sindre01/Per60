<script>
	import { page } from '$app/stores'
	import Images from '../../lib/components/Images.svelte'
    import { goto } from '$app/navigation';
</script>

{#if !$page.data.session}
	{goto("/login")}
{:else}
	<Images session={$page.data.session} />
{/if}

