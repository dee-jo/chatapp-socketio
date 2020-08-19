require('dotenv').config({path: __dirname + '/.env'});
const fs = require('fs');
const util = require('util')


const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  perMessageDeflate: false
});

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

const messages = [];
const rooms = ['sport', 'music', 'work'];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
}); 

app.get('/client', (req, res) => {
  res.sendFile(__dirname + '/client.js');
});

app.get('/rooms', (req, res) => {
  res.send(rooms);
})

const namespaces = io.of(/^\/\w+$/);

namespaces.on('connection', socket => {
  const namespace = socket.nsp.name;
  console.log('user connected, id:' + socket.id, ', namespace: ' + namespace);

  //writeToFile('namespace', namespace);
  //writeToFile('socket', socket);
  // console.log('socket: ', socket);
  // console.log('namespace: ', namespace);

  io.of(namespace).to(socket.id).emit('past messages', {messages: messages.filter((msg) => {
    return msg.namespace === socket.namespace;
  })});

  socket.broadcast.emit('connected', `User ${socket.id} connected!`);
  console.dir(messages);

  socket.on('chat message', (msg) => {
    console.log('message: ');
    console.dir(msg);
    messages.push(msg);
    io.of(namespace).emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected, id:', socket.id);
    socket.broadcast.emit('disconnected', `User ${socket.client.id} disconnected!`);
  });

});

// this middleware will be assigned to each namespace
namespaces.use((socket, next) => {
  // ensure the user has access to the namespace
  next();
});


// io.on('connection', (socket) => {
//   console.log('user connected, id:' + socket.id);
//   // console.dir(socket);
//   socket.broadcast.emit('connected', `User ${socket.id} connected!`);
//   console.dir(messages);
//   io.to(socket.id).emit('past messages', {messages: [...messages]});

//   socket.on('chat message', (msg) => {
//     // console.log('message: ' + msg);
//     messages.push(msg);
//     io.emit('chat message', msg);
//   });
//   socket.on('disconnect', () => {
//     console.log('user disconnected, id:', socket.id);
//     socket.broadcast.emit('disconnected', `User ${socket.client.id} disconnected!`);
//   });

// })

http.listen(3000, () => {
  console.log('listening on *:3000');
});


const writeToFile = (fileName, file) => {
  fs.writeFile(`${fileName}.json`, util.inspect(file), () => {});
}