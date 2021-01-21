<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { user } from "$components/stores";

    let firebaseApp;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        const config = await import("$components/config");
        const firebaseConfig = await config.default();
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
            user.set(false);
            return false;
        } catch (err) {
            return err;
        }
    }

    export async function login(userName: string, password: string) {
        try {
            const _auth = await firebaseApp
                .auth()
                .signInWithEmailAndPassword(userName, password);
            user.set(_auth.user);
            return _auth.user;
        } catch (err) {
            return err;
        }
    }
</script>
