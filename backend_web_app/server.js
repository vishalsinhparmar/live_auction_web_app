import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
})
import { Server } from "socket.io";
import http from 'http';
import app from "./src/app.js";
import { setUpsocketEvents } from "./socketHandler.js";

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET",'POST']
    }
});

setUpsocketEvents(io);



const PORT = 4000;
server.listen(PORT,()=>{
     console.log(`server + socket.io is running http://localhost:${PORT}`)
});
