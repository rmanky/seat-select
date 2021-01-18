<script context="module">
  let id;
  export async function load({ page }) {
    id = page.query.get("id");
  }
</script>

<script type="ts">
  import Session from "$components/Session.svelte";

  let seats, selectedSeat, session, claimedSeat;

  $: {
    if (seats) {
      const seat = seats.filter((seat) => seat.assignedTo === id)[0];
      if (seat) {
        claimedSeat = seat.seatNumber;
      }
      console.log(seats);
    }
  }

  $: {
    if (selectedSeat) {
      const checkSelected = seats[selectedSeat - 1].assignedTo;
      if (checkSelected != "" && checkSelected != id) {
        selectedSeat = false;
      }
    }
  }

  let radioGroup = [];

  function attemptSelect(_seatNum) {
    if (!seats[_seatNum - 1].assignedTo) {
      selectedSeat = _seatNum;
    }
  }

  function claimSeat() {
    session.claimSeat(selectedSeat, id);
    selectedSeat = false;
  }

  function changeSeat() {
    session.changeSeat(claimedSeat, selectedSeat, id);
    selectedSeat = false;
  }
</script>

<div>
  {#if id}
    <Session bind:this={session} bind:seats />
    <h1 class="uppercase text-5xl font-extrabold mb-3">Seat Select</h1>
    <div class="text-xl mb-4">
      {#if seats}
        <p>~ {id} ~</p>
        <p>Please <b>select</b> and <b>confirm</b> a seat.</p>
      {:else}
        <p>Hang tight, fetching seats...</p>
      {/if}
    </div>
    {#if seats}
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div
          class="col-span-2 p-3 rounded bg-gray-800 border-solid border-2 border-gray-700"
        >Altar</div>

        {#each seats as { seatNumber, assignedTo }}
          <label
            class="{assignedTo == ''
              ? seatNumber == selectedSeat
                ? 'bg-green-600'
                : 'bg-gray-600'
              : assignedTo == id
              ? 'bg-blue-600'
              : 'bg-red-600'} p-3 rounded cursor-pointer">
            Seat #{seatNumber}
            <input
              type="radio"
              class="appearance-none"
              bind:group={radioGroup}
              on:click={() => attemptSelect(seatNumber)}
            />
          </label>
        {/each}
      </div>
      {#if claimedSeat && selectedSeat}
        <button on:click={() => changeSeat()} class="bg-green-600"
          >Change Seat</button
        >
      {:else if selectedSeat}
        <button on:click={() => claimSeat()} class="bg-green-600"
          >Confirm</button
        >
      {/if}
      <a href="/admin" class="hidden" target="_blank">Admin Login</a>
    {:else}
      <i class="fas fa-spinner text-5xl animate-spin" />
    {/if}
  {:else}
    <h1 class="uppercase text-5xl font-bold mb-3">Seat Select</h1>
    <div class="bg-yellow-400 rounded text-black">
      <p class="text-2xl">⚠⚠⚠</p>
      <p class="text-xl">
        This link appears to be invalid. There is no <b>id</b>!
      </p>
      <p class="text-2xl">⚠⚠⚠</p>
    </div>
  {/if}
</div>

<style lang="postcss">
  div {
    @apply text-center;
  }
</style>
