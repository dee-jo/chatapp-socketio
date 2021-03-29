const bcrypt = require('bcrypt');
const {v4} = require('uuid');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }
});


// _____________________________________________________________
// CHECK IF USER CONNECTED:

const checkIfConnected = (userName, socketid) => {
  return knex('users')
  .where({name: userName})
  .select('userid', 'connected')
  .then(rows => {
    if (rows.length && rows[0].connected==='false') {
      return false
    }
    else return true;
  })
  .then(connected => {
    console.log('connected before update: ', connected)
    if (!connected) {
      console.log('not connected')
      return knex('users')
      .update({
        connected: socketid
      })
      .where('name', userName)
      .returning('connected')
      .then(res => {
        console.log('connected update response: ', res)
        return false;
      })
    }
    else return connected;
  })
  .catch(err => {
    console.error('knex returned error: ', err);
    return true;
  })
}
// TEST:
// checkIfConnected('user5')
// .then(res => {
//   console.log('check if user connected, res: ', res);
// })


// _____________________________________________________________
// DISCONNECT USER:
const disconnectUser = (username) => {
  knex('users')
  .update({connected: 'false'})
  .where('name', username)
  .returning('connected')
  .then(rows => {
    if (rows[0].connected ==='false') {
      throw new Error('Could not update user as disconnected!')
    } 
  })
  .catch(error => {
    console.log(error);
  })
}



// _____________________________________________________________
// SIGNUP NEW USER:

const signupNewUser = ({username, password}) => {
  // console.log('DBqueriesKNEX@signupNewUser!');
  return new Promise((resolve, reject) => {
    knex('users')
    .where({name: username})
    .then(rows => {
      if (rows.length) reject(new Error('User already exists!, db res: ', rows))
      else resolve(rows);
    })
  })
  .then((rows, err)=> {
    if (err) throw new Error(err);
    console.log('User doesn\'t exist, inserting into db');
    const userid = v4();
    return knex('users')
    .insert({
      userid: userid,
      name: username,
      connected: false
    })
    .returning('userid')
  })
  .then((res, err) => {
    // console.log('after db insert: rows: ', res)
    if (!res.length) throw new Error('DB error while inserting new user, error: ', err)
    else return res[0];
  })
  .then(userid => {
    console.log('userid returned from db after inserting user: userid', userid);
    const saltRounds = 10;
    return new Promise((resolveHash, rejectHash) => {
      bcrypt.hash(password, saltRounds, 
        (err, hash) => {
          return err 
            ? rejectHash(new Error(err))
            : resolveHash({userid, hash});
      });
    })
  })
  .then(({userid, hash}, error) => {
      if (userid && hash) {
        return knex('auth')
        .insert({
          userid: userid,
          userhash: hash
        })
        .returning('userid')
      } 
      else throw new Error(error);
  })
  .then(rows => {
    return rows;
  })
}
// TEST:
// signupNewUser({username: 'user112', password: 'user112'})
// .then(res => console.log('signed up new user, res: ', res))
// .catch(error => {
//   console.log(error);
// });




// _____________________________________________________________
// VERIFY USER

const compare =(enteredPassword, dbHash) => {
  return bcrypt.compare(enteredPassword, dbHash)
    .then(result => {
      return result;
      // console.log('password check result: ', result);
    });
}

const verifyUser = (user) => {
  return knex('users')
  .select('userid')
  .where({name: user.name})
  .then(rows => {
    if (!rows.length) throw new Error('User doesn\'t exist!');
    else return rows[0].userid;
  })
  .then(userid => {
    return knex('auth')
    .select('userhash')
    .where({userid: userid})
  })
  .then(rows => {
    if (rows.length) {
      const dbHash = rows[0].userhash;
      console.log('dbHash: ', dbHash);
      return compare(user.password, dbHash);
    }
    else throw new Error('Could not find userhash in db!');
  })
  .then(compareResult => {
    console.log('hash compare result: ', compareResult);
    if (!compareResult) throw new Error('Pasword verification failed!');
    else return compareResult;
  })
}
// TEST:
// verifyUser({name: 'user5', password: 'user5'})
// .then(result => console.log('verifyUser result: ', result))
// .catch(error => {
//   console.log(error);
//   return false;
// })




