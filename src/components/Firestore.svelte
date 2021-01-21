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

	interface User {
		name: string;
		number: string;
		id: string;
	}

	async function createDB(event) {
		db = event.detail.db;
		db.collection("vineyard")
			.doc("seats")
			.get()
			.then((doc) => doc.data())
			.then((data: Seat[]) => {
				let seat: any;
				const seats = [];
				for (seat in data) {
					seats.push(data[seat]);
				}
				seats.sort((a, b) => a.seatNumber - b.seatNumber);
				dispatch("seats", seats);
			});

		db.collection("vineyard")
			.doc("seats")
			.onSnapshot((doc) => {
				const data: Seat[] = doc.data();
				let seat: any;
				const seats = [];
				for (seat in data) {
					const { seatNumber, assignedTo, numberOfPeople } = data[
						seat
					];
					seats.push({
						seatNumber,
						assignedTo,
						numberOfPeople,
					});
				}
				seats.sort((a, b) => a.seatNumber - b.seatNumber);
				dispatch("seats", seats);
			});

		db.collection("vineyard")
			.doc("users")
			.get()
			.then((doc) => doc.data())
			.then((data: User[]) => {
				let user: any;
				const users = [];
				for (user in data) {
					users.push(data[user]);
				}
				users.sort((a, b) => a.id.localeCompare(b.id));
				dispatch("users", users);
			});

		db.collection("vineyard")
			.doc("users")
			.onSnapshot((doc) => {
				const data: User[] = doc.data();
				let user: any;
				const users = [];
				for (user in data) {
					const temp = data[user];
					users.push({ ...temp });
				}
				users.sort((a, b) => a.id.localeCompare(b.id));
				dispatch("users", users);				
			});
	}

	export function updateNumberOfPeople(seatNumber, numPeople, id) {
		const seat = {};
		seat[`seat${seatNumber}`] = {
			seatNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("vineyard").doc("seats").update(seat);
	}

	export function claimSeat(seatNumber, numPeople, id) {
		const seat = {};
		seat[`seat${seatNumber}`] = {
			seatNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("vineyard").doc("seats").update(seat);
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
		db.collection("vineyard").doc("seats").update(seat);
	}

	export async function resetSeats() {
		await db.collection("vineyard").doc("seats").delete();

		const arr = [...Array(16).keys()];
		const _seats = {};

		arr.forEach((key) => {
			_seats[`seat${key + 1}`] = {
				seatNumber: key + 1,
				assignedTo: "",
				numberOfPeople: 0,
			};
		});

		db.collection("vineyard").doc("seats").set(_seats);
	}

	export async function removeSeat(seatNum) {
		const seat = {};
		seat[`seat${seatNum}`] = {
			seatNumber: seatNum,
			assignedTo: "",
			numberOfPeople: 0,
		};
		db.collection("vineyard").doc("seats").update(seat);
	}

	export async function addPerson(contact) {
		const existing = await db.collection("vineyard").doc("users").get();
		const data = await existing.data();
		const people = { ...data };
		const id = db.collection("vineyard").doc().id;
		contact.id = id;
		people[`${id}`] = { ...contact };
		db.collection("vineyard").doc("users").set(people);
	}

	export async function deletePerson(id) {
		const existing = await db.collection("vineyard").doc("users").get();
		const data = await existing.data();
		const people = { ...data };
		if (people[id]) {
			delete people[id];
		}
		db.collection("vineyard").doc("users").set(people);
	}

	export async function getUser(id) {
		const existing = await db.collection("vineyard").doc("users").get();
		const data = await existing.data();
		const people = { ...data };
		return people[id];
	}

	export async function randomizeAll() {
		const existing = await db.collection("vineyard").doc("users").get();
		const people = await existing.data();
		for (let id in people) {
			const temp = people[id];
			delete people[id];
			const newID = db.collection("vineyard").doc().id;
			temp.id = newID;
			temp.status = 0;
			people[newID] = temp;
		}
		db.collection("vineyard").doc("users").set(people);
	}

	export async function sentText(target) {
		target.map((cont) => cont.status++);
		const people = {};
		target.forEach((cont) => {
			people[cont.id] = { ...cont };
		});
		db.collection("vineyard").doc("users").update(people);
	}
</script>

<Firebase on:firestore={createDB} />
