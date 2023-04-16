<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'
    
    let route = $page.data.session ? "home" : "login"
 
</script>

<div >
    <button class = "button" on:click={() =>goto("/" + route)}>
        <p>Send inn bilder</p>
    </button>
</div>

<style>
    .button {
        position: absolute;
        top: 40vh;
        left: 40vw;
    }
</style>