// _____________________________________________________________
// FIND USER ID

const findUserId = (username) => {
  return knex('users')
  .select('userid')
  .where({name: username})
  .then(rows => {
    if (rows.length) return rows[0].userid;
    else throw new Error(`Could not find userid for user ${username}`);
  })
}
// TEST:
// const username = 'user1';
// findUserId(username)
// .then(userid => {
//   console.log(`userid for user ${username}: ${userid}`)
// })

// _____________________________________________________________
// FIND USER NAME

const findUserName = (id) => {
  return knex('users')
  .select('name')
  .where({userid: id})
  .then(rows => {
    if (rows.length) return rows[0].name;
    else throw new Error(`Could not find userid for user ${username}`);
  })
}




// _____________________________________________________________
// FIND ROOM ID

const findRoomId = (roomname) => {
  return knex('rooms')
  .select('roomid')
  .where({name: roomname})
  .then(rows => {
    if (rows.length) return rows[0].roomid;
    else throw new Error(`Could not get room id for room: ${roomname}`);
  })
}

// TEST:
// const roomname = 'music';
// findRoomId(roomname)
// .then(roomid => 
//   console.log(`room id for room ${roomname}: ${roomid}`)
// )
// .catch(error => {
//   console.log(error);
// })




// _____________________________________________________________
// GET JOINED ROOMS:

const getJoinedRooms = (username) => {
  return findUserId(username)
  .then(userid => {
    // if (!userid) throw new Error(`Couldn't find userid for user: ${username}`)
    return knex('join_room_events')
    .join('rooms', 'join_room_events.roomid', 'rooms.roomid')
    .select(
      'join_room_events.roomid',
      'join_room_events.joineddate',
      'rooms.name'
      )
    .whereRaw(`join_room_events.userid = '${userid}'`)
  })
  .then(rows => {
    if (rows.length) return rows;
    else throw new Error(`Could not find any previously joined rooms for user: ${username}`);
  })
}

// TEST:
// const username = 'user5';
// getJoinedRooms(username)
// .then(res => {
//   console.log(`Joined rooms for user ${username}: `);
//   console.dir(res);
// })




// _____________________________________________________________
// GET ALL EXISTING ROOMS

const getAllExistingRooms = () => {
  return knex('rooms')
  .select('name')
  .then(rows => {
    return rows.map(row => row.name)
  })
}


// _____________________________________________________________
// GET ROOMS NOT JOINED AND NOT YET REQUESTED BY USER

const getRoomsNotJoined = (joinedRoomNames) => {
  return knex('rooms')
  .select('name')
  .then(res => {
    return res.map(r => r.name)
  })
  .then(allRooms => {
    return allRooms.filter(room => {
      return !joinedRoomNames.includes(room);
    })
  })
}
// TEST
// getRoomsNotJoined(['dance', 'work', 'news']);

const getRoomsRequested = (username) => {
  return knex
  .select('rq.requested_room', 'u.name')
  .from('room_requests AS rq')
  .innerJoin('users AS u', 'u.userid', 'rq.requesting_user')
  .where('u.name', username)
  .then(response => {
    // console.log('[getRoomsRequested] response: ', response);
    const mapped = response.map(row => row.requested_room);
    // console.log('[getRoomsRequested] mapped: ', mapped);
    return mapped;
  })
  .catch(error => {
    console.log('[getRoomsRequested] error: ', error);
  })
}


const getRoomsNJoinedNrequested = (joinedRooms, username) => {
  let roomsNotJoined = [];
  return getRoomsNotJoined(joinedRooms)
  .then(roomNames => {
    // console.log('[getRoomsNJoinedNrequested] roomNames: ', roomNames)
    roomsNotJoined = roomNames;
    return getRoomsRequested(username)
  })
  .then(roomsRequested => {
    // console.log('[getRoomsNJoinedNrequested] roomsRequeste: ', roomsRequested)
    // console.log('[getRoomsNJoinedNrequested] roomsNotJoined: ', roomsNotJoined)
    return roomsNotJoined.filter(rs => {
      return !roomsRequested.includes(rs)
    })
  })
  .catch(error => {
    console.log('[getRoomsNJoinedNrequested] error: ', error);
  })
}

