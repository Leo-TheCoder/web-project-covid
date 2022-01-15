/** @format */
async function deletePack(packid) {
	const response = await fetch(url + `/cart`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(packid)
	});

	console.log(response);
}
