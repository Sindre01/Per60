<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import './styles.css'

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			subscription.unsubscribe()
		}
	})
</script>

<div class="container" >
	<slot />
</div>

<style>
	.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	margin-right: auto;

}
</style>
