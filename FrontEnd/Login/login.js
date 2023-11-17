let container = document.getElementById('container');
let name= document.getElementById('name');
let password= document.getElementById('password');
let number= document.getElementById('number');
let email= document.getElementById('email');

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
      alert("User Successfully Created!");
      toggle();
    }
  }
  catch(err)
  {
    console.log(err)
    if(err.response.data.name== "SequelizeUniqueConstraintError")
    {
      alert("User Already Registered");
      return;
    }
    else if(err.response.data.err== "Please Fill All The Entries / Enter a correct mobile number") { 
     alert(`${err.response.data.err}`);
      return;
    }
    return document.body.innerHTML+= `<div style = "color:red;"> ${err}</div>`;
  }
}