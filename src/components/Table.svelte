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
        selected = selected.filter(
            (id) => contacts.filter((i) => i.id == id).length != 0
        );
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
        const target = contacts.filter((contact) =>
            selected.includes(contact.id)
        );
        const payload = {};
        payload["contacts"] = target;

        try {
            await fetch("https://send-sms-5601.twil.io/send-sms", {
                method: "POST",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.log(err);
        }

        firestore.sentText(target);
        selected = [];
    }
</script>

<body class="flex items-center justify-center">
    <Firestore bind:this={firestore} on:users={updateContacts} />
    <div class="container">
        {#if contacts}
            <table
                class="w-full flex flex-row flex-no-wrap md:bg-gray-800 overflow-hidden md:rounded-lg md:shadow-lg my-5"
            >
                <thead class="text-white">
                    {#each contacts as _}
                        <tr
                            class="flex flex-col bg-gray-700 flex-no wrap md:table-row rounded-l-xl md:rounded-none mb-2 md:mb-0">
                            <th class="p-3 text-left">Select</th>
                            <th class="p-3 text-left">Name</th>
                            <th class="p-3 text-left">Number</th>
                            <th class="p-3 text-left">ID</th>
                            <th class="p-3 text-left">Status</th>
                            <th class="p-3 text-left" width="110px">Delete</th>
                        </tr>
                    {/each}
                </thead>
                <tbody class="flex-1 md:flex-none">
                    {#each contacts as { name, number, id, status }}
                        <tr
                            class={`flex flex-col ${
                                selected.includes(id)
                                    ? "bg-blue-800"
                                    : "bg-gray-800"
                            } md:border-b-2 border-gray-600 rounded-r-xl flex-no wrap md:table-row mb-2 md:mb-0`}>
                            {#if selected.includes(id)}
                                <button
                                    class="m-0 p-3 rounded-none rounded-tr-xl md:m-3 md:rounded bg-yellow-600 text-left hover:font-medium cursor-pointer"
                                    on:click={() =>
                                        (selected = selected.filter(
                                            (i) => i != id
                                        ))}><i class="fas fa-minus" /></button
                                >
                            {:else}
                                <button
                                    class="m-0 p-3 rounded-none rounded-tr-xl md:m-3 md:rounded bg-green-600 text-left hover:font-medium cursor-pointer"
                                    on:click={() =>
                                        (selected = [...selected, id])}>
                                    <i class="fas fa-plus" />
                                </button>
                            {/if}
                            <td
                                class="p-3 text-left md:border-r-2 border-gray-600"
                                >{name}</td
                            >
                            <td
                                class="p-3 text-left md:border-r-2 border-gray-600"
                                >{number}</td
                            >
                            <td
                                class="p-3 text-left md:border-r-2 border-gray-600"
                                >{id}</td
                            >
                            <td
                                class="p-3 text-left md:border-r-2 border-gray-600"
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
                                class="m-0 p-3 rounded-none rounded-br-xl md:m-3 md:rounded bg-red-600 text-left hover:font-medium cursor-pointer"
                                on:click={() => firestore.deletePerson(id)}>
                                <i class="fas fa-minus" />
                            </button>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</body>

<style>
    @media (min-width: 768px) {
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
