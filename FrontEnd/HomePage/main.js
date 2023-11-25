let input_message= document.getElementById("flexInput");
let form = document.getElementById("message_form");

document.addEventListener('DOMContentLoaded', getMsgs);

async function SendMsg(e)
{
    e.preventDefault();
    try{
    const token= localStorage.getItem("token");
    const details={
        message: input_message.value,
    }
    let response= await axios.post("http://localhost:4400/chat/message", details, { headers: { "Authorization": token }});
    if(response.status==200)
    {
        form.reset();
        
    }
}
catch(err)
{
    console.log(err);
    if(err.response.status== 400)
    {
        alert('Please Type Your Message');
    }
    else
    {
        alert("Internal Server Error, Try Again Later");
    }
}
}
async function getMsgs(e){
    e.preventDefault();
    const token= localStorage.getItem("token");
    try{
      let msz= await axios.get("http://localhost:4400/chat/get-messages",{ headers: { "Authorization": token }} );
      if(msz.status==200)
      {
        console.log('>>>>>>>>>', msz);
        
      }
    }
    catch(err)
    {
        console.log(err);
    }


}