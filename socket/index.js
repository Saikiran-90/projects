import express from 'express';
// import session from 'express-session';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 9009;

const __dirname = dirname(fileURLToPath(import.meta.url));


const server = http.createServer(app);
const io = new Server(server);


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,resp)=>{
    resp.sendFile(__dirname + "/public/home.html");
});


app.get("/chat",(req,resp)=>{
      resp.sendFile(__dirname+"/public/index.html");
});  

const users = [];


io.on('connection',(sock)=>{
   
     sock.on('new-user-joined', (name)=>{
          console.log("New user: ",name);
          users[sock.id] = name;
          console.log(users);
          io.emit('user-joined',name);
     });


    sock.on('message',(msg)=>{
        console.log(msg);
        io.emit('message',{'message': msg , 'name' : users[sock.id]});
   });
});

server.listen(port,()=>{
    console.log(`Server started At Location ${port}`);
});
