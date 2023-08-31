import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { Server } from 'socket.io';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 9009;

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,resp)=>{
    resp.sendFile(__dirname + "/public/home.html");
})

app.post("/chat",(req,resp)=>{
    const name = req.body["name1"];
    console.log(name);
    resp.sendFile(__dirname+"/public/index.html",name);
});

io.on('connection',(sock)=>{
  
    sock.on('message'  ,(msg)=>{
    console.log(msg);
       io.emit('message',msg);
 });
});

server.listen(port,()=>{
    console.log(`Server started At Location ${port}`);
});


