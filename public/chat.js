const socket = io.connect("http://localhost:3000/");

const broadcast = document.querySelector("#broadcast");
const chatBox = document.querySelector("#chat-box");
const sender = document.querySelector("#name");
const message = document.querySelector("#message");
const sendBtn = document.querySelector("#sendBtn");

let messageLimiter = 0;
setInterval(()=>{
    messageLimiter = 0;
},8000)
sendBtn.addEventListener("click", () => {
    messageLimiter++;
    if(messageLimiter < 10){
        socket.emit("chat", {
            sender: sender.value,
            message: message.value
        })
    }else{
        broadcast.innerHTML = "Calm down my nigga!"
    }
    
    
})


socket.on("getchat",obj => {
    obj.chatdata.forEach(asd => {
        chatBox.innerHTML += `<p style="text-align: left; font-size:medium; margin-bottom:10px;"><strong style="color: rgb(17, 115, 200);">${asd.sender}:</strong> ${asd.message}</p>`
    })
})
socket.on("chat", (obj) => {
    chatBox.innerHTML += `<p style="text-align: left; font-size:medium; margin-bottom:10px;"><strong style="color: rgb(17, 115, 200);">${obj.data.sender}:</strong> ${obj.data.message}</p>`
})

socket.on("broadcast",async(obj)=>{
    if(obj.data.typer != sender.value){
        broadcast.innerHTML = `${obj.data.typer} yazıyor...`
    }
    
    setTimeout(()=>{
        broadcast.innerHTML = ``
    },2500)
})
message.addEventListener("input",()=>{
    console.log("changed")
    socket.emit("broadcast",{
        typer:sender.value
    })
})