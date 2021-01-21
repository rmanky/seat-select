<script>
    import Firestore from "./Firestore.svelte";

    let firestore;

    export let contacts;

    function updateContacts(event) {
        contacts = event.detail;
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

    export async function sendTo() {
        const target = contacts.filter((contact) => contact.status < 1);
        const payload = {};
        payload["contacts"] = target;

        const rawResponse = await fetch("/sms", {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "text/plain",
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(payload),
        });

        const body = await rawResponse.json();
        if (body.status == "success") {
            console.log(target);
            firestore.sentText(target);
        }
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
                            class="flex flex-col bg-gray-800 sm:border-b-2 border-gray-600 rounded-r-xl flex-no wrap sm:table-row mb-2 sm:mb-0">
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
