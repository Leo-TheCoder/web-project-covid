/** @format */
async function deletePack(packid) {
	const response = await fetch(url + `/cart/${packid}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		}
	});

	console.log(response);
}
