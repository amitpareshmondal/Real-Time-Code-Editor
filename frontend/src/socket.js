import {io} from "socket.io-client";
export const initSocket=async()=>{
    const options={
        'force new connection':true,
        reconnectionAttempt:Infinity,
        timeout:10000,
        transports:['websocket']
    };
    //This will initialize the connection using some options 
    return io("http://localhost:8000/",options);
}