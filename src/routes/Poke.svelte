<script>
  import PokeCard from "./../components/PokeCard.svelte";
  import { loadPokemons, limit, offset} from "./../store.js";

  /*async function getPokemons(offset, limit) {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const data = await (await fetch(url)).json();

    return data.results;
  }*/
  let search = "";

  let limit1;
  let offset1;

  limit.subscribe((el) => {
    limit1 = el
  });

  offset.subscribe((el) => {
    offset1 = el
  });

  function clickLeft() {
      if (offset1 > 0) {
      offset.update((cval) => {
        return cval - 1
      })
    }
  }

  function clickRight() {
    offset.update((cval) => {
        return cval + 1
      })
  }
</script>

<h1 style="padding: 10px; text-align: center; font-size: 36px;">Poke</h1>

<!--{#await getPokemons(offset, limit)}
  <p>...waiting</p>
{:then pokemons}-->
  <label style="margin-left: 43.5vw;"
    >🔍<input
      bind:value={search}
      type="text"
      placeholder="search for pokemons..."
      style="border: 1px solid black; border-radius: 5px; padding: 5px;"
    /></label
  >
  <div
    class="align-middle"
    style="width: 80%; margin: auto; display: flex; justify-content: center;"
  >
    <button style="background-color:#33ccff; border-radius: 50px; text-align:center; padding: 10px;" on:click={clickLeft}>🢀</button>

    <div class="flex flex-wrap" style="justify-content: space-around;">
      <!--{#each pokemons as { name, url }, index}-->
      {#each $loadPokemons as item}
        {#if item.name.includes(search)}
        {#if item.id > limit1*offset1 && item.id < (offset1+1)*limit1}
            <div class="flex-col text-center" style="padding: 10px;">
              <!--<img
                style="background-color: lightblue; border-radius: 20px 20px 0px 0px;"
                alt="pokemon"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{offset +
                  index +
                  1}.png"
              />
              <p
                style="background-color: #003399; color: white; font-weight: bold; border-radius: 0px 0px 20px 20px;"
              >
                {item.name}
              </p>-->

              <PokeCard {item}/>

              
              
            </div>
          {/if}  
        {/if}
      {/each}
    </div>

    <button
      style="background-color:#33ccff; padding: 10px; border-radius: 20px; text-align:center;"
      on:click={clickRight}
    >
      🢂
    </button>
  </div>
<!--{:catch error}
  <p style="color: red">{error.message}</p>
{/await}-->

<!--<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap justify-center">
      {#each $loadPokemons as item, index}
        <PokeCard {item}/>
      {/each}
    </div>
  </div>
</section>-->
