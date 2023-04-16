<script>
	import { page } from '$app/stores'
	import Images from '../../lib/components/Images.svelte'
    import { goto } from '$app/navigation';
</script>
{console.log($page.data.session)}
{#if !$page.data.session}
	{goto("/login")}
{:else}
	{console.log("images")}
	<Images session={$page.data.session} />
{/if}