// TEST:
// getRoomsNJoinedNrequested(['dance'], 'adriana')
// .then(res => {
//   console.log('[getRoomsNJoinedNrequested] res: ', res);
// })





// _____________________________________________________________
// GET ALL AVAILABLE USERS

const getAllAvailableUsers = () => {
  return knex('users')
  .select('name')
  .then(rows => {
    return rows.map(row => row.name)
  })
}

// _____________________________________________________________
// GET ADMINISTRATORS OF GIVEN ROOMS

const getAdministrators = (rooms) => {
  return knex('rooms')
  .select('*')
  .whereIn('name', rooms)
}

// _____________________________________________________________
// GET ALL PENDING JOIN REQUESTS FOR USER
const getPreviousJoinRequests = (username) => {
  return knex('users')
  .select('userid')
  .where({name: username})
  .then(res => {
    return res[0].userid
  })
  .then(userid => {
    return knex('room_requests')
    .select('requested_room')
    .where('requesting_user', userid)
    .andWhere('confirmed', false);
  })
  .then(res => {
    return res
  })
}

// _____________________________________________________________
// GET ALL ROOM REQUESTS APPROVED FOR THAT USER
const getRequestsApproved = (username) => {
  return knex('users')
  .select('userid')
  .where({name: username})
  .then(res => {
    return res[0].userid
  })
  .then(userid => {
    return knex('room_requests')
    .select('requested_room')
    .where('requesting_user', userid)
    .andWhere('confirmed', true);
  })
  .then(res => {
    return res
  })
}

// _____________________________________________________________
// SEND JOIN REQUESTS TO ROOMS ADMINS

const storeJoinRequests = (rooms, user) => {
  let requestingUserid = '';
  return knex('users')
  .select('userid')
  .where({name: user})
  .then(rows => {
    return rows[0].userid
  })
  .then(userid => {
    requestingUserid = userid;
    return getAdministrators(rooms)
  })
  .then((roomsAdmins) => {
    const longDate = Date.parse(new Date());
    return roomsAdmins.map(ra => {
      return knex('room_requests')
      .insert({
        id: v4(),
        requesting_user: requestingUserid,
        requested_room: ra.name,
        request_for: ra.created_by,
        date: longDate / 1000
      })
      .then(result => {
        // console.log('single room request insert result: ', result);
        return result;
      })
      .catch(error => {
        console.log('single room request insert error: ', error);
      })
    })
  })
  .then(results => {
    return results;
  })
  .catch(error => {
    console.log('[sendJoinRequestToRoomsAdmins@DBqueriesKNEX.js] error: ', error);
  })
}


// _____________________________________________________________
// NOTIFY ADMINS OF JOIN ROOM REQUESTS PENDING APPROVAL
const getJoinRoomsRequests = (username) => {
  return knex('users')
  .select('userid')
  .where({name: username})
  .then(rows => {
    return rows[0].userid;
  })
  .then(userid => {
    return knex
    .select('rq.id', 'rq.requested_room', 'rq.date', 'u.name')
    .from('room_requests AS rq')
    .innerJoin('users AS u', 'u.userid', 'rq.requesting_user')
    .where({
      request_for: userid,
      confirmed: false
    })
  })
  .then(rows => {
    if (rows.length) {
      return rows;
    }
    else return null;
  })
  .catch(error => {
    console.log('[getJoinRoomsRequests()@DBqueriesKNEX.js], error: ', error);
  })
}


// _____________________________________________________________
// CONFIRM JOIN REQUEST

