<script lang="ts">
	import { onMount } from 'svelte'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabaseClient } from '$lib/supabaseClient'
	import {PUBLIC_SUPABASE_URL} from '$env/static/public';
	import JSZip from "jszip";
	import { saveAs } from 'file-saver';
	import Download from "svelte-material-icons/Download.svelte";
	import FitToScreen from "svelte-material-icons/FitToScreen.svelte";
	import Refresh from "svelte-material-icons/Refresh.svelte";
	import PresentationPlay from "svelte-material-icons/PresentationPlay.svelte";
	import ImagePlus from "svelte-material-icons/ImagePlus.svelte";
	import Logout from "svelte-material-icons/Logout.svelte";
	import { goto } from '$app/navigation'
	import { SyncLoader} from 'svelte-loading-spinners';
	import { Circle} from 'svelte-loading-spinners';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';

	export let session: AuthSession
	let images: any[] = []
	let showSlider = false
	// let loadingAllImages = true;
	// $: loadingAllImages = images.length == 0 ? true : false;

	let noImages = false;
	const { user } = session
	const supabase_url = PUBLIC_SUPABASE_URL + "/storage/v1/object/public/images/";
	console.log(supabase_url)
	let uploading = false
	let downloading = false;
	let files: FileList
	let playingLoadingScreen = true
	let newPassword = "";

	onMount(() => {
		if (user){
			getImages()
		}
	})
	let timerID = setInterval(function() { //Update imagages every 1 minute if in presentation mode
			getImages()
		}, 60 * 1000); // 60 * 1000 milsec

	$: if (!showSlider) {
		clearInterval(timerID)
	} else {
		timerID = setInterval(function() { //Update images every 1 minute if in presentation mode
			console.log("interval")
			getImages()
		}, 60 * 1000); // 60 * 1000 milsec
	}

	const getImages= async () => {
		noImages = true;
		try {
		
			playingLoadingScreen = true
			const { user } = session
			 const { data, error } = await supabaseClient
				.storage
				.from('images')
				.list(user?.id + "/", {
					limit: 2000,
					offset: 0,
					sortBy: { column: "created_at", order: "desc"}
				});
			// console.log(data)
			if (error) throw error
			
			if (data.length > 0 && data[0].name != ".emptyFolderPlaceholder") {
				console.log("Fetched " + data.length + " images")
				images = data.filter((image) => image.name != ".emptyFolderPlaceholder");
				noImages = false;
				if (!showSlider) {
					setTimeout(function() {
						// console.log("loading timeout")
						playingLoadingScreen = false
					}, 3000);
				} else {
					playingLoadingScreen = false;
				}
				
			} else {
				// console.log("No images")
				alert("Ingen bilder!")
				noImages = true;
				playingLoadingScreen = false;
				images = []
        	
			}

		} catch {
			alert("Feil ved lasting av bilder");
			
		}
	}


	const downloadZip = async () => {
		downloading = true
		try {
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

			
       } catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			setTimeout(function() {
				downloading = false;
				console.log("downloading timeout")
			}, 5000);
		}
	}
	

	const uploadImage = async () => {
		uploading = true
		try {

			if (!files || files.length === 0) {
				throw new Error('Du må velge et bilde å laste opp.')
			} else if (files.length > 10) {
				throw new Error('Kan ikke laste opp flere enn 10 bilder om gangen.')
			}

			console.log(files);
			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				const name = new Date().toISOString()
	
				console.log(name)
				let { data, error } = await supabaseClient.storage.from('images').upload(user?.id + "/" + name, file)
				// console.log(data)
				if (error) {
					throw error
				}
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
			else {goto("/")}
			
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			// loading = false
		}
	}
	const resetPassword = async () => {
		try {
			// loading = true
			let { error } = await supabaseClient.auth.updateUser({password: newPassword})
			if (error) throw error
			
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			// loading = false
		}
	}

