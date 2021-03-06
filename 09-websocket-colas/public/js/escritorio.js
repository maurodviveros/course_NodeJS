const socket = io();
const searchParams = new URLSearchParams(window.location.search);
const lblEscritorio = document.querySelector("#lblEscritorio");
const lblTicket = document.querySelector("#lblTicket");
const lblNoTickets = document.querySelector("#lblNoTickets");
const lblPendientes = document.querySelector("#lblPendientes");
const btn = document.querySelector("#attendTicket");

if(!searchParams.has("escritorio")){
    window.location = "/";
    throw new Error("el Escritorio es obligatorio");
};

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText =  escritorio;

btn.addEventListener("click", ()=>{

    socket.emit("attend_ticket", { escritorio }, (payload)=>{
        if(!payload){
            lblNoTickets.style.display = "block";
            return;
        }

        lblTicket.innerText = payload.numero;
    });
});

socket.on("remaining_tickets", (ticketsCount)=>{
    if(!ticketsCount){
        lblNoTickets.style.display = "block";
        lblPendientes.style.display = "none";
        btn.disabled = true;
    } else{
        lblNoTickets.style.display = "none";
        lblPendientes.style.display = "block";
        lblPendientes.innerText = ticketsCount;
        btn.disabled = false;
    }
});