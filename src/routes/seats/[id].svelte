<script context="module">
    let id;
    export async function load({ page }) {
        ({ id } = page.params);
    }
</script>

<script>
    import Firestore from "$components/Firestore.svelte";

    let seats, selectedSeat, firestore, claimedSeat, numPeople;

    function updateSeats(event) {
        seats = event.detail;
        if (selectedSeat) {
            const checkSelected = seats[selectedSeat - 1].assignedTo;
            if (checkSelected != "" && checkSelected != id) {
                selectedSeat = false;
            }
        }
        const claimedSeats = seats.filter((data) => data.assignedTo === id);
        if (claimedSeats.length > 0) {
            claimedSeat = claimedSeats[0].seatNumber;
        }
    }

    let radioGroup = [];

    function attemptSelect(_seatNum) {
        if (!seats[_seatNum - 1].assignedTo) {
            selectedSeat = _seatNum;
        }
    }

    function claimSeat() {
        firestore.claimSeat(selectedSeat, numPeople, id);
        selectedSeat = false;
    }

    function changeSeat() {
        firestore.changeSeat(claimedSeat, selectedSeat, numPeople, id);
        selectedSeat = false;
    }
</script>

<div>
    <Firestore bind:this={firestore} on:seats={updateSeats} />
    <h1 class="uppercase text-5xl font-extrabold mb-3">Seat Select</h1>
    <div class="text-xl mb-4">
        {#if seats}
            <p>Welcome, {id}!</p>
            <p>Please <b>select</b> the number of people attending, then <b>tap</b> and <b>confirm</b> a seat below</p>
            <div class="mt-2 bg-purple-800 p-5 rounded">
                <label for="people">How many people?</label>
                <select name="people" class="bg-pink-600" bind:value={numPeople}>
                    {#each [...Array(10).keys()].map((data) => data + 1) as question}
                        <option value={question}>
                            {#if question == 1}
                                {question} Person
                            {:else if question < 10}
                                {question} People
                            {:else}
                                {question}+ People
                            {/if}
                        </option>
                    {/each}
                </select>
            </div>
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
</div>
