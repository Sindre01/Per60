<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'
    
    let route = $page.data.session ? "profil" : "login"
 
</script>
<div>
    <button on:click={() =>goto("/" + route)}>
        {route}
    </button>
</div>
