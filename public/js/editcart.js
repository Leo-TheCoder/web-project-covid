/** @format */
async function deletePack(packid) {
	const response = await fetch(url + `/cart`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		body: JSON.stringify(packid)
	});

	console.log(response);
}
