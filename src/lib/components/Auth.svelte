<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient'
	import type { Provider } from '@supabase/supabase-js';

	let loading = false
	let providerLoading = false
	let email: string

	const providerLogin = async (provider : Provider) => {
		try{
			console.log("provider")
			providerLoading = true
			const { data, error } = await supabaseClient.auth.signInWithOAuth({provider: provider});
			if (error) throw error

		}  catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			providerLoading = false
			
		}
	}
	const handleLogin = async () => {
		try {
			console.log("Login")
			loading = true
			const { error } = await supabaseClient.auth.signInWithOtp({ email })
			if (error) throw error
			alert("Sjekk mailen din")
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			loading = false
			
		}
	}


</script>

<div class="row flex-center flex" >
	<div class="col-6 form-widget">
		<h1 class="header">Supabase + SvelteKit</h1>
		<p class="description">Sign in via magic link with your email below</p>
		<div>
			<input class="inputField" type="email" placeholder="Your email" bind:value={email} />
		</div>
		<div>
			<button class="button block" disabled={loading} on:click={handleLogin}> {loading ? 'Loading' : 'Send magic link'} </button>
		
			<button on:click={() => providerLogin("google")} disabled={providerLoading} >{providerLoading ? 'Loading' : 'Google'}</button> 
			
		</div>
	</div>
</div>
