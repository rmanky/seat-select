<script>
    import { user } from "$components/stores";
    import Table from "$components/Table.svelte";

    let name, number, match, table, contacts, sendEnabled;

    let matchCheck = /^\+[1-9]\d{1,14}$/;

    $: {
        if (number) {
            match = matchCheck.test(number);
        }
    }
</script>

<div>
    {#if $user}
        <h1 class="text-2xl mb-3">Welcome, {$user.email}</h1>
        <Table bind:this={table} bind:contacts={contacts} bind:sendEnabled={sendEnabled}/>
        {#if contacts}
            <div
                class="inline-flex flex-wrap gap-3 mx-auto p-6 mb-3 bg-gray-800 rounded justify-center items-center"
            >
                <input
                    bind:value={name}
                    placeholder="Name"
                    class="bg-gray-900 pl-2 py-2"
                    type="text"
                />
                <input
                    bind:value={number}
                    placeholder="Phone Number"
                    class="bg-gray-900 pl-2 py-2"
                    type="tel"
                />
                {#if !match}
                    <p class="text-red-500 my-auto py-2">
                        Please enter a valid number (+13214567890)
                    </p>
                {/if}
                {#if name && number && match}
                    <button
                        on:click={() => table.addContact(name, number)}
                        class="py-2 bg-green-600">Add</button
                    >
                {:else}
                    <button class="py-2 bg-green-600 opacity-50 cursor-default"
                        >Add</button
                    >
                {/if}
            </div>
            <br />

            <div class="inline-flex gap-3">
                <a href="/admin" class="bg-blue-600">Back</a>
                {#if contacts && contacts.length > 0}
                    <button on:click={() => table.randomizeAll()} class="bg-red-600">Invalidate All</button>
                {:else}
                    <button class="bg-red-600 opacity-50 cursor-default"
                        >Invalidate All</button
                    >
                {/if}
                {#if sendEnabled}
                    <button on:click={() => table.sendTo()} class="bg-green-600"
                        >Send To Selected</button
                    >
                {:else}
                    <button class="bg-green-600 opacity-50 cursor-default"
                        >Send To Selected</button
                    >
                {/if}
            </div>
        {:else}
            <i class="animate-spin text-3xl mb-3 fas fa-spinner" />
        {/if}
    {:else}
        <h1>You aren't signed in...</h1>
    {/if}
</div>
