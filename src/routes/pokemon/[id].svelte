<script context="module">
    export async function load({ page }) {
        const id = page.params.id;
        return id;
    }
</script>

<script>
    export let id;

    async function getPokemons(id){
        let url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let data = await( await fetch(url)).json();
        console.log(data)
        return data;
    }
    $: test = getPokemons(id);
    
</script>

<div>
    {#await getPokemons(id)}
    <p>...</p>
    {:then pkm} 
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png" alt="{id}">
    <p>Id: {pkm.id}</p> 
        <p>Name: {pkm.name}</p>
        <p>Height: {pkm.height}</p>
        <p>Abilities:    
        {#each pkm.abilities as ab}
            {ab.ability.name},&#160;
        {/each} 
        </p>  
        <p>Moves:    
            {#each pkm.moves as mv}
                {mv.move.name},&#160;
            {/each} 
        </p> 
    {/await}
</div>