<script>
    import firebaseConfig from "$components/config";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";

    let firebaseApp;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        const module = await import("https://cdn.skypack.dev/firebase/app");
        await import("https://cdn.skypack.dev/@firebase/auth");
        await import("https://cdn.skypack.dev/@firebase/firestore");

        const firebase = module.default;

        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app(); // if already initialized, use that one
        }

        dispatch("firestore", {
            db: firebaseApp.firestore(),
        });

        dispatch("auth");
    });

    export async function signOut() {
        try {
            await firebaseApp.auth().signOut();
        } catch (err) {
            return err;
        }
    }

    export async function login(userName: string, password: string) {
        try {
            return await firebaseApp
                .auth()
                .signInWithEmailAndPassword(userName, password);
        } catch (err) {
            return err;
        }
    }
</script>
