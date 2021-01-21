<script>
    import Firestore from "./Firestore.svelte";

    let firestore;

    export let contacts;

    export let sendEnabled;

    let selected = [];

    $: {
        sendEnabled = selected.length > 0;
    }

    function updateContacts(event) {
        contacts = event.detail;
        selected = selected.filter(id => contacts.filter(i => i.id == id).length != 0);
    }

    export function addContact(name, number) {
        const newConact = {
            name: name,
            number: number,
            id: false,
            status: 0,
        };

        firestore.addPerson(newConact);
    }

    export async function randomizeAll() {
        await firestore.randomizeAll();
    }

    export async function sendTo() {
        sendEnabled = false;
        const target = contacts.filter((contact) => selected.includes(contact.id));
        const payload = {};
        payload["contacts"] = target;

        const rawResponse = await fetch(
            "https://cors-anywhere.herokuapp.com/http://send-sms-5601.twil.io/send-sms",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const body = await rawResponse.text();
        if (body == "success") {
            firestore.sentText(target);
        }
        sendEnabled = true;
    }
</script>

<body class="flex items-center justify-center">
    <Firestore bind:this={firestore} on:users={updateContacts} />
    <div class="container">
        {#if contacts}
            <table
                class="w-full flex flex-row flex-no-wrap sm:bg-gray-800 overflow-hidden sm:rounded-lg sm:shadow-lg my-5"
            >
                <thead class="text-white">
                    {#each contacts as _}
                        <tr
                            class="flex flex-col bg-gray-700 flex-no wrap sm:table-row rounded-l-xl sm:rounded-none mb-2 sm:mb-0">
                            <th class="p-3 text-left">Select</th>
                            <th class="p-3 text-left border-gray-500">Name</th>
                            <th class="p-3 text-left">Number</th>
                            <th class="p-3 text-left">ID</th>
                            <th class="p-3 text-left">Status</th>
                            <th class="p-3 text-left" width="110px">Remove</th>
                        </tr>
                    {/each}
                </thead>
                <tbody class="flex-1 sm:flex-none">
                    {#each contacts as { name, number, id, status }}
                        <tr
                            class={`flex flex-col ${selected.includes(id) ? 'bg-blue-800' : 'bg-gray-800'} sm:border-b-2 border-gray-600 rounded-r-xl flex-no wrap sm:table-row mb-2 sm:mb-0`}>
                            {#if selected.includes(id)}
                                <button
                                    class="m-0 p-3 rounded-none rounded-tr-xl sm:m-3 sm:rounded bg-yellow-600 text-left hover:font-medium cursor-pointer"
                                    on:click={() => selected = selected.filter(i => i != id)}><i class="fas fa-minus"></i></button>
                            {:else}
                                <button
                                    class="m-0 p-3 rounded-none rounded-tr-xl sm:m-3 sm:rounded bg-green-600 text-left hover:font-medium cursor-pointer"
                                    on:click={() =>
                                        (selected = [...selected, id])}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            {/if}
                            <td
                                class="p-3 text-left sm:border-r-2 border-gray-600"
                                >{name}</td
                            >
                            <td
                                class="p-3 text-left sm:border-r-2 border-gray-600"
                                >{number}</td
                            >
                            <td
                                class="p-3 text-left sm:border-r-2 border-gray-600"
                                >{id}</td
                            >
                            <td
                                class="p-3 text-left sm:border-r-2 border-gray-600"
                                ><i
                                    class={`fas fa-circle mr-2 ${
                                        status > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                />{status
                                    ? `Sent (x${status})`
                                    : "Not Sent"}</td
                            >
                            <button
                                class="m-0 p-3 rounded-none rounded-br-xl sm:m-3 sm:rounded bg-red-600 text-left hover:font-medium cursor-pointer"
                                on:click={() => firestore.deletePerson(id)}>
                                Remove
                            </button>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</body>

<style>
    @media (min-width: 640px) {
        table {
            display: inline-table !important;
        }

        thead tr:not(:first-child) {
            display: none;
        }

        tbody tr:last-child {
            border: none !important;
        }
    }
</style>
