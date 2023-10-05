import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [RoomId, SetRoomId]=useState('');
  const [userName ,SetUserName]=useState('');
  const navigate=useNavigate();
  const createNewRoom=(e)=>{
    e.preventDefault();
    const id= uuidv4();
    SetRoomId(id);
    toast.success('Created a new Room');
    console.log(id);
  }
  const JoinRoom=()=>{
    if(!RoomId||!userName){
      toast.error("Room Id and UserName are required");
      return;
    }
    navigate(`/editor/${RoomId}`,{state:{
      userName
    }})
  }
  const TakeInput=(e)=>{
    if(e.code==='Enter'){
      JoinRoom();
    }
  }
  return (
    <div className='Home'>
        <div className='Form'>
            <img src='/CodingRanger9.png' alt='Coding Image' className='mainImage'></img>
            <h4 className='mainLabel'>Paste Invitation Room ID</h4>
            <div className='inputGroup'>
                <input className='inputBox' type='text' placeholder='Room Id' value={RoomId} onChange={(e)=>SetRoomId(e.target.value)} onKeyUp={TakeInput}/>
                <input className='inputBox' type='text' placeholder='UserName' value={userName} onChange={(e)=>SetUserName(e.target.value)} onKeyUp={TakeInput}/>
                <button className='btn joinBtn' onClick={JoinRoom}>Join</button>
                <span className='createInfo'>If You Don't Have an invite ID then &nbsp; <a href='' className='createNewBtn' onClick={createNewRoom}>New Room</a> </span>
            </div>
        </div>
        <footer>
            <h4>Built With 💛 by &nbsp; <a href='https://www.github.com/amitpareshmondal'>Amit Mondal</a></h4>
        </footer>
    </div>
  )
}

export default Home