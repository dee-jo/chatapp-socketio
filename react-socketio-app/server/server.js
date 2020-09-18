// DB
const db = require('./postgres/DBqueriesKNEX');

// SERVER
const app = require('express')();
const http = require('http').createServer(app);

// SOCKETIO

const io = require('socket.io')(http, {
  perMessageDeflate: false
});

// SERVER CONFIGURATION
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());  
app.use(bodyParser.json());

// SERVER API ENDPOINTS
app.post('/joinRooms', (req, res) => {
  if (!req.body||req.body=={}) {
    return res.status(400).send("Bad Request")
  }
  const {rooms, username} = req.body;
  db.storeJoinRequests(rooms, username)
  .then(result => {
    return res.status(200).send("Room access requests successful.");
  })
  .catch(error => {
    return res.status(403).send(error);
  })
});

app.post('/signup', (req, res) => {
  if (!req.body||req.body=={}){
    return res.status(400).send("Bad Request")
  }
  const { username, password } = req.body;

  db.signupNewUser({username, password})
  .then(response => {
    if (response) {
      console.log('Signup response: ', response);
      return res.status(201).send({success: true});
    }
  })
  .catch(error => {
    console.log('Signup error: ', error);
    return res.status(403).send(error);
  })
});

http.listen(3001, () => {
  console.log('listening on :3001');
});


// SOCKETIO AUTHENTICATION;

const authenticate = (socket, data, callback) => {
 // return callback(new Error('User unauthenticated'));
  console.log('[server.js@authenticate, client: ]', socket.id);
  const { username, password } = data;
  console.log('username: ', username, 'password: ', password);
  
  db.verifyUser({name: username, password})
  .then(passwordValid => {
    return !passwordValid 
      ? callback(new Error(`Invalid username or password !`), false)
      : db.checkIfConnected(username)
  })
  .then(alreadyConnected => { // TODO: SET USER AS CONNECTED
    return !alreadyConnected 
      ? callback(null, true)
      : callback(new Error(`User already connected!`), false)
  })
  .catch(dbError => {
    console.log('Verification error server.js@65: ', dbError);
    return callback(new Error(`Invalid username or password !, error: ${dbError}`), false);
  })
  .catch(err => {
    console.log('Verification failed with error: ');
    return false;
  })
}

const postAuthenticate = (socket, data) => {
    const username = data.username;
    console.log('In postAuthenticate!, data.username: ', username);
    initialiseSocket(username, socket);
};

const socketioAuth = require("socketio-auth");
socketioAuth(io, { authenticate, postAuthenticate });

 
const initialiseSocket = (username, socket) => {
  return emitPreviouslyJoinedRooms(username, socket)
  .then((joinedRooms, joinedRoomNames) => {
    emitRoomsWithMessages(username, socket, joinedRooms)
    setDisconnectingEvents(socket);
    return joinedRooms;
  })
  .then(joinedRooms => {
    emitAllExistingRooms(socket);
    emitAllAvailableUsers(socket);
    emitNotifications(socket, username);
    return joinedRooms;
  })
  .then(joinedRooms => {
    const roomNames = joinedRooms.map(room => room.name);
    setMessageListenersForEachRoom(roomNames);
    setJoinReqConfirmationListener(socket)
  })
  .catch(error => {
    console.error(error); 
    emitAllExistingRooms(socket);
    emitAllAvailableUsers(socket);
  });
}

// EVENT HELPER METHODS

const setDisconnectingEvents = (socket) => {
  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      socket.leave(room);
    })
  })
  socket.on("disconnect", function() {
    console.log("Socket id: ", socket.id, " disconnected!");
  })
}
  
const setJoinReqConfirmationListener = (socket) => {
  socket.on('confirm join request', (req) => {
    db.confirmJoinRequest(req)
    .then(res => {
      // io.to(socket.id).emit('room request confirmation')
    })
    .catch(error => {
      console.log('[server@setJoinReqConfirmatinListener], error: ', error);
    })
    // console.log('received confirmation for request id: ', req);
  })
}

const setMessageListenersForEachRoom = (roomNames) => {
  roomNames.forEach((roomName) => {
    socket.on(`message for ${roomName}`, ({message}) => {
      io.to(roomName).emit(`message for ${roomName}`, {message: message});
      console.log('message received: ', message);
      db.addMessage(message);
    });
  })
}

const emitPreviouslyJoinedRooms = (username, socket) => {
  return db.getJoinedRooms(username)
  .then(joinedRooms => {
    const joinedRoomNames = joinedRooms.map(room => room.name);
    socket.join(joinedRoomNames, () => {
      io.to(socket.id).emit('joined rooms', joinedRoomNames);
    })
    return joinedRooms;
  })
  .catch(error => {
    console.log('[server@emitPreviouslyJoinedRooms], error: ', error);
  }) 
}

const emitRoomsWithMessages = (username, socket, joinedRooms) => {
  const joinedRoomsIds = joinedRooms.map(room => room.roomid)
  db.getUsersAndMessagesPerRoom(username, joinedRoomsIds)
  .then(roomsMap => {
    // console.log('roomsMap in server: ', roomsMap);
    io.to(socket.id).emit('past messages', roomsMap);
  })
  .catch(error => {
    console.log('[server@emitRoomsWithMessages], error: ', error);
  })
}

const emitAllExistingRooms = (socket) => {
  db.getAllExistingRooms()
    .then(res => {
      console.log('all rooms: ', res);
      io.to(socket.id).emit('available rooms', res)
    })
    .catch(error => {
      console.error(error);
    }) 
}

const emitAllAvailableUsers = (socket) => {
  db.getAllAvailableUsers()
  .then(users => {
    io.to(socket.id).emit('available users', users);
  })
}

const emitNotifications = (socket, username) => {
  db.getJoinRoomsRequests(username)
  .then(res => {
    if (res) {
      io.to(socket.id).emit('join room requests', res);
    }
  })
}

