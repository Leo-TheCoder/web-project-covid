/** @format */
let productIndex = 0;
let products;
const uri = 'http://localhost:5000';

async function loadProducts() {
	const response = await fetch(uri + `/products/list`);
	const productList = await response.json();
	products = productList;

	const main = document.getElementById('product-main');
	main.innerHTML += `
	<button
		class="bg-violet-500 hover:bg-violet-400 text-white py-2 px-4 rounded"
		onclick="moreProduct()">
		Thêm một sản phẩm
	</button>`
}

const moreProduct = () => {
	const parent = document.getElementById('product-table');
	const row = document.createElement('tr');
	const nameCol = document.createElement('td');
	const quantityCol = document.createElement('td');
	const productSelect = document.createElement('select');

	row.id = 'row';
	// row.id = 'product' + productIndex;
	productSelect.id='name';

	nameCol.classList = 'px-6 py-4 whitespace-nowrap';
	quantityCol.classList = 'px-6 py-4 whitespace-nowrap';
	productSelect.classList = 'mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

	quantityCol.innerHTML = `<input type="number"
	class="text-center w-16 bg-indigo-50  font-semibold text-md outline-none border-0 focus:border-0 flex items-center text-gray-700" id='quantity' value='0'
	name="custom-input-number"></input>`;
	products.map(item => {
		productSelect.innerHTML += `<option value=${item.productid}>${item.productname}</option>`;
	})

	nameCol.appendChild(productSelect);

	row.appendChild(nameCol);
	row.appendChild(quantityCol);

	parent.appendChild(row);
}

const getProductsFromUI = () => {
	const parent = document.getElementById('product-table');
	const rows = parent.querySelectorAll('#row');
	const details = [];

	rows.forEach(item => {
		const productid = item.querySelector('#name').value;
		const quantity = item.querySelector('#quantity').value;
		details.push({
			productid: productid,
			quantity: quantity
		})
	})

	return details;
}

const addPack = async () => {
	const details = getProductsFromUI();
	if(details.length === 0){
		alert('Chưa có sản phẩm!');
		return;
	}

	const productpackname = document.getElementById('productpackname').value;
	const productpacklimit = document.getElementById('productpacklimit').value;
	const timeunit = document.getElementById('timeunit').value;

	if(!productpackname || !productpacklimit || !timeunit){
		alert('Chưa nhập đủ!');
		return;
	}

	const body = {
		productpackname,
		productpacklimit,
		timeunit,
		details
	}

	const response = await fetch(url + `/packs`,{
		method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
	})
}

loadProducts();