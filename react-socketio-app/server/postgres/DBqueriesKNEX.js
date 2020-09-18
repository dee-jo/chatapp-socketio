const bcrypt = require('bcrypt');
const {v4} = require('uuid');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'localhost',
    port: '5432',
    user : 'postgres',
    password : 'postgres',
    database : 'chat_app_new1'
  }
});



// _____________________________________________________________
// CHECK IF USER CONNECTED:

const checkIfConnected = (userName) => {
  knex('users')
  .where({name: userName})
  .select('userid', 'connected')
  .then(rows => {
    return rows.length ? rows[0].connected : false;
  })
  .catch(err => {
    console.error('knex returned error: ', err);
    return false
  })
}
// TEST:
// checkIfConnected('user5')
// .then(res => {
//   console.log('check if user connected, res: ', res);
// })




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
// GET ROOMS NOT JOINED

const getRoomsNotJoined = (joinedRoomNames) => {
  return knex.select('r.name')
  .from('rooms AS r')
  .innerJoin('join_room_events AS jre', 'jre.roomid', 'r.roomid')
  .whereNotIn('r.name', joinedRoomNames)
  .groupBy('r.name')
  .then(rows => {
    return rows.map(row => row.name);
  })
  .then(roomNames => {
    return roomNames
  })
  .catch(error => {
    console.log('[DBqueriesKNEX@getRoomsNotJoined] error: ', error);
  })
}

// TEST
// getRoomsNotJoined(['dance', 'work', 'news']);



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
// NOTIFY ADMINS OF JOIN ROOM REQUESTS
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

const confirmJoinRequest = (req) => {
  console.log('[DBqueriesKNEX@confirmJoinRequest] request from client: ', req)
  const reqId = req.id;
  return knex('room_requests')
  .update({confirmed: true})
  .where('id', reqId)
  .returning('requesting_user')
  .then(res => {
    console.log('[DBqueriesKNEX@confirmJoinRequest] update response: ', res[0]);
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
    console.log('[DBqueriesKNEX@confirmJoinRequest] error: ', error);
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
// ADD MESSAGE:

const addMessage = (message) => {
  const { messageid, roomname, date, username, messagetext } = message;
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
        messageid,
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
      console.log(`Successfully inserted new message into db, messageid: ${messageid}`);
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

const mergeRoomsUsersAndMessages = ( messagesArray , roomsAndUsers ) => {
  // console.log('[mergeRoomsUsersAndMessages] messagesArray: ', messagesArray);
  // console.log('[mergeRoomsUsersAndMessages] roomsAndUsers: ', roomsAndUsers);

  const roomNames = Object.keys(roomsAndUsers);
  for (const roomName of roomNames) {
    roomsAndUsers[roomName].messages = messagesArray.filter(message => {
      return message.roomname === roomName;
    });
    // console.log('roomsAndUsers[roomName].messages: ');
    // console.dir(roomsAndUsers[roomName].messages);
  }
  // console.log('[mergeRoomsUsersAndMessages - after messages added] roomsAndUsers: ');
  // console.dir(roomsAndUsers);
  return roomsAndUsers;
}

const getUsersAndMessagesPerRoom = async (username, roomids) => {
  let messagesArray = [];
  return getMessagesInRooms(roomids)
  .then(messages => {
    // console.log('[getUsersAndMessagesPerRoom] return result from [getMessagesPerRoom], messages: ');
    // console.dir(messages);
    messagesArray = messages;
    return getUsersInRooms(roomids);
  })
  .then(roomsAndUsers => {
    // console.log('[getUsersAndMessagesPerRoom] return result from [getUsersInRooms], roomsAndUsers: ');
    // console.dir(roomsAndUsers);

    return mergeRoomsUsersAndMessages(messagesArray, roomsAndUsers);
  })
  .then(roomsArrayMap => {
    // const roomsMap = roomsArrayToRoomsMap(roomsArrayMap);
    // console.log('getUsersAndMessagesPerRoom, roomsArrayMap ', roomsArrayMap);
    return roomsArrayMap;
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
  getRoomNames,
  getRoomsNotJoined,
  getUsersAndMessagesPerRoom,
  storeJoinRequests,
  confirmJoinRequest
}
