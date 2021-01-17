<script type="ts">
  let name = "Robear";

  enum SeatStatus {
    Empty,
    Reserved,
    Selected,
    Confirmed
  }

  let color = {
    0: "bg-gray-800",
    1: "bg-red-500",
    2: "bg-green-500",
    3: "bg-blue-500"
  };

  let radioGroup = [];

  const seats = [];

  [...Array(16).keys()].forEach((num) => {
    seats.push({
      seatNumber: num + 1,
      status: SeatStatus.Empty,
    });
  });

  seats[3].status = SeatStatus.Reserved;

  function selectSeat(seatNum: number) {
    seats.map((data) => {
      if (data.status == SeatStatus.Selected) {
        data.status = SeatStatus.Empty;
      }
    });

    if (seats[seatNum - 1].status != SeatStatus.Reserved) {
      seats[seatNum - 1].status = SeatStatus.Selected;
    }
  }
</script>

<div>
  <h1 class="uppercase text-5xl font-extrabold mb-3">Seat Select</h1>
  <div class="text-xl mb-4">
    <p>Welcome, {name}!</p>
    <p>Please select an <span class="font-bold">open</span> seat.</p>
  </div>
  <div class="grid grid-cols-2 gap-4 mb-4">
    {#each seats as { seatNumber, status }}
      <label class="{color[status]} p-3 rounded">
        {seatNumber}
        <input
          type="radio"
          class="appearance-none"
          bind:group={radioGroup}
          on:click={() => selectSeat(seatNumber)}
        />
      </label>
    {/each}
  </div>
  <button>Confirm</button>
</div>

<style lang="postcss">
  div {
    @apply text-center;
  }
</style>
