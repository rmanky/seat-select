<script type="ts">
	import Firebase from "$components/Firebase.svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	let db;

	interface Seat {
		seatNumber: number;
		numberOfPeople: number;
		assignedTo: string;
	}

	function createDB(event) {
		db = event.detail.db;
		db.collection("churches")
			.doc("vineyard")
			.get()
			.then((doc) => doc.data())
			.then((data: Seat[]) => {
				let seat: any;
				const seats = [];
				for (seat in data) {
					seats.push({
						seatNumber: seat.seatNumber,
						assignedTo: seat.assignedTo,
						numberOfPeople: seat.numberOfPeople,
					});
				}
				seats.sort((a, b) => a.seatNumber - b.seatNumber);
				dispatch("seats", seats);
			});

		db.collection("churches")
			.doc("vineyard")
			.onSnapshot((doc) => {
				const data: Seat[] = doc.data();
				let seat: any;
				const seats = [];
				for (seat in data) {
					seats.push({
						seatNumber: data[seat].seatNumber,
						assignedTo: data[seat].assignedTo,
						numberOfPeople: data[seat].numberOfPeople,
					});
				}
				seats.sort((a, b) => a.seatNumber - b.seatNumber);
				dispatch("seats", seats);
			});
	}

	export function updateNumberOfPeople(seatNumber, numPeople, id) {
		const seat = {};
		seat[`seat${seatNumber}`] = {
			seatNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("churches").doc("vineyard").update(seat);
	}

	export function claimSeat(seatNumber, numPeople, id) {
		const seat = {};
		seat[`seat${seatNumber}`] = {
			seatNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("churches").doc("vineyard").update(seat);
	}

	export function changeSeat(oldSeat, newSeat, numPeople, id) {
		const seat = {};
		seat[`seat${newSeat}`] = {
			seatNumber: newSeat,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		seat[`seat${oldSeat}`] = {
			seatNumber: oldSeat,
			assignedTo: "",
			numberOfPeople: 0,
		};
		db.collection("churches").doc("vineyard").update(seat);
	}

	export async function resetSeats() {
		await db.collection("cities").doc("vineyard").delete();

		const arr = [...Array(16).keys()];
		const _seats = {};

		arr.forEach((key) => {
			_seats[`seat${key + 1}`] = {
				seatNumber: key + 1,
				assignedTo: "",
				numberOfPeople: 0,
			};
		});

		db.collection("churches").doc("vineyard").set(_seats);
	}
</script>

<Firebase on:firestore={createDB} />
