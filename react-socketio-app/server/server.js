// DB
const db = require('./postgres/DBqueriesKNEX');

// SERVER
const app = require('express')();
const http = require('http').createServer(app);

// SOCKETIO

const io = require('socket.io')(http, {
  perMessageDeflate: false
});

const userSocketMap = {};

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
  userSocketMap[username] = socket.id;
  console.log('username: ', username, 'password: ', password);
  
  return db.verifyUser({name: username, password})
  .then(passwordValid => {
    return !passwordValid 
      ? callback(new Error(`Invalid username or password !`), false)
      : db.checkIfConnected(username, socket.id)
  })
  .then(alreadyConnected => { // TODO: SET USER AS CONNECTED
    console.log(typeof alreadyConnected)
    return !alreadyConnected
      ? callback(null, true)
      : callback(new Error(`User already connected!`), false)
  })
  .catch(dbError => {
    console.log('Verification error @server: ', dbError);
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
    initialiseSocket(socket, username);
};

const socketioAuth = require("socketio-auth");
socketioAuth(io, { authenticate, postAuthenticate });

 
const initialiseSocket = (socket, username) => { 
  return getPreviouslyJoinedRooms(username)
  .then((joinedRooms) => {
    initialiseClientWithExistingRooms(joinedRooms, socket, username);
  })
  .catch(error => { // if user didn't join any rooms before db will throw error when getting past rooms
    console.error('[server@initialiseSocket], error: ', error); 
    initialiseClientWithNoRooms(socket, username);
  });
}

// EVENT GROUPING METHODS
const initialiseClientWithExistingRooms = (joinedRooms, socket, username) => {
  const roomNames = joinedRooms.map(room => room.name);
  console.log('[server@initialiseClientWithExistingRooms] roomNames: ', roomNames);
    emitPreviouslyJoinedRooms(socket, joinedRooms)
    emitRoomsWithMessages(username, socket, joinedRooms)
    emitPrivateMessages(username, socket);
    setMessageListenersForEachRoom(roomNames, socket);
    setPrivateMessageListener(socket, username);
    setDisconnectingEvents(socket, username);
    emitJoinReqPendingApproval(socket, username);
    emitJoinReqApproved(socket,username);
    emitJoinReqWaitingForApproval(socket, username);
    emitRoomsNotJoined(roomNames, socket, username); // all rooms minus (previously joined or already requested)
    emitAllAvailableUsers(socket);
    setJoinReqConfirmationListener(socket) // for room admins confirming other users
}

const initialiseClientWithNoRooms = (socket, username) => {
  emitAllExistingRooms(socket);
  emitAllAvailableUsers(socket);
  setPrivateMessageListener(socket, username);
}

// EVENT HELPER METHODS
const setDisconnectingEvents = (socket, username) => {
  socket.on("disconnecting", () => {
    delete userSocketMap[username];
    db.disconnectUser(username)
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
    db.approveJoinRequest(req)
    .then(res => {
      // io.to(socket.id).emit('room request confirmation')
    })
    .catch(error => {
      console.log('[server@setJoinReqConfirmatinListener], error: ', error);
    })
    // console.log('received confirmation for request id: ', req);
  })
}

const setPrivateMessageListener = (socket, username) => {
  console.log(`setPrivateMessageListener for ${username}, socket: ${socket.id}`)
  socket.on('private message', (pm) => {
    const {
      date,
      messagetext,
      receipientName,
      sender
    } = pm;
    
    console.log(receipientName, 'recieved private message from ', sender, 'message: ');
    console.dir(messagetext);
    // console.log(`receipientName: ${receipientName}, current user: ${username}`);
    // console.log(`here's ${receipientName}: sending back message: `);
    socket.emit('private message', pm )
    if (userSocketMap[receipientName]) {
      const receipientID = userSocketMap[receipientName];
      io.to(receipientID).emit('private message', pm);
    }
    db.storePrivateMessage(receipientName, sender, messagetext, date);
  })
}

const setMessageListenersForEachRoom = (roomNames, socket) => {
  roomNames.forEach((roomName) => {
    socket.on(`message for ${roomName}`, ({message}) => {
      io.to(roomName).emit(`message for ${roomName}`, {message: message});
      console.log('message received: ', message);
      db.addMessage(message);
    });
  })
}

const getPreviouslyJoinedRooms = (username) => {
  return db.getJoinedRooms(username)
}

const emitPreviouslyJoinedRooms = (socket, joinedRooms) => {
  const joinedRoomNames = joinedRooms.map(room => room.name);
  socket.join(joinedRoomNames, () => {
    io.to(socket.id).emit('joined rooms', joinedRoomNames);
  })
  return joinedRooms;
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

const emitPrivateMessages = (username, socket) => {
  db.getPrivateMessages(username)
  .then(res => {
    // console.log('[server@emitPrivateMessages] res: ', res);
    io.to(socket.id).emit('past private messages', res);
  })
  .catch(error => {
    console.log('[emitPrivateMessages] Could not get private messages, error: ', error)
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

const emitRoomsNotJoined = (joinedRoomNames, socket, username) => {
  db.getRoomsNJoinedNrequested(joinedRoomNames, username)
  .then(res => {
    io.to(socket.id).emit('available rooms', res)
  })
  .catch(error => {
    console.log('[server@emitRoomsNotJoined], error: ', error);
  })
}

const emitAllAvailableUsers = (socket) => {
  db.getAllAvailableUsers()
  .then(users => {
    io.to(socket.id).emit('available users', users);
  })
}

const emitJoinReqPendingApproval = (socket, username) => {
  db.getPreviousJoinRequests(username)
  .then(res => {
    console.log('[server@emitJoinReqPendingApproval] response: ', res);
    const previousRequests = res.map(reqs => reqs.requested_room);
    io.to(socket.id).emit('join requests pending approval', previousRequests);
  })
}

const emitJoinReqApproved = (socket, username) => {
  db.getRequestsApproved(username)
  .then(res => {
    console.log('[server@emitJoinReqPendingApproval] response: ', res);
    const previousRequests = res.map(reqs => reqs.requested_room);
    io.to(socket.id).emit('join requests approved', previousRequests);
  })
}

const emitJoinReqWaitingForApproval = (socket, username) => {
  db.getJoinRoomsRequests(username)
  .then(res => {
    if (res) {
      io.to(socket.id).emit('join room requests to approve', res);
    }
  })
}

