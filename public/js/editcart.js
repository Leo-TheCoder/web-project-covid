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

async function buyPack(packid, cartid) {
	const parent = document.getElementById(cartid);
	const products = parent.querySelectorAll('#product');
	const total = parent.querySelector('#total').innerHTML;

	const details = [];
	products.forEach(item => {
		const toBuy = {};
		toBuy.packid = packid;
		toBuy.productid = item.querySelector('#productid').innerHTML;
		toBuy.quantity = item.querySelector('#quantity').innerHTML;
		toBuy.productprice = item.querySelector('#productprice').innerHTML;

		details.push(toBuy);
	})

	const body = {
		total,
		details
	}

	// const response = await fetch(url + `/orders`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(body)
	// });

	const response = await fetch(url + `/cart/${cartid}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body)
	});

	window.location.href = response.url;

	// deletePack(cartid);
}
