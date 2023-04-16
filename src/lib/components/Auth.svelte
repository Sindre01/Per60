<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient'

	let loading = false
	let email: string
	let password: string
	

	const handleLogin = async () => {
		try {
			console.log("Login")
			loading = true
			const { data, error } = await supabaseClient.auth.signInWithPassword({
				email: email,
				password: password,
			})
			if (error) throw error
		
			console.log(data)

		} catch (error) {
			console.log(error)
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			loading = false
			
		}
	}
		const handleSignUp = async () => {
		try {
			console.log("Login")
			loading = true
			const { data, error } = await supabaseClient.auth.signUp({
				email: email,
				password: password,
			})
			if (error) throw error
			// alert("Sjekk mailen din")
			console.log(data)
			
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
		<h1 class="header">Per 60 år</h1>

		<p class="description">Logg inn for å være med på festen</p>
		<div>
			<input class="inputField" placeholder="Brukernavn" bind:value={email} />
			<input class="inputField" placeholder="Passord" bind:value={password} />
		</div>
		<div>
			<button class="button block" disabled={loading} on:click={handleLogin}> {loading ? 'Loading' : 'Logg inn'} </button>
			<!-- <button class="button block" disabled={loading} on:click={handleSignUp}> {"Registrer ny bruker"} </button> -->
		
	
			
		</div>
	</div>
</div>
