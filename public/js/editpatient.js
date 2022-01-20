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
	console.log("update patient step 2");
	const status = document.getElementById("status").value;
	const area = document.getElementById("hospital-area").value;

	const body = {status, area};
	console.log(body);
	const response = await fetch(url + `/patients/${patientId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	console.log(response);
}
