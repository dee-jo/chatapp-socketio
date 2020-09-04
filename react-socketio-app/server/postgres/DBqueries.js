const { Client } = require('pg');
const sqlString = require('sqlstring');
const bcrypt = require('bcrypt');

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
  let connected = false;
  let userid = '';
  return client.query(query)
    
}

const verifyUser = (user, callback) => {
    
  const useridQuery = `SELECT userid FROM users WHERE name = '${user.name}'`;

  const verified = client.query(useridQuery)
  .then(res => {
    const userid = res.rows[0].userid;
    return userid;
  })
  .then(userid => { // 
    const query = `SELECT userhash FROM auth WHERE userid = '${userid}'`;
    return client.query(query)
  }) 
  .then(res => {
    const dbHash = res.rows[0].userhash;
    console.log('dbHash: ', dbHash);
    return compare(user.password, dbHash);
  })
  .then(result => {
    console.log('chained result: ', result);
    return callback(result);
  })
}

const compare =(enteredPassword, dbHash) => {
  return bcrypt.compare(enteredPassword, dbHash).then(result => {
    return result;
    // console.log('password check result: ', result);
  });
}


// $2b$10$TmNFgorFZNOU08J2ThCP9uGHjmai7d483sssUNMzuYttwASpJzW7u
// $2b$10$fySXec.9UCwOFkmyt7hti.le4wivG99ShHKBKuRpi30ybsXcUZ6CK

const findUserId = (username) => {
  const query = `SELECT userid FROM users WHERE name = '${username}';`;
  return client.query(query).then(res => {
    console.log('res in findUserId: ', res)
    const userid = res.rows[0].userid;
    return userid;
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
  // console.log('userid in getJoinedRooms: ', userid);
}

const addMessage = (message, userid, roomname) => {
  
  const roomIdquery = `SELECT roomid FROM rooms WHERE name = '${roomname}';`
  client.query(roomIdquery)
  .then(res => {
    // console.log('roomid found: ', res.rows[0].roomid);
    const roomid = res.rows[0].roomid;
    return roomid;
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

const getMessagesPerRoom = (userid, roomidsTxt) => {
  const query = `SELECT m.messageid, m.date, m.messagetext, r.name AS roomname, u.name AS username FROM messages m INNER JOIN rooms r ON m.roomid = r.roomid INNER JOIN users u ON m.userid = u.userid WHERE m.userid = '${userid}' AND m.roomid IN (${roomidsTxt}) ;`;
  return client.query(query).then(res => {
    // console.log('getMessages: ', res.rows);
    return res.rows;
  }).catch(err => console.log('db error [getMessagesPerRoom()@DBqueries.js] ', err));
}



const roomsUsers = [];
const getUserInRoom = async (roomid) => {
 
  query = `SELECT u.name AS username, r.name AS roomname FROM users u INNER JOIN messages m ON m.userid = u.userid INNER JOIN rooms r ON m.roomid = r.roomid WHERE m.roomid = '${roomid}';`;

  return client.query(query)
  .then(res => {
    const  roomUsers = {};
    res.rows.forEach(row => {
      // console.log('row: ', row);
      const roomName = row.roomname;
      if (!roomUsers[roomName]) {
        roomUsers[roomName] = []
      } else {
        const found = roomUsers[roomName].find(name => row.username === name)
        if (!found) roomUsers[roomName].push(row.username);
      }
    })
    return roomsUsers.push(roomUsers);
  })
  .catch(err => {
    // console.log('error in getUsersPerRoom: ', err);
  })
}

const getUsersInRooms = (roomids) => {
  let roomUsers = {}
  roomids.forEach(roomid => {
    roomUsers = getUserInRoom(roomid);
  })
  return roomUsers;
}

const getUsersAndMessagesPerRoom = async (username, roomids) => {
  findUserId(username)
  .then(res => {
    const userid = res.rows[0].userid;
    const roomidsTxt = quoteStringArray(roomids);
    return getMessagesPerRoom(userid, roomidsTxt);
  })
  .then(messages => {
    return getUsersInRooms(roomids)
    .then(roomUsers => {
      return mergeRoomsUsersAndMessages(roomUsers, messages);
    })
    .then(roomsArrayMap => {
      const roomsMap = roomsArrayToRoomsMap(roomsArrayMap);
      console.log('etUsersAndMessagesPerRoom, roomsArrayMap ', roomsArrayMap);
      console.log('getUsersAndMessagesPerRoom, roomsMap: ', roomsMap);
      return roomsMap;
    })
  });

    // console.log('getUsersAndMessagesPerRoom, messages: ', messages);
}

// ---------------------- HELPER METHODS ------------------------

const roomsArrayToRoomsMap = (roomsArrayMap) => {
  let roomsMap = {};
  roomsArrayMap.forEach(item => {
    const key = Object.keys(item)[0];
    roomsMap[key] = { ...item[key]}
  });
  return roomsMap;
}

const addMessagesToRoom = (roomname, messages) => {
  const messagesArr = [messages.filter(m => m.roomname === roomname)];
  return messagesArr;
}

const quoteStringArray = (arr) => {
  const arrMap = arr.map(item => {
    return "'" + item + "'";
  })
  const arrTxt = arrMap.join(',');
  return arrTxt;
}

const mergeRoomsUsersAndMessages = (roomsArray, messages) => {
 
  const roomsMap = roomsArray.map((item, i) => {
    const keys = Object.keys(item);
    const key = keys[0];
    // console.log('key: ', key);
    const roomItem = {};
    const roomMessages = addMessagesToRoom(key, messages);
    roomItem[key] = {
      users: item[key],
      messages: roomMessages ? roomMessages : []
    };
    // console.log('roomItem: ', roomItem);
    return roomItem;
  });

  return roomsMap;
}


module.exports = {
  checkIfConnected,
  addMessage,
  getJoinedRooms,
  getRoomNames,
  getUsersAndMessagesPerRoom,
  verifyUser
}