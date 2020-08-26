const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  perMessageDeflate: false
});

const USER = 'user1';

io.use((socket, next) => {
  var handshakeData = socket.request;
  console.log("middleware:", handshakeData._query['user']);
  next();
});

// const rooms = ['music', 'sport', 'gardening', 'dance', 'yoga'];
const db = require('./useDB');

io.on("connection", socket => {
  console.log("Socket id: ", socket.id, " connected!");
  db.getRoomsForUser()
  
  // get rooms joined by a user from the db
  const rooms = db.getRoomsForUser(USER);  
  console.log('server, io.on(\'connection\'), rooms: ', rooms );
  const roomsNames = rooms.map((room => {
    return room.roomName;
  }));

  socket.join(roomsNames, () => {
    console.log('server, on socket.join, rooms: ', roomsNames); // [ <socket.id>, 'room 237', 'room 238' ]

    io.to(socket.id).emit('joined rooms', rooms);

    rooms.forEach((room, i) => {
      if (i > 0) {
        // io.to(room).emit('a new user has joined the room', room);
      }
    });
  });

  // set up dynamic message listeners for each room
  rooms.forEach((room) => {
    socket.on(`message for ${room}`, data => {
      console.log("Received a message from room: ", room, ", socket.id: ", socket.id , ", message: ", data.message);
      console.log("Emiting message back to all clients!");
      io.to(room).emit(`message for ${room}`, data.message);
    });
  })
  

  socket.on("disconnect", function() {
    console.log("Socket id: ", socket.id, " disconnected!");
  });
});

http.listen(3001, () => {
  console.log('listening on :3001');
});
