/** @format */
async function deletePatient(patientId) {
	console.log("delete patient");

	const response = await fetch(url + `/patients/${patientId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});

	console.log(response);
}

async function updatePatient(patientId) {
	console.log("update patient step 1");
	let status = document.getElementById("status").value;
	let area = document.getElementById("hospital-area").value;

	updatePatient(patientId, status, area);
}

async function updatePatient(patientId, patientStatus, patientArea) {
	console.log("update patient step 2");

	const response = await fetch(url + `/patients/${patientId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		data: `patientid=${patientId}&status=${patientStatus}&patientarea=${patientArea}`,
	});

	console.log(response);
}