let fillSlider=false;
</script>
<svelte:head>
	<link rel="preload" as="video" href="/PerMisterLua.mp4"/>
</svelte:head>

<div class = "main">
	{#if showSlider}
	<div class = "slider-background">
		<div class ="sliderButtons">
			<button class = "sliderButtonInside" on:click={() => fillSlider = !fillSlider}>
				<FitToScreen size="30"  />
			</button>
			<button class = "sliderButtonInside" on:click={getImages}>
				{#if noImages}
					<Circle size="30"/> 
				{:else}
					<Refresh size="30"  />
				{/if}
			</button>

		</div>
		<Splide options={ { 
				rewind  : true,
				autoplay: true,
				arrows  : true,
				perPage : 1,
				// start: Math.floor(Math.random() * images.length),
				trimSpace : true,
				interval: 10000, //5sek,
				pagination: (images.length < 100)
				} 
				} hasTrack={ false } 
				aria-label="My Favorite Images">
				  <SplideTrack >
					  {#each images as image, i}
					  <SplideSlide >
							<div class="center"> 
							  	<img  class:slider = "{!fillSlider}" class:fillSlider = "{fillSlider}" src={supabase_url + user.id + "/" + image.name} alt=""/>
							</div>
						  </SplideSlide>
					  {/each}
				  </SplideTrack>
			<!-- <Slider images = {images.map((image)=> supabase_url + user.id + "/" + image.name)}/> -->
		</Splide>
	</div>
	{:else}
		<div class:disableScroll = "{playingLoadingScreen}" >
				{#if playingLoadingScreen}
					<div class = "loadingScreen container"  class:hidden = "{!playingLoadingScreen}">
						<div class = "loading" >Laster inn bilder <div style = "display: flex; margin-left: 10px"><SyncLoader size="40" color=" #001eff" unit="px" duration="1s" /></div></div>
						<video class = "loadingVideo" autoplay={true} loop={true} muted defaultMuted playsinline preload="auto">
							<source src="PerMisterLua.mp4" type ="video/mp4">>
						</video>
					</div>
				{/if}
				<div style="" class = "container" class:hidden = "{playingLoadingScreen}" >
					<!-- <h1>Bilder</h1> -->
					<!-- <div class="form-widget" >
						<input class="" placeholder="nytt passord" bind:value={newPassword} />
						<button class="" on:click={resetPassword}>Reset passord </button>
					</div> -->
					<div class="form-widget" >
						<button class="download sliderButton" on:click={() => showSlider = true}>Presentasjon <div style = "display: flex; margin-left: 10px"><PresentationPlay size="30"  color="black" /> </div></button>
					</div>
					<div class="form-widget" >
						
							{#if downloading} 
								<button class="download" >Laster ned <div style = "display: flex; margin-left: 10px"><Circle size="30" color=" #001eff" unit="px" duration="1s" /> </div></button>
							{:else}
								<button class="download" on:click={downloadZip}> Last ned alle bildene <div style = "display: flex; margin-left: 10px"><Download color = "black" size = "2em"/> </div> </button>
							{/if}
							
					
					</div>
					<div class ="images"> 		
					
						{#each images as image, i}
						
							<div >
								{#if i < 2}
								<!-- {console.log("lazy on" + image.name)} -->
									<img loading="eager" style = " margin: 0px;" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
								{:else}
									<!-- {console.log("eager on" + image.name)} -->
									<img loading="lazy" style = " margin: 0px;" class = "image" src={supabase_url + user.id + "/" + image.name} alt=""/>
								{/if}
							</div>
							
						{:else}
				
							<div class = "loadingScreen">
								<!-- <p style ="color: black;">Legg til bilder  </p> -->
								<img loading = "eager" class = "image" src = "/PerMisterLua.gif" alt="">
							</div>
						{/each}
					</div>
				
			
				
				
					<div class="form-widget addButton " >
						<div style="">
							<label class="button primary upload" style = "padding: 20px;"for="many">
								{#if uploading}
									Laster opp bilder <div style = "display: flex; margin-left: 10px"><Circle size="30" color=" #001eff" unit="px" duration="1s" /> </div>
								{:else}
									Legg til bilder <div style = "display: flex; margin-left: 10px"><ImagePlus color ="black" size ="1.5em" /> </div>
								{/if}
								
							</label>
							
							<input
								style="visibility: hidden; position:absolute;"
								type="file"
								id="many"
								multiple
								accept="image/*"
								bind:files
								on:change={uploadImage}
								disabled={uploading}
							/>
						</div>
					</div>
				</div>

				<button class="logout" on:click={signOut}>Logg ut <div style = "display: flex; margin-left: 10px"><Logout color ="black" size ="1.5em" /> </div></button>
				
			</div>
	{/if}
	

</div>

<style>
	.fillSlider {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 99vh; /* Fallback for browsers that do not support Custom Properties */
  		height: calc(var(--vh, 1vh) * 100);
		width: 100vw;
		object-fit: cover;

	}
	.sliderButtons {
		position:absolute;
		background-color: rgba(0, 0, 0, 0.422);
		z-index: 1;
	}
	.sliderButtonInside{
		background: none; 
		border: none;
	}
	.sliderButtonInside:hover{
		Background-color: "red";
	}

	.center {
		display: flex;
		place-content: center;
		align-items: center;
	}
	.sliderButton{
		display: flex;
		background-color: rgb(108, 165, 240)!important;
		align-items: center;
		justify-content: center;
		/* visibility: hidden; */
	}
	.slider-background{
		background-color: rgba(0, 0, 0, 0.747);
		justify-content: center;
	}
	.slider{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 99vh; /* Fallback for browsers that do not support Custom Properties */
  		height: calc(var(--vh, 1vh) * 100);
		width: 100vw; 
		object-fit: cover;
	}
	.hidden {
		visibility: hidden;
		
	}
	.disableScroll {
		max-height: 100vh;
		overflow: hidden
		
	}
	.main {
		background-color: rgba(0, 0, 0, 0.348);
		width: 100vw;
	}
	.logout {
		display: flex;
		justify-content: center;
		align-items:center;
		background-color: #fb3232;
		border: 1px solid rgb(244, 39, 39);
		font-weight:  500;
		color:black;
		margin: 10px;
		padding: 10px;
		/* position: fixed;
		bottom: 0px;
		left: 0px; */
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
		/* outline-style:solid 4px rgb(4, 135, 243); */
		background-color: rgb(212, 228, 246);
	}	
	.loadingVideo {
		height: 99vh; /* Fallback for browsers that do not support Custom Properties */
  		height: calc(var(--vh, 1vh) * 100);
		width: 100vw;
		object-fit: cover;
	}
	.loading {
		position: absolute;
		top:10%;
		display: flex;
		align-items: center;
		width: 100%;
		
		justify-content: center;
		background-color: rgba(172, 211, 255, 0.755);
		color: black;
		font-weight:  500;
		/* margin: 10px; */
		/* border-radius: 10px; */
	}
		.loadingScreen {
		position:relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* background: #becef6; */
		color: black;
		border-radius: 20px;
		z-index: 1;
		height: 99vh; /* Fallback for browsers that do not support Custom Properties */
  		height: calc(var(--vh, 1vh) * 100);
		/* background: url("/PerMisterLua.gif") no-repeat center;
		background-size: cover; */
		/* width: 100%; */
		/* background-color: white; */
		/* margin-bottom: 10px; */
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
		.loadingVideo {
			width: 100%;
		}
		.sliderButton {
			visibility: visible;
		}
		.slider {
			width: auto;
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
	@media only screen and (orientation:landscape) {
		.image{
			height: 90vh;
			object-fit: cover;
		}


	}

	.images{
		/* margin-bottom: 50px; */
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

