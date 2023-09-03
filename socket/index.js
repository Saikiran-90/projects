import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from 'http';
import { Server } from 'socket.io';
import  mongoose  from 'mongoose';


const app = express();
const port = 9009;

const __dirname = dirname(fileURLToPath(import.meta.url));


const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// connect to mongodb url
 mongoose.connect("mongodb://localhost:27017/chatapp",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log("Connected to mongodb");

const Schema1 = new mongoose.Schema({
    name1: String,
});

const Collection = mongoose.model("User",Schema1);
const message = mongoose.model("Message",Schema1);

app.get("/",(req,resp)=>{
    resp.sendFile(__dirname + "/public/home.html");
});

app.post("/chat",(req,resp)=>{
    const nm = req.body["name1"];
    const User = new Collection({name1:nm});
    User.save();
  
    console.log(User);
    resp.sendFile(__dirname+"/public/index.html");
});

io.on('connection',(sock)=>{
  
    sock.on('message'  ,(msg)=>{
        const Message = new message({name1:msg});
        Message.save();   
    console.log(msg);
       io.emit('message',msg);
 });
});

server.listen(port,()=>{
    console.log(`Server started At Location ${port}`);
});
