// import { io } from "socket.io-client"
const logOut = document.getElementById("logOut");
const crtGrp = document.getElementById("dropdown");
const grptbody = document.getElementById("grptbody");
const chatthead = document.getElementById("chatthead");
const main_chat = document.getElementById("main-chat");
const inviteLink = document.getElementById("inviteLink");
const invitebtn = document.getElementById("invite");
const socket = io('http://localhost:3000', { transport: ['websocket'] });

invitebtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await axios.get(`${inviteLink.value}`, { headers: { Authorization: localStorage.getItem("token") } });
    location.reload();
  } catch (err) {
    alert("Already a user.");
  }});

crtGrp.addEventListener("click", async (e) => {
  e.preventDefault();
  const grpName = prompt("Name your Group:", "New Group");
  if (grpName) {
    try {
      await axios.get(`http://localhost:3000/groupParams/${grpName}`, { headers: { Authorization: localStorage.getItem("token") } });
    } catch (err) {
      console.log(err);
    }
  }
  location.reload();
});

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("message");
  location.replace("http://127.0.0.1:5000/FRONTEND/Login/login.html");
});

window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  if (!localStorage.getItem("token")) {
    location.replace("http://127.0.0.1:5000//FRONTEND/Login/login.html");
  }
  try {
     await renderGroup();
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("message");
    location.replace("http://127.0.0.1:5000/FRONTEND/Login/login.html");
  }
});

