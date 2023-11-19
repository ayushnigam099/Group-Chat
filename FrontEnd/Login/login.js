let container = document.getElementById('container');
let name= document.getElementById('name');
let password= document.getElementById('password');
let number= document.getElementById('number');
let email= document.getElementById('email');
let login_email= document.getElementById('login-email');
let login_password= document.getElementById('login-password');

toggle = () => {
	container.classList.toggle('sign-in')
	container.classList.toggle('sign-up')
}
setTimeout(() => {
	container.classList.add('sign-in')
}, 200)

async function SignUp(e){
    e.preventDefault();
    
  try{
    const details={
        name: name.value,
        email: email.value,
        number: number.value,
        password: password.value
    }

    let response= await axios.post("http://localhost:4400/user/signup", details);
    if(response.status === 200)     
    {
      alert("Account Successfully Created!");
      toggle();
    }
  }
  catch(err)
  {
    console.log(err)
    if(err.response.status== 500)
    {
      alert("User Already Registered");
      return;
    }
    else if(err.response.status== 400) { 
     alert(`${err.response.data.err}`);
      return;
    }
    return document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
  }
}

async function SignIn(e){
  e.preventDefault();
try 
{
    const details={
      email: login_email.value,
      password: login_password.value
    }
    let response= await axios.post('http://localhost:4400/user/signin', details);
    if(response.status ===200)
    {
      alert("User Successfully Logged In!")
      localStorage.setItem("token", response.data.token);
      window.location.href="../HomePage/main.html"
  }
}
catch(err)
{
  if(err.response.status== 404)
  {
      alert('User does not exist');
     
  }
  else if(err.response.status== 400) { 
    alert(`${err.response.data.message}`);
    
  }
  else if(err.response.status== 500){
    alert(`${err.response.data.message}`);
  }
  else{
    document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
  }
}
}