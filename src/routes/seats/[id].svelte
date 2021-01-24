<script context="module">
    let pageID;
    export async function load({ page }) {
        const { id } = page.params;
        pageID = id;
    }
</script>

<script>
    import Firestore from "$components/Firestore.svelte";

    let user, rows, selectedRow, firestore, claimedRow, numPeople;

    enum Status {
        SUCCESS,
        WAITING,
        FAILED,
    }

    let status = Status.WAITING;

    function updateRows(event) {
        rows = event.detail;
        if (selectedRow) {
            const checkSelected = rows[selectedRow - 1].assignedTo;
            if (checkSelected != "" && checkSelected != user.id) {
                selectedRow = false;
            }
        }
        const claimedRows = rows.filter(
            (data) => data.assignedTo === user.id
        );
        if (claimedRows.length > 0) {
            claimedRow = claimedRows[0].rowNumber;
            numPeople = claimedRows[0].numberOfPeople;
        } else {
            claimedRow = undefined;
        }
    }

    async function authUser() {
        if (status == Status.WAITING || status == Status.SUCCESS) {
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
        if (claimedRow) {
            firestore.updateNumberOfPeople(claimedRow, numPeople, user.id);
        }
    }

    function attemptSelect(_rowNum) {
        if (!rows[_rowNum - 1].assignedTo) {
            selectedRow = _rowNum;
        }
    }

    function claimRow() {
        firestore.claimRow(selectedRow, numPeople, user.id);
        selectedRow = false;
    }

    function changeRow() {
        firestore.changeRow(claimedRow, selectedRow, numPeople, user.id);
        selectedRow = false;
    }

    function removeRow() {
        firestore.removeRow(claimedRow);
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
        <Firestore bind:this={firestore} on:rows={updateRows} />
        <h1 class="uppercase text-5xl font-extrabold mb-3">Row Select</h1>
        <div class="text-xl mb-4">
            {#if rows}
                <p>Welcome, {user.name}!</p>
                <p>
                    Please <b>select</b> the number of people attending, then
                    <b>tap</b>
                    and <b>confirm</b> a row below.
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
                <p>Hang tight, fetching rows...</p>
            {/if}
        </div>
        {#if rows}
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div
                    class="col-span-2 p-3 rounded bg-gray-800 border-solid border-2 border-gray-700"
                >Altar</div>

                {#each rows as { rowNumber, assignedTo, numberOfPeople }}
                    <label
                        class="{assignedTo == ''
                            ? rowNumber == selectedRow
                                ? 'bg-green-600'
                                : 'bg-gray-600'
                            : assignedTo == user.id
                            ? 'bg-blue-600'
                            : 'bg-red-600'} p-3 rounded cursor-pointer">
                        {#if assignedTo == user.id}
                            Row #{rowNumber} with {numberOfPeople == 1
                                ? `${numberOfPeople} person`
                                : `${numberOfPeople} people`}
                        {:else}
                            Row #{rowNumber}
                        {/if}
                        <input
                            type="radio"
                            class="hidden"
                            bind:group={radioGroup}
                            on:click={() => attemptSelect(rowNumber)}
                        />
                    </label>
                {/each}
            </div>
            {#if claimedRow}
                <button on:click={() => removeRow()} class="bg-red-600"
                    >Cancel Row</button
                >
            {/if}
            {#if claimedRow && selectedRow}
                <button on:click={() => changeRow()} class="bg-green-600"
                    >Change Row</button
                >
            {:else if selectedRow}
                <button on:click={() => claimRow()} class="bg-green-600"
                    >Confirm</button
                >
            {/if}
        {:else}
            <i class="fas fa-spinner text-5xl animate-spin" />
        {/if}
    {/if}
</div>
