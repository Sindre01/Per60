<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'
    
    let route = $page.data.session ? "home" : "login"
 
</script>

<div class ="main">
    <button class = "buttonSend button primary" on:click={() =>goto("/" + route)}>
        <p>Send inn bilder</p>
    </button>
</div>

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
