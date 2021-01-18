<script>
	import { onMount } from "svelte";
	import firebaseConfig from "$components/config";

	export let seats;

	let db;

	onMount(async () => {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		} else {
			firebase.app(); // if already initialized, use that one
		}

		db = firebase.firestore();
		update();
	});

	function update() {
		db.collection("churches")
			.doc("vineyard")
			.get()
			.then((doc) => doc.data())
			.then((data) => {
				seats = [];
				console.log(data);
				for (const seat in data) {
					seats.push({
						seatNumber: seat.seatNumber,
						assignedTo: seat.assignedTo
					});
				}

				seats.sort((a, b) => a.seatNumber - b.seatNumber);
			});

		db.collection("churches")
			.doc("vineyard")
			.onSnapshot((doc) => {
				const data = doc.data();
				seats = [];
				for (const seat in data) {
					seats.push({
						seatNumber: data[seat].seatNumber,
						assignedTo: data[seat].assignedTo
					});
				}

				seats.sort((a, b) => a.seatNumber - b.seatNumber);
			});
	}

	export function claimSeat(seatNumber, id) {
		const seat = {};
		seat[`seat${seatNumber}`] = {
			seatNumber,
			status: 2,
			assignedTo: id,
		};
		db.collection("churches").doc("vineyard").update(seat);
	}

	export function changeSeat(oldSeat, newSeat, id) {
		const seat = {};
		seat[`seat${newSeat}`] = {
			seatNumber: newSeat,
			assignedTo: id,
		};
		seat[`seat${oldSeat}`] = {
			seatNumber: oldSeat,
			assignedTo: '',
		};
		db.collection("churches").doc("vineyard").update(seat);
	}
</script>
