const socket = io('/')
const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined,{
  host:'/',
  port: '3001'
})

const myVideo = document.createElement('video');
myVideo.muted = true
const peers = {}

var getUserMedia = navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(  stream=>{
  addVideo(myVideo,stream);

  myPeer.on('call',call => {
    call.answer(stream);
    const video = document.createElement('video');

    call.on('stream',userVideoStream=>{
      addVideo(video,userVideoStream)
    })
  })
  socket.on('user-connected',userID=>{
      connectToNewUser(userID,stream)
    })
}).catch((err)=>{
  console.log(err,"Unable to connect")
});

socket.on('user-disconnected',userID=>{
  if(peers[userID]) peers[userID].close()
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


function connectToNewUser(userID,stream){
  const call  = myPeer.call(userID,stream)
  const video = document.createElement('video');

  call.on('stream',userVideoStream=>{
    addVideo(video,userVideoStream)
  })

  call.close('close',()=>{
    video.remove();
  })

  peers[userID] = call
}