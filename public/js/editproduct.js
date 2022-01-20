async function addProduct() {
  const productname = document.getElementById("productname").value,
  productprice = document.getElementById('productprice').value,
  productunit = document.getElementById('productunit').value;

  const body = { productname, productprice, productunit };

  const response = await fetch(url + '/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  if(response.ok){
    window.location.replace(url + '/products');
  }
  else{
    console.log(response.status);
    //error handling
  }

}

async function editProduct(productid) {
  const productname = document.getElementById("productname").value,
  productprice = document.getElementById('productprice').value,
  productunit = document.getElementById('productunit').value;

  const body = { productid, productname, productprice, productunit };

  const response = await fetch(url + '/products/' + productid, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  if(response.ok){
    window.location.replace(url + '/products/' + productid);
    console.log('success');
  }
  else{
    console.log(response.status);
    //error handling
  }

}

async function deleteProduct(productid) {
	const response = await fetch(url + `/products/${productid}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	});

  if(response.ok){
    window.location.replace(url + '/products');
    // console.log('success');
  }
  else{
    console.log(response.status);
    //error handling
  }
}