const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  perMessageDeflate: false
});

const rooms = ['music', 'sport', 'gardening'];

io.on("connection", socket => {
  console.log("Socket id: ", socket.id, " connected!");

  socket.join(rooms, () => {
    const rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237', 'room 238' ]

    io.to(socket.id).emit('joined rooms', rooms);

    rooms.forEach((room, i) => {
      if (i > 0) {
        io.to(room).emit('a new user has joined the room', room);
      }
    });
  });


  socket.on("chat message", message => {
    console.log("Received a message from ", socket.id, ", message: ", message);
    console.log("Emiting message back to all clients!");
    io.emit("chat message", message);
  });

  socket.on("disconnect", function() {
    console.log("Socket id: ", socket.id, " disconnected!");
  });
});

http.listen(3001, () => {
  console.log('listening on :3001');
});