// Function to render the chat interface
export async function renderChat(groupName, groupId) {
  main_chat.innerHTML = `<div class="table-responsive" style="overflow-x: hidden;" id="table">
                      <table class="table table-striped">
                        <thead id="chatthead">
                        <tr>
                        <th scope="col">
                          <div class="group-header">
                            <span class="group-name">${groupName}</span>
                            <div class="dropdown">
                              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                              </button>
                              <ul class="dropdown-menu dropdown-menu-end" id="dropdown2">
                                <li><a class="dropdown-item" href="#">Copy invite link</a></li>
                                <li><a class="dropdown-item" href="#">Group members</a></li>
                                <li><a class="dropdown-item" href="#">Delete group</a></li>
                              </ul>
                            </div>
                          </div>
                        </th>
                      </tr>
                        </thead>
                        <tbody id="chattbody"></tbody>
                      </table>
                    </div>
                    <form action="#" class="form-grp">
                      <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Message" aria-label="Message"
                          aria-describedby="button-addon2" id="chat">
                          <span class="input-group-text" id="paperClip" id="paperClip"><i class="fa fa-paperclip">
                            <input type="file" id="imageFile" onchange="SendFile(this, ${groupId}, '${groupName}')" style="display:none;">
                          </i></span>
                        <button type="button" class="btn btn-info" id="send">Send</button>
                      </div>
                    </form>`;
  const copyLink = document.getElementById("dropdown2");
  const chattbody = document.getElementById("chattbody");
  const chat = document.getElementById("chat");
  const send = document.getElementById("send");

  copyLink.addEventListener("click", async (e) => {
    if (e.target.textContent == "Copy invite link") {
      let inputElement = document.createElement("input");
      inputElement.setAttribute("value", `http://localhost:3000/copyLink?grpname=${groupName}&grpId=${groupId}`);
      document.body.appendChild(inputElement);
      inputElement.select();
      document.execCommand("copy");
      inputElement.parentNode.removeChild(inputElement);
    } 
    else if (e.target.textContent === "Group members") {
      try {
        const result = await axios.get(`http://localhost:3000/groupInfo/${groupId}`, { headers: { Authorization: localStorage.getItem("token") } });
        chattbody.innerHTML = ``;
        result.data.slice(0, result.data.length - 1).forEach(async (element) => {
          const row = document.createElement("tr");
          const data = document.createElement("td");
          const User = await axios.get(`http://localhost:3000/getUser/${element.member}`, { headers: { Authorization: localStorage.getItem("token") } });
          if (result.data.slice(-1)[0] === true) {
            if (element.member == element.admin) {
              data.appendChild(document.createTextNode(`${User.data.name}(ADMIN)`));
              row.appendChild(data);
              row.setAttribute("id", element.member);
              chattbody.appendChild(row);
            } else {
              data.appendChild(document.createTextNode(`${User.data.name}`));
              const deleteb = document.createElement("button");
              deleteb.setAttribute("class", "btn btn-danger btn-sm");
              deleteb.setAttribute("type", "button");
              deleteb.appendChild(document.createTextNode("Remove"));

              deleteb.addEventListener("click", async (e) => {
                e.preventDefault();
                await axios.get(`http://localhost:3000/removeMember?memberId=${e.target.parentElement.id}&groupId=${groupId}`, { headers: { Authorization: localStorage.getItem("token") } });
                chattbody.removeChild(e.target.parentElement);
              });
              row.appendChild(data);
              row.appendChild(deleteb);
              row.setAttribute("id", element.member);
              chattbody.appendChild(row);
            }
          } else {
            if (element.member == element.admin) {
              data.appendChild(document.createTextNode(`${User.data.name}(ADMIN)`));
              row.appendChild(data);
              chattbody.appendChild(row);
            } else {
              data.appendChild(document.createTextNode(`${User.data.name}`));
              row.appendChild(data);
              chattbody.appendChild(row);
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await axios.get(`http://localhost:3000/deleteGroup/${groupId}`, { headers: { Authorization: localStorage.getItem("token") } });
        location.reload();
      } catch (err) {
        alert("Sorry. You are not the admin.");
        console.log(err);
      }
    }
  });

  chattbody.innerHTML = '';
  localStorage.setItem("message", JSON.stringify([]));

  try {
    const chatData = await axios.get(`http://localhost:3000/getChat/?MessageId=${JSON.parse(localStorage.getItem("message"))[-1]}&GroupId=${groupId}`, { headers: { Authorization: localStorage.getItem("token") } });
    if (chatData) {
      let message = JSON.parse(localStorage.getItem("message"));
      message = message.concat(chatData.data);
      // message = message.slice(-10);
      localStorage.setItem("message", JSON.stringify(message));
    }
    let array = JSON.parse(localStorage.getItem("message"));
    for (let element of array) {
      if (element.chat.indexOf('.txt') == -1) {
        const msg = element.chat;
        const row = document.createElement("tr");
        const data = document.createElement("td");
        try {
          const User = await axios.get(`http://localhost:3000/getUser/${element.UserId}`, { headers: { Authorization: localStorage.getItem("token") } });
          data.appendChild(document.createTextNode(`${User.data.name}: ` + msg));
          row.appendChild(data);
          chattbody.appendChild(row);
        } catch (error) {
          console.log(error);
        }
      } else {
        const base64 = await axios.get(`http://localhost:3000/fetchbase64/${element.chat}`, { headers: { Authorization: localStorage.getItem("token") } });
        const img = document.createElement('img');
        img.setAttribute('src', `${base64.data.chat}`);
        img.setAttribute('class', 'img-fluid');
        const msg = img;
        const row = document.createElement("tr");
        const data = document.createElement("td");
        try {
          const User = await axios.get(`http://localhost:3000/getUser/${element.UserId}`, { headers: { Authorization: localStorage.getItem("token") } });
          data.appendChild(document.createTextNode(`${User.data.name}: `));
          data.appendChild(msg);
          row.appendChild(data);
          chattbody.appendChild(row);
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  send.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3000/postChat", {
        chat: chat.value,
        chatgroupid: groupId,
      }, { headers: { Authorization: localStorage.getItem("token") } });

      try {
        const row = document.createElement("tr");
        const data = document.createElement("td");
        const User = await axios.get(`http://localhost:3000/getUser/${result.data.UserId}`, { headers: { Authorization: localStorage.getItem("token") } });
        data.appendChild(document.createTextNode(`${User.data.name}: ` + result.data.chat));
        row.appendChild(data);
        chattbody.appendChild(row);
      } catch (err) {
        console.log(err);
      }
      chat.value = '';
    } catch (error) {
      console.log(error);
    }
    socket.emit('batman', 'Send Pressed');
  });

  chattbody.setAttribute("style", '"overflow-x: hidden;"');

  const paperClip = document.getElementById('paperClip');
  const imageFile = document.getElementById('imageFile');
  function fileFunction() {
    imageFile.click();
  }
  paperClip.onclick = fileFunction;
}

let selectedRow = null;
async function renderGroup() {
  try {
    const result = await axios.get(`http://localhost:3000/group/getGroup`, { headers: { Authorization: localStorage.getItem("token") } });
    console.log(">>>>>>", result)
    result.data.forEach((element) => {
      const row = document.createElement("tr");
      row.setAttribute("id", `${element.GroupId}`);
      const data = document.createElement("td");
      data.appendChild(document.createTextNode(`${element.name}`));
      row.appendChild(data);
      row.addEventListener("click", async (e) => {
        if (selectedRow) {
          selectedRow.removeAttribute("style");
        }
        e.target.setAttribute("style", "background-color: #0095dd; color: white;");
        selectedRow = e.target;
        await renderChat(row.textContent, e.target.parentElement.id);
        socket.on('renderChat', (message) => {
          renderChat(row.textContent, e.target.parentElement.id);
        });
      });
      grptbody.prepend(row);
    });
  } catch (err) {
    console.log(err);
  }
}

const inputElement = document.getElementById('myInput');
function myFunction() {
  const input = document.getElementById("myInput");
  const filter = input.value.toUpperCase();
  const table = document.getElementById("myTable");
  const tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      const txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
inputElement.onkeyup = myFunction;

window.SendFile = async function SendFile(event, groupId, groupName) {
  let file = event.files[0];
  let reader = new FileReader();
  reader.addEventListener("load", async function () {
    try {
      const result = await axios.post("http://localhost:3000/file/upload", {
        chat: reader.result,
        chatgroupid: groupId,
      }, { headers: { Authorization: localStorage.getItem("token") } });

      const response = await axios.post("http://localhost:3000/postChat", {
        chat: result.data.Key,
        chatgroupid: groupId,
      }, { headers: { Authorization: localStorage.getItem("token") } });

      await renderChat(groupName, groupId);
      socket.emit('batman', 'Send Pressed');
    } catch (error) {
      console.log(error);
    }
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}
