<script>
    import Firebase from "$components/Firebase.svelte";
    import Firestore from "$components/Firestore.svelte";
    import { user } from "$components/stores";

    let userName, password, seats, firebase, firestore;

    let disabled = true;

    function updateSeats(event) {
        console.log(event.detail);
        seats = event.detail;
    }

    async function login() {
        const auth = await firebase.login(userName, password);
        if (auth.message) {
            console.log(auth.message);
        }
        userName = "";
        password = "";
    }

    async function signOut() {
        await firebase.signOut();
    }

    async function getUser(id) {
        const user = await firestore.getUser(id);
        return user.name;
    }

    async function emptySeat(seatNum) {
        await firestore.removeSeat(seatNum);
    }
</script>

<div class="mx-auto flex flex-col justify-center items-center">
    <Firebase bind:this={firebase} on:auth={() => (disabled = false)} />
    {#if !$user}
        <input
            class="w-auto p-2 mb-6 bg-gray-800"
            type="text"
            placeholder="Email"
            bind:value={userName}
        />
        <input
            class="w-auto p-2 mb-6 bg-gray-800"
            type="password"
            placeholder="Password"
            bind:value={password}
        />
        {#if !disabled}
            <div class="flex flex-row">
                <a href="/" class="bg-blue-600 mr-6">Back</a>
                <button on:click={login} class="bg-green-600">Login</button>
            </div>
        {:else}
            <i class="animate-spin text-2xl fas fa-spinner" />
        {/if}
    {:else}
        <Firestore bind:this={firestore} on:seats={updateSeats} />
        <div class="w-full">
            <h1 class="uppercase text-2xl font-extrabold mb-3">Admin Page</h1>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div
                    class="col-span-2 p-3 rounded bg-gray-800 border-solid border-2 border-gray-700"
                >Altar</div>

                {#if seats}
                    {#each seats as { seatNumber, assignedTo, numberOfPeople }}
                        {#if assignedTo != ""}
                            <div class="inline-flex flex-row gap-3 justify-center items-center bg-blue-600 p-3 rounded">
                                <span>
                                    Seat #{seatNumber} is assigned to {#await getUser(assignedTo)}
                                        <p>...waiting</p>
                                    {:then name}
                                        <p>{name}</p>
                                    {:catch error}
                                        <p style="color: red">
                                            ID {assignedTo}
                                        </p>
                                    {/await} with
                                    {numberOfPeople == 1
                                        ? `${numberOfPeople} person`
                                        : `${numberOfPeople} people`}
                                </span>
                                <button class="bg-red-600" on:click={() => emptySeat(seatNumber)}> Delete </button>
                            </div>
                        {:else}
                            <div class="bg-gray-600 p-3 rounded">
                                Seat #{seatNumber} is empty
                            </div>
                        {/if}
                    {/each}
                {:else}
                    <i class="fas fa-spinner text-5xl animate-spin" />
                {/if}
                <button
                    on:click={() => firestore.resetSeats()}
                    class="col-span-2 bg-red-600">Reset Seats</button
                >
            </div>
        </div>

        <div class="flex flex-row gap-4">
            <a href="/" class="bg-blue-600">Back</a>
            <a class="bg-green-600" href="/admin/sms">Send SMS</a>
            <button on:click={signOut} class="bg-purple-600">Sign Out</button>
        </div>
    {/if}
</div>

<style lang="postcss">
    div {
        @apply text-center;
    }
</style>