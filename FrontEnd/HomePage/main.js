let form = document.getElementById("message_form");
let input_message= document.getElementById("flexInput");
let chat_body= document.getElementById('chat_body');
document.addEventListener('DOMContentLoaded', () => {
    getMsgs(); // Initial call when the DOM is loaded
    setInterval(getMsgs, 1000); // Call getMsgs every 1000 milliseconds (1 second)
});

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
        let messages= await axios.get("http://localhost:4400/chat/get-messages",{ headers: { "Authorization": token }} );
        if(messages.status==200)
        {
        console.log('>>>>>>>>>', messages.data.messages);
      chat_body.innerHTML = "";
      let messageText = "";
      messages.data.messages.forEach((ele) => {
        console.log("...............",ele)
          const date = new Date(ele.date_time);
          const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
          const formattedDate = date.toLocaleString('en-US', options);
          messageText += `                            
          <div class="col-12 mb-2 pe-0">
              <div class="card p-2 float-end rounded-4 self-chat-class">
                  <p class="text-primary my-0"><small>${ele.name}</small></p>
                  <p class="my-0">${ele.message}</p>
                  <small class="text-muted text-end">${formattedDate}</small>
              </div>
          </div>`})
      chat_body.innerHTML = messageText;
      chat_container.scrollTop = chat_container.scrollHeight;
  }
      }
    catch(err)
    {
        console.log(err);
        alert("Internal Server Error, Try Again Later");

    }


}