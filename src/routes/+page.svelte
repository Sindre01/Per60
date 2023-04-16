<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
    
    // let route = $page.data.session ? "home" : "login"
    onMount(() => {
		
        // route = $page.data.session ? "home" : "login"
        if ($page.data.session){
            goto("/home")
        } else {
            goto("/login")
        }
	})
 
</script>

<!-- <div class ="main">
    <button class = "buttonSend button primary" on:click={() =>goto("/" + route)}>
        <p>Send inn bilder</p>
    </button>
</div> -->

<style>
    .main {
        z-index: 2;
        height: 100%;
        width: 100%;
        background-color: coral
    }
    .buttonSend {
        position: absolute;
        top: 40vh;
        left: 32vw;
    }
</style>
