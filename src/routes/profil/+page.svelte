<script>
	import { page } from '$app/stores'
	import Account from '../../lib/components/Account.svelte'
	import Auth from '../../lib/components/Auth.svelte'
    import { goto } from '$app/navigation';
</script>

{#if !$page.data.session}
	{goto("/login")}
{:else}
	<Account session={$page.data.session} />
{/if}
