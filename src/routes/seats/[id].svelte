<script context="module">
    let pageID;
    export async function load({ page }) {
        const { id } = page.params;
        pageID = id;
    }
</script>

<script>
    import Firestore from "$components/Firestore.svelte";

    let user, seats, selectedSeat, firestore, claimedSeat, numPeople;

    enum Status {
        SUCCESS,
        WAITING,
        FAILED,
    }

    let status = Status.WAITING;

    function updateSeats(event) {
        seats = event.detail;
        if (selectedSeat) {
            const checkSelected = seats[selectedSeat - 1].assignedTo;
            if (checkSelected != "" && checkSelected != user.id) {
                selectedSeat = false;
            }
        }
        const claimedSeats = seats.filter(
            (data) => data.assignedTo === user.id
        );
        if (claimedSeats.length > 0) {
            claimedSeat = claimedSeats[0].seatNumber;
            numPeople = claimedSeats[0].numberOfPeople;
        } else {
            claimedSeat = undefined;
        }
    }

    async function authUser() {
        if (status == Status.WAITING) {
            console.log("update");
            user = await firestore.getUser(pageID);
            if (!user) {
                status = Status.FAILED;
            } else {
                status = Status.SUCCESS;
            }
        }
    }

    let radioGroup = [];

    function updateNumPeople() {
        if (claimedSeat) {
            firestore.updateNumberOfPeople(claimedSeat, numPeople, user.id);
        }
    }

    function attemptSelect(_seatNum) {
        if (!seats[_seatNum - 1].assignedTo) {
            selectedSeat = _seatNum;
        }
    }

    function claimSeat() {
        firestore.claimSeat(selectedSeat, numPeople, user.id);
        selectedSeat = false;
    }

    function changeSeat() {
        firestore.changeSeat(claimedSeat, selectedSeat, numPeople, user.id);
        selectedSeat = false;
    }

    function removeSeat() {
        firestore.removeSeat(claimedSeat);
    }
</script>

<div>
    {#if status == Status.WAITING}
        <Firestore bind:this={firestore} on:users={authUser} />
        <h1 class="text-xl mb-3">Hang tight, authenticating this URL...</h1>
        <i class="fas fa-spinner text-5xl animate-spin" />
    {:else if status == Status.FAILED}
        <h1 class="text-red-500 text-xl">
            This URL has expired or is invalid!
        </h1>
    {:else}
        <Firestore bind:this={firestore} on:seats={updateSeats} />
        <h1 class="uppercase text-5xl font-extrabold mb-3">Seat Select</h1>
        <div class="text-xl mb-4">
            {#if seats}
                <p>Welcome, {user.name}!</p>
                <p>
                    Please <b>select</b> the number of people attending, then
                    <b>tap</b>
                    and <b>confirm</b> a seat below.
                </p>
                <div class="mt-2 bg-purple-800 p-5 rounded">
                    <label for="people">How many people?</label>
                    <!-- svelte-ignore a11y-no-onchange -->
                    <select
                        name="people"
                        class="bg-pink-600"
                        bind:value={numPeople}
                        on:change={updateNumPeople}>
                        {#each [...Array(8).keys()].map((data) => data + 1) as question}
                            <option value={question}>
                                {question == 1
                                    ? `${question} Person`
                                    : `${question} People`}
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

                {#each seats as { seatNumber, assignedTo, numberOfPeople }}
                    <label
                        class="{assignedTo == ''
                            ? seatNumber == selectedSeat
                                ? 'bg-green-600'
                                : 'bg-gray-600'
                            : assignedTo == user.id
                            ? 'bg-blue-600'
                            : 'bg-red-600'} p-3 rounded cursor-pointer">
                        {#if assignedTo == user.id}
                            Seat #{seatNumber} with {numberOfPeople == 1
                                ? `${numberOfPeople} person`
                                : `${numberOfPeople} people`}
                        {:else}
                            Seat #{seatNumber}
                        {/if}
                        <input
                            type="radio"
                            class="hidden"
                            bind:group={radioGroup}
                            on:click={() => attemptSelect(seatNumber)}
                        />
                    </label>
                {/each}
            </div>
            {#if claimedSeat}
                <button on:click={() => removeSeat()} class="bg-red-600"
                    >Cancel Seat</button
                >
            {/if}
            {#if claimedSeat && selectedSeat}
                <button on:click={() => changeSeat()} class="bg-green-600"
                    >Change Seat</button
                >
            {:else if selectedSeat}
                <button on:click={() => claimSeat()} class="bg-green-600"
                    >Confirm</button
                >
            {/if}
        {:else}
            <i class="fas fa-spinner text-5xl animate-spin" />
        {/if}
    {/if}
</div>
