const express = require("express");
const socketio = require("socket.io");
const app = express();
const mysql = require("mysql");
app.use(express.static("public"));


let messagesDB = [];
const server = app.listen("3000");
const io = socketio(server);

const sqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"realtimeChat"
})


io.on("connection",(socket)=>{
    sqlConnection.query("SELECT * FROM messages",(err,data)=>{
        if(err) throw err;
        else{
            socket.emit("getchat",{
                chatdata:data
            })
        }
    })      
    socket.on("chat",(data)=>{
        io.sockets.emit("chat",{
            data:data
        })
        sqlConnection.query("INSERT INTO messages(sender,message) VALUES (?,?)",[data.sender,data.message],(err,data)=>{
            if(err) throw err;
            else{
                console.log("Query Successful!");
            }
        })
    })

    socket.on("broadcast",(data)=>{
        io.sockets.emit("broadcast",{
            data:data
        })
    })
})