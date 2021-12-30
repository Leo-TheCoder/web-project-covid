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
