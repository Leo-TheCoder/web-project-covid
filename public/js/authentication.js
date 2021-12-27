const url = 'http://localhost:5000';

function TogglePassword(item) {
  const input = document.querySelector('.form-label #password');
  if (input.type == 'password') {
    input.type = 'text';
    item.innerHTML = 'Ẩn';
  }
  else {
    input.type = 'password';
    item.innerHTML = 'Hiện';
  }
  //console.log(input);
}

async function LogIn() {
  console.log('login');
  //get username and password to send to server
  const phone_number = document.getElementById('phone_number').value;
  const password = document.getElementById('password').value;
  //let response;

  if (!phone_number || !password) {
    alert('Bạn chưa nhập đủ thông tin!');
  }
  else {
    const body = { phone_number, password };
    const response = await fetch(url + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      withCredentials: true
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      window.location.replace(url + '/dashboard');
    }
    else {
      console.log(response.status);
      //error handling
      if (response.status >= 400 && response.status < 500) {
        alert("Sai mật khẩu!");
      }
      else if (response.status >= 500) {
        alert("Hệ thống báo lỗi: " + response.statusText);
      }

    }
  }
}

async function editProfile() {
  const name = document.getElementById("name").value,
    dob = document.getElementById('dob').value,
    address = document.getElementById('address').value;

  const body = { name, dob, address };

  const response = await fetch(url + '/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  if(response.ok){
    window.location.replace(url + '/profile');
  }
  else{
    console.log(response.status);
    //error handling
    
    }

}