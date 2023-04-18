<script lang="ts">
	import { goto } from '$app/navigation'
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
			goto("/home")

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
	<div class="col-6 form-widget login">
		<h1 class="header">Per 60 år <span style='font-size:50px;'>&#127881;</span></h1>

		<p class="description">Logg inn for å bidra med bilder</p>
		<div>
			<input class="" placeholder="Brukernavn" bind:value={email} />
			<input class="" placeholder="Passord" bind:value={password} />
		</div>
		<div>
			<button class="button block" disabled={loading} on:click={handleLogin}> {loading ? 'Loading' : 'Logg inn'} </button>
			<!-- <button class="button block" disabled={loading} on:click={handleSignUp}> {"Registrer ny bruker"} </button> -->
		
	
			
		</div>
	</div>
</div>
<style>
	.login {
		/* background-color: #ffffff; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		backdrop-filter: blur(6px);
		background-color: rgba(0, 0, 0, 0.767);
		border-radius: 5%;
		margin-top: 10vh;
		padding:10px;
	}
	
</style>