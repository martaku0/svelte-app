<script>
    export let item;
</script>

<div class="flex-col text-center" style="padding: 10px;">
    <img
      style="background-color: lightblue; border-radius: 20px 20px 0px 0px;"
      alt={item.name}
      src={item.img}
    />
    <p
      style="background-color: #003399; color: white; font-weight: bold;"
    >
      {item.name}
    </p>
    <div class="text-center" style="background-color: #003333; color: white; font-weight: bold; border-radius: 0px 0px 20px 20px;">
        <a href="/pokemon/{item.id}" style="font-size: 12px;">Learn more</a>
    </div>
</div>