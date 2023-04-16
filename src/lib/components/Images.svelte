<script lang="ts">
	import { onMount } from 'svelte'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabaseClient } from '$lib/supabaseClient'
	import {PUBLIC_SUPABASE_URL} from '$env/static/public';

	export let session: AuthSession

	let loading = false
	let images: any[] = []
	const { user } = session


	onMount(() => {
		
		if (user){

			getImages()
		}
	})

	const getImages= async () => {
		try {
			loading = true
			const { user } = session
			console.log("get images")
			 const { data, error } = await supabaseClient
				.storage
				.from('public/images')
				.list(user?.id + "/", {
					limit: 100,
					offset: 0,
					sortBy: { column: "name", order: "asc"}
				});
				console.log(data)
			if (data) {
			
				images = data;
			} else {
				alert("Ingen bilder!")
			}

		} catch {
			alert("Error loading images");
        	
		}
	}
// slifvgstyifhqavkgudr/storage/buckets/images
	const supabase_url = {PUBLIC_SUPABASE_URL} + "/storage/v1/object/public/images/";
	let imageUrl: string | null = null
	let uploading = false
	let files: FileList
	let url: string


	// const downloadImage = async (path: string) => {
	// 	try {
	// 		const { data, error } = await supabaseClient.storage.from('images').download(path)

	// 		if (error) {
	// 			throw error
	// 		}

	// 		const url = URL.createObjectURL(data)
	// 		imageUrl = url
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			console.log('Error downloading image: ', error.message)
	// 		}
	// 	}
	// }

	const uploadImage = async () => {
		try {
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${Math.random()}.${fileExt}`

			let { error } = await supabaseClient.storage.from('public/images').upload(filePath, file)
			
			if (error) {
				throw error
			}
			
	
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}

	// $: if (url) downloadImage(url)

	// async function signOut() {
	// 	try {
	// 		loading = true
	// 		let { error } = await supabaseClient.auth.signOut()
	// 		if (error) throw error
		
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			alert(error.message)
	// 		}
	// 	} finally {
	// 		loading = false
	// 	}
	// }
</script>

<form class="form-widget" >
	<div style="width: {10}em;">
		<label class="button primary block" for="single">
			{uploading ? 'Uploading ...' : 'Upload'}
		</label>
		<input
			style="visibility: hidden; position:absolute;"
			type="file"
			id="single"
			accept="image/*"
			bind:files
			on:change={uploadImage}
			disabled={uploading}
		/>
	</div>
	{#each images as image}
		<div>
		    <img src={supabase_url + user.id + "/" + image.name} alt=""/>
		</div>
	{/each}
	

	<!-- <div>
		<button class="button block" on:click={signOut} disabled={loading}> Sign Out </button>
	</div> -->
</form>
