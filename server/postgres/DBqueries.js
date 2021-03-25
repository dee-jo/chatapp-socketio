const { Client } = require('pg');
const sqlString = require('sqlstring');
const bcrypt = require('bcrypt');
const {v4} = require('uuid');
const { reject } = require('lodash');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'chat_app_new1',
  password: 'postgres',
  port: 5432,
})


client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('db connected');
  }
});

const checkIfConnected = (userName) => {
  const query = `SELECT userid, connected FROM users WHERE name = '${userName}';`;
  return client.query(query)
  .then(res => {
    if (res.rows.length) {
      return res.rows[0].connected;
    }
  })
  .catch(err => {
    console.log('Error checking if user connected, error: ', err);
    return false;
  })
}

const signupNewUser = ({username, password}) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT userid FROM users WHERE name='${username}';`;
    client.query(query)
    .then(res => {
      if (res.rows.length) return reject(new Error('User already exists!, db res: ', res))
      else return res;
    })
    .then(res => {
      console.log('User doesn\'t exist, inserting into db');
      const userid = v4();
      const query = `INSERT INTO users (userid, name, connected) VALUES ('${userid}', '${username}', false) RETURNING userid;`;
      return client.query(query)
    })
    .then(res => res.rows[0].userid)
    .then(userid => {
      console.log('userid returned from db after inserting user: userid', userid);
      const saltRounds = 10;
      return new Promise((resolveHash, rejectHash) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) rejectHash(new Error(`[DBqueries@44]: couldn't hash user's password, error: ${err}`))
          resolveHash({userid, hash});
        });
      })
    })
    .then(({userid, hash}, error) => {
      if (error) reject(new Error(error));
      else {
        const query = `INSERT INTO auth (userid, userhash) VALUES ('${userid}', '${hash}') RETURNING userid;`;
        client.query(query).then(res => {
          if (res.rows[0].userid) {
            return resolve(res.rows[0].userid);
          }
        })
      }   
    })
  })
};

const verifyUser = (user) => {
    
  const useridQuery = `SELECT userid FROM users WHERE name = '${user.name}'`;

  return client.query(useridQuery)
  .then(res => {
    if (res.rows.length) return res.rows[0].userid;
    else throw new Error('User doesn\'t exist!');
  })
  .then(userid => { 
    const query = `SELECT userhash FROM auth WHERE userid = '${userid}'`;
    return client.query(query)
  }) 
  .then(res => {
    if (res.rows[0].userhash) {
      const dbHash = res.rows[0].userhash;
      console.log('dbHash: ', dbHash);
      return compare(user.password, dbHash);
    }
    else throw new Error('Could not find userhash in db!');
  })
  .then(result => {
    console.log('hash compare result: ', result);
    if (!result) throw new Error('Pasword verification failed!');
    else return result;
  })
}

const compare =(enteredPassword, dbHash) => {
  return bcrypt.compare(enteredPassword, dbHash).then(result => {
    return result;
    // console.log('password check result: ', result);
  });
}


const findUserId = (username) => {
  const query = `SELECT userid FROM users WHERE name = '${username}';`;
  return client.query(query)
  .then(res => {
    if (res.rows.length) {
      return res.rows[0].userid;
    }
  })
  .catch(err => {
    console.log('Error finding the user, err: ', err);
  })
}

const findRoomId = (roomname) => {
  const roomIdquery = `SELECT roomid FROM rooms WHERE name = '${roomname}';`
  return client.query(roomIdquery)
  .then(res => {
    // console.log('roomid found: ', res.rows[0].roomid);
    const roomid = res.rows[0].roomid;
    return roomid;
  })
}

const getJoinedRooms = (username) => {
  return findUserId(username)
  .then(userid => {
    console.log('userid in getJoinedRooms: ', userid)
    return client.query(`SELECT j.roomid, j.joineddate, r.name 
                         FROM join_room_events j 
                         INNER JOIN rooms r ON j.roomid = r.roomid 
                         WHERE j.userid = '${userid}' ;`);
  })
  .then(res => {
    console.log('res.rows in getJoinedRooms: ', res)
    return res.rows;
  })
  .catch(err => {
    console.log('Error getting rooms joined by the user, error: ', err);
  })
  // console.log('userid in getJoinedRooms: ', userid);
}

const addMessage = (message) => {
  const roomname = message.roomname;
  const username = message.username;
  let userid = '';
  findUserId(username)
  .then(id => {
    userid = id;
    return;
  })
  .then(() => {
    return findRoomId(roomname)
  })
  .then(roomid => {
    const addMessageQuery = `INSERT INTO messages (messageid, roomid, userid, date, messagetext) VALUES ('${message.messageid}', '${roomid}', '${userid}', '${message.date}', $$${message.messagetext}$$);`;
    client.query(addMessageQuery)
    .then(res => {
      // console.log('addMessageQuery, res:', res);
    })
  }); 
}

const getRoomNames = (rooms) => {
  const roomsTxt = quoteStringArray(rooms);
  // console.log('roomsTxt: ', roomsTxt);
  const query = `SELECT name FROM rooms WHERE roomid IN (${roomsTxt});`
  return client.query(query).then(res => {
    return res.rows;
  });
}

const getMessagesInRooms = (roomids) => {
  const roomidsTxt = quoteStringArray(roomids);
  const query = `SELECT m.messageid, m.date, m.messagetext, r.name AS roomname, u.name AS username FROM messages m INNER JOIN rooms r ON m.roomid = r.roomid INNER JOIN users u ON m.userid = u.userid WHERE m.roomid IN (${roomidsTxt}) ;`;
  return client.query(query).then(res => {
    console.log('[getMessagesPerRoom]: res.rows ', res.rows);
    return res.rows;
  }).catch(err => console.log('db error [getMessagesPerRoom()@DBqueries.js] ', err));
}

const getMessagesPerUser = (userid, roomids) => {
  const roomidsTxt = quoteStringArray(roomids);
  const query = `SELECT m.messageid, m.date, m.messagetext, r.name AS roomname, u.name AS username FROM messages m INNER JOIN rooms r ON m.roomid = r.roomid INNER JOIN users u ON m.userid = u.userid WHERE m.userid = '${userid}' AND m.roomid IN (${roomidsTxt}) ;`;
  return client.query(query).then(res => {
    // console.log('getMessages: ', res.rows);
    return res.rows;
  }).catch(err => console.log('db error [getMessagesPerRoom()@DBqueries.js] ', err));
}



const getUsersInRoom = (roomid) => {
  query = `SELECT u.name AS username, r.name AS roomname FROM users u INNER JOIN messages m ON m.userid = u.userid INNER JOIN rooms r ON m.roomid = r.roomid WHERE m.roomid = '${roomid}';`;

  return client.query(query)
  .then(res => {
    const roomUsers = {};
    let roomName = '';
    res.rows.forEach(row => {
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
    // console.log('error in getUsersPerRoom: ', err);
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
  console.log('roomsAndUsers: ', roomsAndUsers);
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
    console.log('getUsersAndMessagesPerRoom, roomsArrayMap ', roomsArrayMap);
    return roomsArrayMap;
  })
  

  // console.log('getUsersAndMessagesPerRoom, messages: ', messages);
}

// ---------------------- HELPER METHODS ------------------------

{/*const roomsArrayToRoomsMap = (roomsArrayMap) => {
  let roomsMap = {};
  roomsArrayMap.forEach(item => {
    const key = Object.keys(item)[0];
    roomsMap[key] = { ...item[key]}
  });
  return roomsMap;
}

const addMessagesToRoom = (roomname, messages) => {
  // console.log('[addMessages] messages: ', messages);
  const messagesArr = [messages.filter(m => m.roomname === roomname)];
  return messagesArr;
}*/}

const quoteStringArray = (arr) => {
  const arrMap = arr.map(item => {
    return "'" + item + "'";
  })
  const arrTxt = arrMap.join(',');
  return arrTxt;
}

const mergeRoomsUsersAndMessages = ( messagesArray , roomsAndUsers ) => {
  console.log('[mergeRoomsUsersAndMessages] messagesArray: ', messagesArray);
  console.log('[mergeRoomsUsersAndMessages] roomsAndUsers: ', roomsAndUsers);

  const roomNames = Object.keys(roomsAndUsers);
  for (const roomName of roomNames) {
    roomsAndUsers[roomName].messages = messagesArray.filter(message => {
      return message.roomname === roomName;
    });
    console.log('roomsAndUsers[roomName].messages: ');
    console.dir(roomsAndUsers[roomName].messages);
  }
  console.log('[mergeRoomsUsersAndMessages - after messages added] roomsAndUsers: ');
  console.dir(roomsAndUsers);
  return roomsAndUsers;
}


module.exports = {
  checkIfConnected,
  signupNewUser,
  addMessage,
  getJoinedRooms,
  getRoomNames,
  getUsersAndMessagesPerRoom,
  verifyUser
}