const approveJoinRequest = (req) => {
  console.log('[DBqueriesKNEX@approveJoinRequest] request from client: ', req)
  const reqId = req.id;
  return knex('room_requests')
  .update({confirmed: true})
  .where('id', reqId)
  .returning('requesting_user')
  .then(res => {
    console.log('[DBqueriesKNEX@approveJoinRequest] update response: ', res[0]);
    const userid = res[0];
    return knex('rooms')
    .select('roomid')
    .where('name', req.requested_room)
    .then(res => {
      console.log('roomid response: ', res);
      const roomid = res[0].roomid;
      return { userid , roomid }
    })
  })
  .then(({ userid, roomid }) => {
    const longDate = Date.parse(new Date())
    return knex('join_room_events')
    .insert({
      userid : userid,
      roomid: roomid,
      joineddate: longDate / 1000
    })
  })
  .catch(error => {
    console.log('[DBqueriesKNEX@approveJoinRequest] error: ', error);
  })
}

 
// _____________________________________________________________
// GET USERS IN ROOMS


const getUsersInRoom = (roomid) => {
  return knex
  .select('u.name AS username', 'r.name AS roomname')
  .from('users AS u')
  .innerJoin('messages AS m', 'm.userid', 'u.userid')
  .innerJoin('rooms AS r', 'm.roomid', 'r.roomid')
  .where('m.roomid', roomid)
  .then(rows => {
    const roomUsers = {};
    let roomName = '';
    rows.forEach(row => {
      roomName = row.roomname;
      if (!roomUsers[roomName]) { // check if a key=roomname already exists in roomUsers map
        roomUsers[roomName] = []
      } else {
        const found = roomUsers[roomName].find(username => row.username === username) // check if name already added to room
        if (!found) roomUsers[roomName].push(row.username);
      }
    })
    // console.log('[getUserInRoom], roomUsers: ');
    // console.dir(roomUsers);
    // console.log('[before return] roomName: ', roomName, 'roomUsers: ', roomUsers);
    return {roomName, roomUsers};
  })
  .catch(err => {
    console.log(`Could not get users for room: ${rows[0].roomname}`);
  })
}

const getUsersInRooms = async (roomids) => {
  const roomsAndUsers = {};

  for (const roomid of roomids) {
    const {roomName, roomUsers} = await getUsersInRoom(roomid);
    // console.log('[after await] roomName: ', roomName, 'roomUsers: ', roomUsers);
    roomsAndUsers[roomName] = {
      users: roomUsers[roomName]
    }
  }
  // console.log('roomsAndUsers: ', roomsAndUsers);
  return roomsAndUsers;
}

// _____________________________________________________________
// STORE PRIVATE MESSAGE:
const storePrivateMessage = (receipientName, senderName, message, date) => {
  return findUserId(senderName)
  .then(senderid => {
    return findUserId(receipientName)
    .then(receipientid => {
      return {senderid, receipientid}
    })
  })
  .then(({senderid, receipientid}) => {
    return knex('private_messages')
    .insert({
      messageid: v4(),
      senderid: senderid,
      receipientid: receipientid,
      date,
      message: message
    })
    .returning('messageid')
  })
  .then(messageid => {
    console.log('[DBknex@storePrivateMessage] stored messageid: ', messageid)
  })
  .catch(error => {
    console.log('[DBknex@storePrivateMessage] error: ', error)
  })
}

// _____________________________________________________________
// GET PRIVATE MESSAGES

const PMchats = {};
const getPrivateMessages = (username) => {
  let id = '';
  return findUserId(username)
  .then(userid => {
    id = userid;
    return getPMsentBy(userid)
  })
  .then(res => {
    return addToPMchats(username, true, res)
  })
  .then(_ => {
    // console.log('[getPrivateMessages] PMchats as sender: ', PMchats['user200'])
    return getPMreceivedBy(id)
  })
  .then(res => {
    return addToPMchats(username, false, res)
  })
  .then(_ => {
    // console.log('[getPrivateMessages] PMchats as receiver: ', PMchats)
    return PMchats;
  })
  .catch(error => {
    console.log('[DB@getPrivateMessages] error: ', error);
  })
}

