const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  perMessageDeflate: false
});


io.on("connection", socket => {
  console.log("Socket id: ", socket.id, " connected!");

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
