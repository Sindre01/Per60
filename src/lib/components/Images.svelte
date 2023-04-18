<script lang="ts">
	import { onMount } from 'svelte'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabaseClient } from '$lib/supabaseClient'
	import {PUBLIC_SUPABASE_URL} from '$env/static/public';
	import JSZip from "jszip";
	import { saveAs } from 'file-saver';
	import Download from "svelte-material-icons/Download.svelte";
	import ImagePlus from "svelte-material-icons/ImagePlus.svelte";
	import Logout from "svelte-material-icons/Logout.svelte";

	export let session: AuthSession
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
			const { user } = session
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
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}

			const file = files[0]
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
			<p style ="color: black; font-weight:  500;">Laster inn bilder.. </p>
			<img class = "image" src = "/PerMisterLua.gif" alt="">
		</div>
	{:else}

		<!-- <h1>Bilder</h1> -->
		<div class="form-widget" >
			<button class="download" on:click={downloadZip}>
				Last ned alle bilder <div style = "display: flex; margin-left: 10px"><Download color = "black" size = "2em"/></div>
			</button>
		</div>

	{#if noImages}
		<div class = "loadingScreen">
			<!-- <p style ="color: black;">Legg til bilder  </p> -->
			<img class = "image" src = "/PerMisterLua.gif" alt="">
		</div>
	{:else}
		<div class ="images"> 
				{#each images as image, i}
					<div >
						{#if i > 2}
						<!-- {console.log("lazy on" + image.name)} -->
							<img loading="lazy" style = " margin: 0px;" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
						{:else}
							<!-- {console.log("eager on" + image.name)} -->
							<img loading="eager" style = " margin: 0px;" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
						{/if}
					</div>
				{/each}
		</div>

	{/if}
	
	
	<div class="form-widget addButton " >
		<div style="">
			<label class="button primary upload" style = "padding: 20px;"for="single">
				{uploading ? 'Laster opp ...' : 'Legg til bilde' } <div style = "display: flex; margin-left: 10px"><ImagePlus color ="black" size ="1.5em" /> </div>
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

<button class="logout" on:click={signOut}>Logg ut <div style = "display: flex; margin-left: 10px"><Logout color ="black" size ="1.5em" /> </div></button>
</div>
<style>
	.icon {
		padding-left:5px;
	}
	.logout {
		display: flex;
		justify-content: center;
		align-items:center;
		width: 100%;
		background-color: #fb3232;
		border: 1px solid rgb(244, 39, 39);
		font-weight:  500;
		color:black;
		margin: 10px;
	}
	.logout:hover {	
		/* outline-style:solid; */
		background-color: #f34c4c;
	}
	.download {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgb(172, 211, 255);
		border: 1px solid rgb(16, 140, 241);
		color: black;
		font-weight:  500;
		margin: 10px;
		
		/* position: fixed;
		top: 0px; */
		/* right: 10px; */
		
	
	}
	.download:hover {
	outline-style:solid;
	background-color: rgb(172, 211, 255);
}

	.upload {
		color: black;
		display: flex;
		align-items: center;
		background-color: #3ef6b3;
		font-weight:  500;
		/* background-color: #44aff7;
		border: 1px solid rgb(16, 140, 241); */
	}
	.upload:hover {
	/* outline-style:solid; */
	background-color: #97e7a7;
}
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
		/* border: solid rgb(172, 211, 255); */

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




</style>