const addToPMchats = (username, isSender, res) => {
  return res.map(row => {
    const newMessage = {
      messageid: row.messageid,
      senderName: isSender ? username : row.senderName,
      receipientName: isSender ? row.receipientName : username,
      date: row.date,
      message: row.message
    }
    if (isSender) {
      if (PMchats[row.receipientName] && PMchats[row.receipientName].messages) {
        PMchats[row.receipientName].messages.push(newMessage)
      }
      else {
        PMchats[row.receipientName] = {
          messages: [newMessage]
        }
      }
    }
    else {
      if (PMchats[row.senderName] && PMchats[row.senderName].messages) {
        PMchats[row.senderName].messages.push(newMessage)
      }
      else {
        PMchats[row.senderName] = {
          messages: [newMessage]
        }
      }
    }
    
  })
}

const getPMsentBy = (userid) => {
  return knex('private_messages AS pm')
  .select('u.name AS receipientName', 'pm.messageid', 'pm.senderid', 'pm.receipientid', 'pm.date', 'pm.message')
  .innerJoin('users AS u', (join) => {
    join.on('u.userid', 'pm.receipientid')
  })
  .where({senderid: userid})
}

const getPMreceivedBy = (userid) => {
  return knex('private_messages AS pm')
  .select('u.name AS senderName', 'pm.messageid', 'pm.senderid', 'pm.receipientid', 'pm.date', 'pm.message')
  .innerJoin('users AS u', (join) => {
    join.on('u.userid', 'pm.senderid')
  })
  .where({receipientid: userid})
}





// _____________________________________________________________
// STORE ROOM MESSAGE:

const addMessage = (message) => {
  const { roomname, date, username, messagetext } = message;
  let userID = '';
  return findUserId(username)
  .then(userid => {
    if (!userid) throw new Error(`No userid found for user: ${username}`); // only when error in db (user inserted without id)
    else  {
      userID = userid;
      return findRoomId(roomname)
    }
  })
  .then(roomid => {
    if (!roomid) throw new Error(`No roomid found for room ${roomname}`);
    else {
      return knex('messages')
      .insert({
        messageid: v4(),
        roomid,
        userid: userID,
        date,
        messagetext
      })
      .returning('messageid')
    }
  })
  .then(rows => {
    if (!rows.length) throw new Error(`Could not insert new message into db, messageid: ${messageid}`);
    else {
      console.log(`Successfully inserted new message into db, messageid: ${rows[0]}`);
    }
  })
  .catch(error => {
    console.log(error)
  })
}

// TEST:
// const date = Date.parse(new Date()) / 1000;
// addMessage({
//   messageid: v4(),
//   roomname: 'jumping',
//   date: date,
//   username: 'user5',
//   messagetext: 'Hello everyone!!'
// })



// _____________________________________________________________
// GET ROOM NAMES:

const getRoomNames = (roomids) => {
  return knex('rooms')
  .select('name')
  .whereIn('roomid', roomids)
  .catch(err => {
    console.log('Could not get roomnames for the given ids: ', roomids, 'error: ', err);
  })
}

// TEST:
// getRoomNames(['493dc9d5-1056-40e8-9030-3c7098d948f1','fa59aa55-f2e4-414b-8090-83d72f5adcf9'])
// .then(roomnames => {
//   console.log('Roomnames: ', roomnames);
// })




// _____________________________________________________________
// GET MESSAGES IN ROOMS:

const getMessagesInRooms = (roomids) => {
  return knex
  .select('m.messageid', 'u.name AS username', 'm.date', 'm.messagetext', 'r.name AS roomname')
  .from('messages AS m')
  .innerJoin('users AS u', 'u.userid', 'm.userid')
  .innerJoin('rooms AS r', 'r.roomid', 'm.roomid')
  .whereIn('m.roomid', roomids)
  .orderBy('roomname')
  .catch(error => {
    console.log('Could not get messages in rooms from db, error: ', error);
  })
}
// NOTE: if you joining tables which have columns of same name (column name here), need to use aliases, else one will be overriden by the other!!!!!

// TEST:
// getMessagesInRooms(['493dc9d5-1056-40e8-9030-3c7098d948f1','fa59aa55-f2e4-414b-8090-83d72f5adcf9'])
// .then(res => {
//   console.log(res);
// })


