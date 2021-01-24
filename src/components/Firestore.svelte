<script type="ts">
	import Firebase from "$components/Firebase.svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	let db;

	interface Row {
		rowNumber: number;
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
			.doc("rows")
			.get()
			.then((doc) => doc.data())
			.then((data: Row[]) => {
				let row: any;
				const rows = [];
				for (row in data) {
					rows.push(data[row]);
				}
				rows.sort((a, b) => a.rowNumber - b.rowNumber);
				dispatch("rows", rows);
			});

		db.collection("vineyard")
			.doc("rows")
			.onSnapshot((doc) => {
				const data: Row[] = doc.data();
				let row: any;
				const rows = [];
				for (row in data) {
					const { rowNumber, assignedTo, numberOfPeople } = data[
						row
					];
					rows.push({
						rowNumber,
						assignedTo,
						numberOfPeople,
					});
				}
				rows.sort((a, b) => a.rowNumber - b.rowNumber);
				dispatch("rows", rows);
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

	export function updateNumberOfPeople(rowNumber, numPeople, id) {
		const row = {};
		row[`row${rowNumber}`] = {
			rowNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("vineyard").doc("rows").update(row);
	}

	export function claimRow(rowNumber, numPeople, id) {
		const row = {};
		row[`row${rowNumber}`] = {
			rowNumber,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		db.collection("vineyard").doc("rows").update(row);
	}

	export function changeRow(oldRow, newRow, numPeople, id) {
		const row = {};
		row[`row${newRow}`] = {
			rowNumber: newRow,
			assignedTo: id,
			numberOfPeople: numPeople,
		};
		row[`row${oldRow}`] = {
			rowNumber: oldRow,
			assignedTo: "",
			numberOfPeople: 0,
		};
		db.collection("vineyard").doc("rows").update(row);
	}

	export async function resetRows() {
		await db.collection("vineyard").doc("rows").delete();

		const arr = [...Array(16).keys()];
		const _rows = {};

		arr.forEach((key) => {
			_rows[`row${key + 1}`] = {
				rowNumber: key + 1,
				assignedTo: "",
				numberOfPeople: 0,
			};
		});

		db.collection("vineyard").doc("rows").set(_rows);
	}

	export async function removeRow(rowNum) {
		const row = {};
		row[`row${rowNum}`] = {
			rowNumber: rowNum,
			assignedTo: "",
			numberOfPeople: 0,
		};
		db.collection("vineyard").doc("rows").update(row);
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
