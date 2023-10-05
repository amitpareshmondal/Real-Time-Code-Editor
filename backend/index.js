const express=require("express");
const app=express();
const ACTIONS=require("./Actions");
const http=require("http");
const {Server}=require("socket.io");
const server=http.createServer(app);
const io=new Server(server);
const userMap={};
function getAllConnectedClients(roomID){
    return Array.from(io.sockets.adapter.rooms.get(roomID)||[]).map((socketID)=>{
        return {
            socketID,
            username:userMap[socketID],
        }


    })
}
io.on('connection',(socket)=>{
    console.log("socket connected",socket.id);
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        console.log(roomId);
        console.log(username);
        userMap[socket.id]=username;
        socket.join(roomId)
        const clients=getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({socketID})=>{
            io.to(socketID).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketID:socket.id
            })
        })
    })
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        console.log(roomId);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{
            code:code
        })
    })
    socket.on(ACTIONS.SYNC_CODE,({socketID,code})=>{
        
        io.to(socketID).emit(ACTIONS.CODE_CHANGE,{
            code:code
        })
    })
    socket.on('disconnecting',()=>{
        // we are getting all the roomIDs in which the user is present
        const rooms=[...socket.rooms];
        rooms.forEach((roomID)=>{
            socket.in(roomID).emit(ACTIONS.DISCONNECTED,{
                socketID:socket.id,
                username:userMap[socket.id]
            })
        });
        console.log("User Left"+ userMap[socket.id]);
        delete userMap[socket.id];
        
        socket.leave();
    })
})

server.listen(8000,()=>{
    console.log("Listening on PORT 8000");
})