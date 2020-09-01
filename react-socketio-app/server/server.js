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
  let connected;
  let userid;

  db.checkIfConnected(USER).then((res) => {
    console.log(res);
    connected = res.rows[0].connected;
    userid = res.rows[0].userid;

    console.log('server.js line 41, connected: ', connected, 'userid: ', userid);
    if (!connected) {
      initialiseSocket(userid, socket);
    }
  });
 
});

 
const initialiseSocket = (userid, socket) => {
  let joinedRooms = [];

  db.getJoinedRooms(userid)
  .then(res => {
    console.log('server.js line 56, getJoinedRooms result rows: ', res.rows);
    joinedRooms = res.rows;
    return joinedRooms;
  })
  .then(joinedRooms => {
    const roomNames = joinedRooms.map(room => room.name);
    return roomNames;
  })
  .then(roomNames => {

    socket.join(roomNames, () => {
      console.log('at socket.join, roomNames: ', roomNames);
        // console.log('server, on socket.join, rooms: ', roomsNames);
        io.to(socket.id).emit('joined rooms', roomNames);
    });

    db.getUsersAndMessagesPerRoom(userid, joinedRooms.map(room => room.roomid))
    .then(roomsMap => {
      // console.log('roomsMap in server: ', roomsMap);
      io.to(socket.id).emit('past messages', roomsMap);
    })

    // set up dynamic message listeners for each room
    roomNames.forEach((roomName) => {
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
    })
  })
  .catch((err) => {
    console.log('server.js@line:104:err: ', err);
  }); 
    
}
