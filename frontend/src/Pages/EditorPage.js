import React, { useEffect, useRef, useState } from 'react'
import Client from '../Components/Client'
import Editor from '../Components/Editor'
import { initSocket } from '../socket'
import {useLocation, useNavigate, useParams,Navigate} from "react-router-dom";
import ACTIONS from '../Actions'
import { toast } from 'react-hot-toast';
const EditorPage = () => {
  const [clients,SetClients]=useState([
  ])
  const socketRef=useRef(null);
  const codeRef=useRef(null);
  const location=useLocation();
  const params=useParams();
  const reactNavigate=useNavigate();
  useEffect(()=>{
    //Whenever the page renders for first time, the connection with the backend is intialized
    //We are using useRef, so that on reconnection , it won't render
    
    const init=async()=>{
      console.log('username',location.state?.username);
      socketRef.current=await initSocket();
      // Instead of writting the events all the time , what we are doing is that we are storing all the events in a Actions.js as objects
      //and whenever we would require it , we would be getting its value
      socketRef.current.on('connection_error',(err)=>handleErrors(err));
      socketRef.current.on('connection_failed',(err)=>handleErrors(err));
      function handleErrors(err){
        console.log(err);
        toast.error('Socket Connection failed, try again later');
        reactNavigate('/');
      }
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId:params.roomID,
        username:location.state?.userName
      });
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketID})=>{
        if(location.state?.userName!==username){
          toast.success(`${username} joined the room`)
          console.log(`${username} joined`);
        }
        SetClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,({code:codeRef.current
        ,socketID
        }))
      })
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketID,username})=>{
        toast.success(`${username} left the room`);
        SetClients((prev)=>{
          return prev.filter((client)=>client.socketID!=socketID)
        })
      })
    }
    init();
    return ()=>{
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }
  },[])
  if(!location.state){
    <Navigate to="/"/>
  }
  const Copy=async ()=>{
    try{
      await navigator.clipboard.writeText(params.roomID);
      toast.success("Room Id Copied Successfully")
    }
    catch(err){
      toast.error("Could not Copy");
      console.error(err);
    }
  }
  const Leave=()=>{
    reactNavigate("/")
  }
  return (
   <div className='mainWrap'>
    <div className='aside'>
      <div className='asideInner'>
        <div className='logo'>
          <img src='/CodingRanger9.png' className='logoImage'/>
        </div>
        <h3>Connected</h3>
        <div className='clientsList'>
          {
            clients.map((client)=>{
              return(
                <Client  username={client.username}/>

              )
            })
          }
        </div>
      </div>
      <button className='btn copyBtn' onClick={Copy}>Copy Room ID</button>
      <button className='btn leaveBtn' onClick={Leave}>Leave</button>
    </div>
    <div className='editorWrap'><Editor socketRef={socketRef} roomId={params.roomID} onCodeChange={(code)=>codeRef.current=code}/></div>
   </div>
  )
}

export default EditorPage