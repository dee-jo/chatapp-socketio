// SERVER
const app = require('express')();
const http = require('http').createServer(app);

http.listen(3001, () => {
  console.log('listening on :3001');
});


// DB
const db = require('./postgres/DBqueries');

// SOCKETIO

const io = require('socket.io')(http, {
  perMessageDeflate: false
});

// SOCKETIO AUTHENTICATION;

const authenticate = async (socket, data, callback) => {
  console.log('[server.js@authenticate, client: ]', socket.id);
  const { username, password } = data;
  console.log('username: ', username, 'password: ', password);
  return db.verifyUser({name: username, password}, (passwordValid) => {
    console.log('validPassword in callback: ', passwordValid);  
    if (passwordValid) {
      db.checkIfConnected(username)
      .then((res,err) => {
        const connected = res.rows[0].connected;
        return connected 
            ? callback(new Error("User is already connected!"))
            : callback(null, username && passwordValid && !connected);
      });
    } else {
      return callback(new Error("User not verified"));
    }
  });
        
}

const postAuthenticate = (socket, data) => {
    const username = data.username;
    console.log('In postAuthenticate!, data.username: ', username);
    initialiseSocket(username, socket);
};

const socketioAuth = require("socketio-auth");
socketioAuth(io, { authenticate, postAuthenticate });

 
const initialiseSocket = (username, socket) => {
  let joinedRooms = [];

  db.getJoinedRooms(username)
  .then(rows => {
    console.log('server.js line 56, getJoinedRooms res: ', rows);
    joinedRooms = rows;
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
    // console.log('[server.js], userid: ', userid);
    console.log('[server.js], joinedRooms: ');
    console.dir(joinedRooms);

    db.getUsersAndMessagesPerRoom(username, joinedRooms.map(room => room.roomid))
    .then(roomsMap => {
      console.log('roomsMap in server: ', roomsMap);
      io.to(socket.id).emit('past messages', roomsMap);
    });

    // set up dynamic message listeners for each room
    roomNames.forEach((roomName) => {
      socket.on(`message for ${roomName}`, ({message}) => {

        io.to(roomName).emit(`message for ${roomName}`, {message: message});
        console.log('message received: ', message);
        db.addMessage(message);
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
