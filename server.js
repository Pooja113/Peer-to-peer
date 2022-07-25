const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4} = require('uuid')

app.set('view engine','ejs');
app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.redirect(`/${v4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room', {roomID: req.params.room})
})

io.on('connection', socket =>{
  socket.on('join-room', (roomID,userID)=>{
    socket.join(roomID)
    socket.to(roomID).emit('user-connected',userID)
    //console.log(roomID,userID)
  })
})

server.listen(3000);