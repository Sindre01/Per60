<script>
    /**
	 * @type {any}
	 */
     export let images; 
</script>
<div>
    {#each images as image, i}
        <div >
            <img loading="eager" style = " margin: 0px;" class = "image" src={image} alt=""/>
        </div>
    {/each}
</div>