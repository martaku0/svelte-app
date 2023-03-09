<script>
  let selectedX, selectedY;
  let tablica = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<h1 style="padding: 10px; text-align: center; font-size: 36px;">Board</h1>

<select bind:value={selectedX}>
  {#each tablica as i}
    <option>{i}</option>
  {/each}
</select>

<select bind:value={selectedY}>
  {#each tablica as i}
    <option>{i}</option>
  {/each}
</select>

<p>Wybrano X = {selectedX}, Y = {selectedY}</p>

{#each { length: selectedX } as x}
  <div class="row" style="display:flex;">
    {#each { length: selectedY } as y}
      <img src="./src/assets/svelte.png" alt="" style="width: 100px;" />
    {/each}
  </div>
{/each}
