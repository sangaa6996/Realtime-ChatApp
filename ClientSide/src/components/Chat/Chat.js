import React,{useState, useEffect} from "react";
import queryString from 'query-string'
import io from 'socket.io-client'

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import './Chat.css'

let socket

const Chat=({ location })=>{
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [message,setMessage]=useState('');
    const [messages,setMessages]=useState([]);

    const ENDPOINT='http://localhost:5000/'

    useEffect(() => {
        const {name, room }=queryString.parse(location.search) 
        socket=io(ENDPOINT,{ transports: ["websocket"] })

        setName(name)
        setRoom(room)

        getOldMessage()

        socket.emit('join', {name,room},()=>{
        })

        return()=>{
            // socket.emit('disconnect');
            socket.disconnect()
            
            socket.off();
        }
    }, [ENDPOINT, location.search] )

    useEffect(()=>{
        socket.on('message',(user)=>{
            setMessages([...messages,user]);
        })
    },[messages])

    const getOldMessage=async ()=>{
        const response=await fetch("http://localhost:5000/"+room)
        const oldMessage=await response.json();
        setMessages(oldMessage)
    }

    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''))
        }
    }

    return(
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room}/>
                {/* <input
                value={message}
                onChange={(event)=>{setMessage(event.target.value)}}
                onKeyPress={event=>event.key==='Enter'? sendMessage(event) : null}
                /> */}
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;