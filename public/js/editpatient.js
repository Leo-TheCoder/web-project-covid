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

async function updatePatient(patientId, curStatus, curArea) {
	console.log("update patient step 2");
	const status = document.getElementById("status").value;
	const area = document.getElementById("hospital-area").value;
	console.log(curStatus);
	console.log(status);
	console.log(curArea);
	console.log(area);

	if (curStatus == status && curArea == area) {
		console.log("not updated");
		return;
	}

	const body = { status, area };
	const response = await fetch(url + `/patients/${patientId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	console.log(response);
}