// _____________________________________________________________
// GET USERS AND MESSAGES PER ROOM
const getRoomCreators = (roomids) => {
  return knex('rooms AS r')
  .select('r.name AS roomName', 'u.name AS creatorName')
  .innerJoin('users AS u', 'created_by', 'userid')
  .whereIn('roomid', roomids)
  .catch(error => {
    console.log('Could not get room creators, error: ', error);
  })
}

const mergeRoomsUsersAndMessages = ( roomCreators, messagesInRooms , roomsAndUsers ) => {
  // console.log('[mergeRoomsUsersAndMessages] messagesInRooms: ', messagesInRooms);
  // console.log('[mergeRoomsUsersAndMessages] roomsAndUsers: ', roomsAndUsers);

  const roomNames = Object.keys(roomsAndUsers);
  for (const roomName of roomNames) {
    roomsAndUsers[roomName].messages = messagesInRooms.filter(message => {
      return message.roomname === roomName;
    });
    roomsAndUsers[roomName].creator = roomCreators.find(room => {
      if (room.roomName === roomName) return room.creatorName;
    })
    // console.log('roomsAndUsers[roomName].messages: ');
    // console.dir(roomsAndUsers[roomName].messages);
  }
  // console.log('[mergeRoomsUsersAndMessages - after messages added] roomsAndUsers: ');
  // console.dir(roomsAndUsers);
  return roomsAndUsers;
}

const getUsersAndMessagesPerRoom = async (username, roomids) => {
  let messagesInRooms = [];
  let roomCreators = [];
  return getRoomCreators(roomids)
  .then(rmCreators =>   {
    roomCreators = rmCreators;
  })
  .then(_ => {
    return getMessagesInRooms(roomids)
  })
  .then(messages => {
    // console.log('[getUsersAndMessagesPerRoom] return result from [getMessagesPerRoom], messages: ');
    // console.dir(messages);
    messagesInRooms = messages;
    return getUsersInRooms(roomids);
  })
  .then(roomsAndTheirUsers => {
    // console.log('[getUsersAndMessagesPerRoom] return result from [getUsersInRooms], roomsAndUsers: ');
    // console.dir(roomsAndUsers);

    return mergeRoomsUsersAndMessages(roomCreators, messagesInRooms, roomsAndTheirUsers);
  })
  .then(roomsArrayMap => {
    // const roomsMap = roomsArrayToRoomsMap(roomsArrayMap);
    // console.log('getUsersAndMessagesPerRoom, roomsArrayMap ', roomsArrayMap);
    return roomsArrayMap;
  })
}

const createNewRoom = (newRoom) => {
  let userId = '';
  let roomId = '';
  return findUserId(newRoom.creatorName)
  .then(userid => {
    userId = userid;
    roomId = v4();
    return knex('rooms')
    .insert({
      roomid: roomId,
      name: newRoom.roomName,
      created_by: userid,
      authorise: newRoom.authorise
    })
    .returning('*')
    .then(res => {
      console.log('Created new room, res: ', res);
      return res;
    })
    .then(res => {
      const longDate = Date.parse(new Date())
      return knex('join_room_events')
      .insert({
        userid: userId,
        roomid: roomId,
        joineddate: longDate / 1000
      })
      .returning('*')
    })
    .then(res => {
      console.log('Inserted new join_room_event: res', res);
    })
    .catch(error => {
      console.log('Could not create a new room, error: ', error);
    })
  })
  
}

module.exports = {
  verifyUser,
  checkIfConnected,
  signupNewUser,
  addMessage,
  getAllExistingRooms,
  getAdministrators,
  getAllAvailableUsers,
  getJoinedRooms,
  getJoinRoomsRequests,
  getRoomsRequested,
  getRoomsNJoinedNrequested,
  getRoomNames,
  getUsersAndMessagesPerRoom,
  storeJoinRequests,
  storePrivateMessage,
  getPrivateMessages,
  approveJoinRequest,
  getPreviousJoinRequests,
  getRequestsApproved,
  disconnectUser,
  createNewRoom
}
