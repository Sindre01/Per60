<script lang="ts">
	import { onMount } from 'svelte'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabaseClient } from '$lib/supabaseClient'
	// import { env } from '$env/dynamic/public';
	import {PUBLIC_SUPABASE_URL} from '$env/static/public';
	import JSZip from "jszip";
	import { saveAs } from 'file-saver';

	export let session: AuthSession
	// let loading = false
	let images: any[] = []
	$: loadingAllImages = images.length == 0 ? true : false;
	let noImages = false;
	const { user } = session
	const supabase_url = PUBLIC_SUPABASE_URL + "/storage/v1/object/public/images/";
	console.log(supabase_url)
	let uploading = false
	let files: FileList



	onMount(() => {
		if (user){
			getImages()
		}
	})

	const getImages= async () => {
		try {
			// loading = true
			// loadingAllImages = true
			const { user } = session
			// console.log("get images")
			 const { data, error } = await supabaseClient
				.storage
				.from('images')
				.list(user?.id + "/", {
					limit: 1000,
					offset: 0,
					sortBy: { column: "created_at", order: "desc"}
				});
				console.log(data)
			if (error) throw error

			if (data.length > 0 && data[0].name != ".emptyFolderPlaceholder") {
				console.log("Fetched all images")
				images = data;
				noImages = false
			} else {
				console.log("No images")
				// alert("Ingen bilder!")
				noImages = true;
        	
			}

		} catch {
			alert("Feil ved lasing av bilder");
			
		}
	}


	const downloadZip = async () => {
		/* Create a new instance of JSZip and a folder named 'collection' where*/
		/* we will be adding all of our files*/
		let zip = new JSZip();
		let folder : JSZip | null = zip.folder('Per60år');
		if (folder != null){
			images.forEach((image) => {
				const imageUrl = supabase_url + user.id + "/" + image.name;

				const blobPromise = fetch(imageUrl).then(r => {
					if (r.status === 200) return r.blob()
					return Promise.reject(new Error(r.statusText))
				})
				const name = imageUrl.substring(imageUrl.lastIndexOf('/')+1)
				folder!.file(name, blobPromise)
				
			})
		zip.generateAsync({type:"blob"})
				.then(blob => saveAs(blob, "Per60år.zip"))
				.catch(e => console.log(e));

		}
	}
	

	const uploadImage = async () => {
		try {
			// console.log("upload image")
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
			// const fileExt = file.name.split('.').pop()
			// const randomId = `${Math.random()}.${fileExt}`
			// console.log(randomId)
			const name = new Date().toISOString()

			console.log(name)
			let { data, error } = await supabaseClient.storage.from('images').upload(user?.id + "/" + name, file)
			// console.log(data)
			if (error) {
				throw error
			}
			console.log("uploaded image")
			getImages()
			
	
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}
		async function signOut() {
		try {
			// loading = true
			let { error } = await supabaseClient.auth.signOut()
			if (error) throw error
		
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			// loading = false
		}
	}

</script>
<div style="margin-bottom: 100px">

	{#if loadingAllImages && !noImages}
		<div class = "loadingScreen">
			<p style ="color: black;">Laster inn bilder.. </p>
			<img class = "image" src = "/PerMisterLua.gif" alt="">
		</div>
	{:else}

		<!-- <h1>Bilder</h1> -->
		<div class="form-widget" >
			<div style="width: {10}em;" on:click={downloadZip}>
				<p class="button primary block">Last ned alle bilder</p>
			</div>
		</div>

	{#if noImages}
		<div class = "loadingScreen">
			<!-- <p style ="color: black;">Legg til bilder  </p> -->
			<img class = "image" src = "/PerMisterLua.gif" alt="">
		</div>
	{:else}
		<div class ="images"> 
				{#each images as image}
					<div >
						<img loading="lazy" style = " margin: 0px;" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
					</div>
				{/each}
		</div>

	{/if}
	
	
	<div class="form-widget addButton" >
		<div style="width: {10}em;">
			<label class="button primary block" style = "padding: 20px;"for="single">
				{uploading ? 'Laster opp ...' : 'Last opp bilde'}
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
	</div>

{/if}

<div class="button primary block" on:click={signOut}>Logg ut</div>
</div>
<style>
	@media only screen and (min-width: 1001px) {
		.image{
			width: 25vw;
			object-fit: cover;
		}
	}
	@media only screen and (min-width: 601px) and (max-width: 1000px){
		.image{
			width: 50vw;
			object-fit: cover;
		}
	}
	@media only screen and (max-width: 600px) {
		.image{
			width: 90vw;
			object-fit: cover;
			
		}
	}
	.loadingScreen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #becef6;
		color: black;
		border-radius: 20px;
		margin-bottom: 10px;
	}
	.images{
		margin-bottom: 50px;
	}

	.addButton{
		position: fixed;
		bottom: 0px;
		right: 10px;
		
	}
	.form-widget {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.form-widget>.button {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background-color: #444444;
	text-transform: none !important;
	transition: all 0.2s ease;
}

.form-widget .button:hover {
	background-color: #2a2a2a;
}

.form-widget .button>.loader {
	width: 17px;
	animation: spin 1s linear infinite;
	filter: invert(1);
}

</style>

