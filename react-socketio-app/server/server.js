const app = require('express')();
const http = require('http').createServer(app);


const USER = 'user1';
const useDB = require('./useDB');

const io = require('socket.io')(http, {
  perMessageDeflate: false
});

io.use((socket, next) => {
  var handshakeData = socket.request;
  console.log("middleware:", handshakeData._query['user']);
  next();
});

io.on("connection", socket => {
  console.log("Socket id: ", socket.id, " connected!");
  useDB.getRoomsForUser()
  
  // get rooms joined by a user from the useDB
  const rooms = useDB.getRoomsForUser(USER);  
  console.log('server, io.on(\'connection\'), rooms: ', rooms );
  const roomsNames = rooms.map((room => {
    return room.roomName;
  }));

  socket.join(roomsNames, () => {
    console.log('server, on socket.join, rooms: ', roomsNames);

    io.to(socket.id).emit('joined rooms', rooms);
  });

  // set up dynamic message listeners for each room
  roomsNames.forEach((roomName) => {
    socket.on(`message for ${roomName}`, data => {
      useDB.addMessageToRoom(USER, roomName, data.message);
      console.log("Received a message from roomName: ", roomName, ", socket.id: ", socket.id , ", message: ", data.message);
      console.log("Emiting message back to all clients!");
      io.to(roomName).emit(`message for ${roomName}`, data);
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

http.listen(3001, () => {
  console.log('listening on :3001');
});
