/** @format */
async function lockManager(managerId) {
	const response = await fetch(url + `/admin/managers/${managerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		body: JSON.stringify({lock: true})
	});
	window.location = '/admin/managers';
}

async function unlockManager(managerId) {
	const response = await fetch(url + `/admin/managers/${managerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		body: JSON.stringify({lock: false})
	});
	window.location = '/admin/managers';
}

async function updatePatient(patientId) {
	console.log("update patient step 2");
	const status = document.getElementById("status").value;
	const area = document.getElementById("hospital-area").value;

	const body = {status, area};
	const response = await fetch(url + `/patients/${patientId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	console.log(response);
}
