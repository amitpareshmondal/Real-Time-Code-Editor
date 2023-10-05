import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'; 
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import ACTIONS from '../Actions';
const Editor = ({socketRef,roomId,onCodeChange}) => {
    const EditorRef=useRef(null);
    console.log(roomId);
    useEffect(()=>{
        async function init(){
           
            EditorRef.current=CodeMirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode:{name:'javascript',json:"true"},
                theme:"dracula",
                autoCloseTag:true,
                autoCloseBrackets:true,
                lineNumbers:true
            })
          
         
            EditorRef.current.on('change',(instance,changes)=>{
              
              const code=instance.getValue();
              const {origin}=changes;
              onCodeChange(code)
              if(origin!='setValue'){
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                  code,
                  roomId
                })
              }
            });
           
          
          
          //  EditorRef.current.setValue("Hle")
        }
       
          init();
        
      
    },[])
    useEffect(()=>{
      if(socketRef.current){
       
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
          console.log('current');
          console.log(code);
          if(code!==null){
            EditorRef.current.setValue(code);
            console.log(code);
          }
         })
      }
      return ()=>{
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
      
    },[socketRef.current])
  return (
    <div><textarea id='realtimeEditor'></textarea></div>
  )
}

export default Editor