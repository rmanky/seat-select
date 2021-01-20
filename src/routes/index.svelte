<script type="ts">
  let id: string = "";
</script>

<div>
  <h1 class="uppercase text-5xl font-bold mb-3">Seat Select</h1>
  <div class="bg-blue-800 p-5 rounded flex flex-col">
    <p class="font-bold text-lg">No ID was given!</p>
    <label class="mb-2 font-bold text-lg" for="id"
      >You can enter one here:</label
    >
    <div class="mx-auto flex flex-row flex-wrap gap-1">
      <input
        placeholder="Enter your ID"
        bind:value={id}
        class="mr-5 flex-shrink py-2 px-2 text-gray-800"
        name="id"
        type="text"
      />
      {#if id.length > 0}
        <a href={`/seats/${id}`} class="py-2.5 bg-green-600 font-bold">Submit</a
        >
      {:else}
        <a href="/" class="py-2.5 font-bold bg-green-600 opacity-50">Submit</a>
      {/if}
    </div>
  </div>
</div>
