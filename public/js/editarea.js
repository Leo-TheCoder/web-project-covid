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

const changeCountry = async (countryid) => {
	const response = await fetch(url + `/admin/areas/districts?countryid=${countryid}`);
	const districts = await response.json();

	const districtSelect = document.getElementById('district');
	districtSelect.innerHTML = '';
	districts.map(district => {
		const option = document.createElement("option");
		option.value = district.districtid;
		option.innerHTML = district.districtname;

		districtSelect.appendChild(option);
	})
}

const changeDistrict = async (districtid) => {
	const countryid = document.getElementById('country').value;
	const response = await fetch(url + `/admin/areas/wards?countryid=${countryid}&districtid=${districtid}`);
	const wards = await response.json();
	
	const wardSelect = document.getElementById('ward');
	wardSelect.innerHTML = '';
	wards.map(ward => {
		const option = document.createElement("option");
		option.value = ward.wardid;
		option.innerHTML = ward.wardname;

		wardSelect.appendChild(option);
	})
}