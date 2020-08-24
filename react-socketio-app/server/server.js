const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  perMessageDeflate: false
});
const getMessagesByRooms = require('./socketioManager').getMessagesByRooms;
const rooms = ['music', 'sport', 'gardening', 'dance', 'yoga'];

io.on("connection", socket => {
  console.log("Socket id: ", socket.id, " connected!");

  // TODO: get rooms joined by a user from the db

  socket.join(rooms, () => {
    const rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]

    const messagesByRooms = getMessagesByRooms(rooms);
    io.to(socket.id).emit('joined rooms', rooms, messagesByRooms);

    rooms.forEach((room, i) => {
      if (i > 0) {
        io.to(room).emit('a new user has joined the room', room);
      }
    });
  });


  socket.on("chat message", data => {
    console.log("Received a message from ", socket.id, ", message: ", data.message);
    console.log("Emiting message back to all clients!");
    io.to(data.room).emit("chat message", data.message);
  });

  socket.on("disconnect", function() {
    console.log("Socket id: ", socket.id, " disconnected!");
  });
});

http.listen(3001, () => {
  console.log('listening on :3001');
});
