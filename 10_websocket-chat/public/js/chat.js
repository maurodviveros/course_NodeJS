"use strict";

const formMessage = document.querySelector("form#message");
const logoutBtn = document.querySelector("#logout");

let user = null;
let socket  = null;

const validarJWT = async()=>{
    const token = localStorage.getItem("token");
    if(!token) return window.location = "/";
    try{
        const resp = await fetch("/api/auth/", { headers:{ Authorization: token } })
        if(resp.status != 200) throw new Error("error");
        const { user: userDB, token: tokenDB } = await resp.json();
        user = userDB;
        user._id = user._id.toString();
        localStorage.setItem("token", tokenDB);
    } catch(error){
        console.error(error);
        localStorage.removeItem("token");
        window.location = "/";
    };
};

const conectarSocket = async()=>{
    socket = io({ extraHeaders: {
        "Authorization": localStorage.getItem("token")
    }});

    socket.on("connect", ()=>{
        const badge = document.querySelector("#status_badge");
        badge.classList.remove("bg-danger", "border-danger", "text-danger");
        badge.classList.add("bg-success", "border-success", "text-success");
        badge.innerHTML = "ONLINE";
    });
    
    socket.on("disconnect", ()=>{
        const badge = document.querySelector("#status_badge");
        badge.classList.remove("bg-success", "border-success", "text-success");
        badge.classList.add("bg-danger", "border-danger", "text-danger");
        badge.innerHTML = "OFFLINE";
    });

    socket.on("messages", drawMesssages);
    socket.on("active_users", drawUsers);
    socket.on("private_message", appendPrivateMessage);
};

const drawUsers = (users = [])=>{
    let usersHTML = "";
    const ulUsers = document.querySelector("ul#users");

    users.forEach(({ name, _id })=>{
        usersHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center ${_id == user._id ? "list-group-item-dark": "list-group-item-action"}">
                <div class="d-flex flex-column">
                    <span>${name}</span>
                    <small class="text-muted">${_id}</small>
                </div>
                <span class="p-2 rounded-circle bg-success"></span>
            </li>
        `;
    });
    ulUsers.innerHTML = usersHTML;
};
const drawMesssages = (messages = [])=>{
    let messagesHTML = "";
    const divMessages = document.querySelector("#messages");
    messages = messages.reverse();
    messages.forEach((message)=>{
        const text_color = message.user._id == user._id ? "text-bg-light" : "text-bg-primary";
        const header = message.user._id == user._id ? "" : `<div class="card-header">${message.user.name}</div>`;
        const align = message.user._id == user._id ? "align-items-end" : "align-items-start";

        messagesHTML += `
            <div class="d-flex flex-column ${align}" style="width:100%">
                <div class="card ${text_color} mb-2">
                    ${header}
                    <div class="card-body">
                        <p class="card-text">${message.message}</p>
                    </div>
                </div>
            </div>
        `;
    });
    divMessages.innerHTML = messagesHTML;
    divMessages.scrollTo(0, divMessages.scrollHeight)
};
const appendPrivateMessage = (message, itsMe)=>{
    const divMessages = document.querySelector("#messages");
    const cardMessage = document.createElement("div");

    const text_color = "text-bg-dark";
    const header = itsMe ? `<div class="card-header">Susurra a @${message.to}</div>` : `<div class="card-header">${message.user.name}</div>`;
    const align = itsMe ? "align-items-end" : "align-items-start";

    cardMessage.classList.add(`d-flex`);
    cardMessage.classList.add(`flex-column`);
    cardMessage.classList.add(`${align}`);
    cardMessage.style.width = "100%";
    cardMessage.innerHTML = `<div class="card ${text_color} mb-2">${header}<div class="card-body"><p class="card-text">${message.message}</p></div></div>`;

    divMessages.append(cardMessage);
};



formMessage.addEventListener("submit", (e)=>{
    e.preventDefault();
    let message = e.target[0].value.trim();
    let toUserID = message.match(/^(@+[\w\-]+)/i);
    e.target[0].value = null;
    if(!message) return;
    if(toUserID){
        message = message.replace(toUserID[0], "").trim();
        toUserID = toUserID[0].replace("@", "");
        appendPrivateMessage({ message, user, to: toUserID }, true);
    };
    socket.emit("response_message", { message, toUserID });
});

logoutBtn.addEventListener("click", (e)=>{
    localStorage.removeItem("token");
    window.location = "/";
});

const main = async()=>{
    await validarJWT();
    await conectarSocket();
};
main();


