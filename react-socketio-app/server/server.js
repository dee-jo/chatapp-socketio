// SERVER
const app = require('express')();
const http = require('http').createServer(app);

http.listen(3001, () => {
  console.log('listening on :3001');
});


// DB
const db = require('./postgres/DBqueries');


// IO
const USER = 'user1';
const useDB = require('./dummyDB/useDB');

const io = require('socket.io')(http, {
  perMessageDeflate: false
});


io.use((socket, next) => {
  var handshakeData = socket.request;
  console.log("middleware:", handshakeData._query['user']);

  next();
});

io.on("connection", socket => {
  const USER = 'user4';
  console.log("Socket id: ", socket.id, " connected!");
  
  const { connected, userid } = db.checkIfConnected(USER);
  let rooms = [];
  let roomNames = [];

  if (!connected) {
    const res = db.getJoinedRooms(userid);
    rooms = res.rows;
    roomNames = rooms.map(room => {
      return room.name
    })
  }
  


  // CHANGED 'joined rooms' to 'joined room'
  socket.join(roomsNames, (roomName) => {
    // console.log('server, on socket.join, rooms: ', roomsNames);
    io.to(socket.id).emit('joined room', roomName);
  });

  // set up dynamic message listeners for each room
  roomsNames.forEach((roomName) => {
    socket.on(`message for ${roomName}`, data => {

      // useDB.addMessageToRoom(USER, roomName, data.message);
      io.to(roomName).emit(`message for ${roomName}`, data);
      db.addMessage(data.message, userid, roomName);
      // console.log("Received a message from roomName: ", roomName, ", socket.id: ", socket.id , ", message: ", data.message);
      // console.log("Emiting message back to all clients!");
    });
  })

  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      socket.leave(room);
    })
  })
  
  socket.on("disconnect", function() {
    console.log("Socket id: ", socket.id, " disconnected!");
    // TODO: make socket leave rooms
    // useDB.saveToFile();
    //useDB.reloadDB();
  });
});



