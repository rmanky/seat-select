<script>
    import { fade, fly } from "svelte/transition";
    import { backOut } from "svelte/easing";

    export let message;
</script>

<div
    class="absolute bottom-5 text-lg bg-red-800 px-4 py-2 rounded"
    in:fly={{
        delay: 0,
        duration: 300,
        x: 0,
        y: 50,
        opacity: 0.1,
        easing: backOut,
    }}
    out:fade={{ duration: 500, opacity: 0 }}
>
    {message}
</div>

<style>
</style>
