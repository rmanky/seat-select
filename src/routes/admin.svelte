<script>
    import { onMount } from "svelte";
    import Session from "$components/Session.svelte";
    import Toast from "$components/Toast.svelte";
    import firebaseConfig from "$components/config";

    let user, userName, password, seats;

    let disabled = true;
    let error = false;

    let errorMessage = "An unknown error has occured";

    onMount(() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
        }

        disabled = false;
    });

    function login() {
        firebase
            .auth()
            .signInWithEmailAndPassword(userName, password)
            .then((_user) => {
                userName = "";
                password = "";
                // Signed in
                // ...
                user = _user;
            })
            .catch((e) => {
                errorMessage = e.message;
                password = "";
                error = true;
                setTimeout(() => (error = false), 4000);
            });
    }

    function signOut() {
        firebase
            .auth()
            .signOut()
            .then(() => {
                user = false;
            })
            .catch((e) => {
                // An error happened.
                errorMessage = e.message;
                error = true;
                setTimeout(() => (error = false), 4000);
            });
    }

    async function resetSeats() {
        const db = firebase.firestore();

        await db.collection("cities").doc("vineyard").delete();

        const arr = [...Array(16).keys()];
        const _seats = {};

        arr.forEach((key) => {
            _seats[`seat${key + 1}`] = {
                seatNumber: key + 1,
                assignedTo: "",
            };
        });

        console.log(_seats);

        db.collection("churches").doc("vineyard").set(_seats);
    }
</script>

<div class="mx-auto flex flex-col justify-center items-center">
    {#if !user}
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
        {#if disabled}
            <i class="fas fa-spinner text-3xl animate-spin" />
        {:else}
            <div class="flex flex-row">
                <a href="/" class="bg-blue-600 mr-6">Back</a>
                <button on:click={login} class="bg-green-600">Login</button>
            </div>

            {#if error}
                <Toast show={error} message={errorMessage} />
            {/if}
        {/if}
    {:else}
        <div class="w-full">
            <h1 class="uppercase text-2xl font-extrabold mb-3">Admin Page</h1>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div
                    class="col-span-2 p-3 rounded bg-gray-800 border-solid border-2 border-gray-700"
                >Altar</div>

                {#if seats}
                    {#each seats as { seatNumber, assignedTo }}
                        {#if assignedTo != ""}
                            <div class="bg-blue-600 p-3 rounded">
                                Seat #{seatNumber} is assigned to {assignedTo}
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
                <button on:click={resetSeats} class="col-span-2 bg-red-600"
                    >Reset Seats</button
                >
            </div>
        </div>

        <div class="flex flex-row">
            <a href="/" class="bg-blue-600 mr-6">Back</a>
            <button on:click={signOut} class="bg-purple-600">Sign Out</button>
        </div>
        <Session bind:seats />
    {/if}
</div>

<style lang="postcss">
    div {
        @apply text-center;
    }
</style>
