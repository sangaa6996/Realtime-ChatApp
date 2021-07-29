const express=require('express');
const socketio=require('socket.io')
const http=require('http')
const cors=require('cors')

const {addUser, removeUser, getUser, getUserInRoom} = require('./user')

const PORT=process.env.PORT||5000;

const router=require('./router')

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sangaa6996:a94103170@cluster0.scbjs.mongodb.net/Messages?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if(err){
        console.log(''+err)
    }
    else{
        console.log('Mongo connected successful')
    }
});
const Message= require('./models/Message')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

io.on('connection',(socket)=>{
    socket.on('join', ({name,room}, callback)=>{
        const {error, user}= addUser({id:socket.id, name,room})

        if(error) return callback(error)

        socket.emit('message',{user:'admin', text:`${user.name}, Welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text:`${user.name} has joined the room`})
        
        socket.join(user.room)

        io.to(user.room).emit('roomData', {room:user.room, users: getUserInRoom(user.room)})
        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)

        io.to(user.room).emit('message',{user:user.name, text:message})
        io.to(user.room).emit('roomData', {room:user.room, users: getUserInRoom(user.room)})

        var conversation= Message({
            room:user.room,
            text:message,
            user:user.name
        })

        conversation.save(function(err){
            if(err){
                console.log(err)
            }
            else{
                console.log({'kq':1})
            }
        })
        
        callback();
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', {user: 'admin', text:`${user.name} has left!!!`})
        }

        console.log('User disconnected')
    })
})

app.use(router)
app.use(cors())

server.listen(PORT,()=>console.log(`Server has started on port ${PORT}`))