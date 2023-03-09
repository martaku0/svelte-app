<script>
  async function getSomething() {
    const res = await fetch(
      `https://official-joke-api.appspot.com/random_joke`
    );
    const text = await res.text();

    if (res.ok) {
      return text;
    } else {
      throw new Error(text);
    }
  }

  let promise = getSomething();

  function handleClick() {
    promise = getSomething();
  }
</script>

<h1 style="padding: 10px; text-align: center; font-size: 36px;">Await</h1>

<button
  style="background-color:lightblue; padding: 5px; border-radius: 10px;"
  on:click={handleClick}
>
  generate
</button>

{#await promise}
  <p>...waiting</p>
{:then something}
  <p>{something}</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
