/** @format */
async function deletePack(cartid) {
	const response = await fetch(url + `/cart/${cartid}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		}
	});
	location.href = '/cart';
}

async function buyPack(cartid) {
	const response = await fetch(url + `/cart/${cartid}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		}
	});
	location.href = '/cart';
}
