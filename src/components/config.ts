export default async() => {
    const fire = await fetch("/fire");
    const api = await fire.json();
    const firebaseConfig = {
        apiKey: api.key,
        authDomain: "seat-select.firebaseapp.com",
        projectId: "seat-select",
        storageBucket: "seat-select.appspot.com",
        messagingSenderId: "654303493249",
        appId: "1:654303493249:web:c0bdfff1b5b2abfb742180",
        measurementId: "G-9RE2QGK76K",
    };

    return firebaseConfig;
}