<script lang="ts">
	import { onMount } from 'svelte'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabaseClient } from '$lib/supabaseClient'
	// import { env } from '$env/dynamic/public';
	import {PUBLIC_SUPABASE_URL} from '$env/static/public';
	import JSZip from "jszip";
	import { saveAs } from 'file-saver';
	export let session: AuthSession

	let loading = false
	let images: any[] = []
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
			loading = true
			const { user } = session
			console.log("get images")
			 const { data, error } = await supabaseClient
				.storage
				.from('images')
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
			console.log("upload image")
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
			const fileExt = file.name.split('.').pop()
			const filePath = `${Math.random()}.${fileExt}`
			console.log(filePath)
			let { data, error } = await supabaseClient.storage.from('images').upload(user?.id + "/" + filePath, file)
			console.log(data)
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
		async function signOut() {
		try {
			loading = true
			let { error } = await supabaseClient.auth.signOut()
			if (error) throw error
		
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			loading = false
		}
	}

</script>
<div>
	<!-- <h1>Bilder</h1> -->
	<div class="form-widget" >
		<div style="width: {10}em;" on:click={downloadZip}>
			<p class="button primary block">Last ned alle bilder</p>
		</div>
	</div>

	<div class ="images"> 
		{#each images as image}
			<div >
				<img loading="lazy" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
			</div>
		{/each}

	</div>
	<div class="button primary block" on:click={signOut}>Logg ut</div>
	
		<div class="form-widget addButton" >
			<div style="width: {10}em;">
				<label class="button primary block" for="single">
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
	
</div>

<style>
	@media only screen and (min-width: 601px) {
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
	.images{
		margin-bottom: 50px;
	}

	.buttons{
		display: flex;
		flex-direction: row;
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

