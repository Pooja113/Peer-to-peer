const socket = io('/')
const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined,{
  host:'/',
  port: '3001'
})

const myVideo = document.createElement('video');
myVideo.muted = true

var getUserMedia = navigator.mediaDevices.getUserMedia;
getUserMedia({video: true, audio: true}).then(stream=>{
  addVideo(myVideo,stream);
  socket.on('user-connected',userID=>{
    connectToNewUser(userID,stream)
  })
})



myPeer.on('open',userID=>{
  socket.emit('join-room',ROOM_ID,userID)
})



function addVideo(video,stream){
  video.srcObject = stream
  video.addEventListener('loadedmetadata',()=>{
    video.play()
  })
  videoGrid.append(video)
}


function connectToNewUser(video,stream){
  const call  = myPeer.call(userID,stream)
  //call.on('stream')
}