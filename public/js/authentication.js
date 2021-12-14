function TogglePassword(item){
  const input = document.querySelector('.form-label #password');
  if(input.type == 'password'){
    input.type = 'text';
    item.innerHTML = 'Ẩn';
  }
  else{
    input.type = 'password';
    item.innerHTML = 'Hiện';
  }
  //console.log(input);
}