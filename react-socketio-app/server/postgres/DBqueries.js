const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'chat_app_2',
  password: 'postgres',
  port: 5432,
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});

const checkIfConnected = (userName) => {
  const query = `SELECT userid, connected FROM users WHERE name = '${userName}';`;
  let connected = false;
  let userid = '';
  return client.query(query)
    
}

const getJoinedRooms = (userid) => {
  console.log('not connected, in getJoinedRooms!');
  console.log('userid: ', userid);
  return client.query(`SELECT j.roomid, j.joineddate, r.name FROM join_room_events j INNER JOIN rooms r ON j.roomid = r.roomid WHERE j.userid = '${userid}' ;`);
}

const addMessage = (messageText, userid, roomName) => {
  let roomid = '';
  const roomIdquery = `SELECT roomid FROM rooms WHERE name = '${roomName}';`
  client.query(roomIdquery).then(res => {
    console.log('roomid found: ', res.rows[0].roomid);
    roomid = res.rows[0].roomid;
  });
  const date = Date.now();
  const addMessageQuery = `INSERT INTO messages(messageid, roomid, userid, date, messagetext) VALUES (uuid_generate_v4(), '${roomid}', '${userid}', '${date}', '${messageText}');`;
  client.query(addMessageQuery).then(res => {
    console.log('addMessageQuery, res:', res);
  })
}

const getRoomNames = (rooms) => {
  const roomsTxt = quoteStringArray(rooms);
  console.log('roomsTxt: ', roomsTxt);
  const query = `SELECT name FROM rooms WHERE roomid IN (${roomsTxt});`
  return client.query(query).then(res => {
    return res.rows;
  });
}

const getMessagesPerRoom = (userid, roomidsTxt) => {
  const query = `SELECT m.messageid, m.date, m.messagetext, r.name AS roomname, u.name AS username FROM messages m INNER JOIN rooms r ON m.roomid = r.roomid INNER JOIN users u ON m.userid = u.userid WHERE m.userid = '${userid}' AND m.roomid IN (${roomidsTxt}) ;`;
  return client.query(query).then(res => {
    console.log('getMessages: ', res.rows);
    return res.rows;
  })
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

const getUsersAndMessagesPerRoom = async (userid, roomids) => {
  const roomidsTxt = quoteStringArray(roomids);
  const messages = await getMessagesPerRoom(userid, roomidsTxt);
  // console.log('getUsersAndMessagesPerRoom, messages: ', messages);

  return getUsersInRooms(roomids).then(() => {
    const roomsArrayMap = mergeRoomsUsersAndMessages(roomsUsers, messages);
    console.log('roomsMap ', roomsArrayMap);
    const roomsMap = roomsArrayToRoomsMap(roomsArrayMap);
    console.log('getUsersAndMessagesPerRoom, roomsMap: ', roomsMap);
    return roomsMap;
  })
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
    console.log('key: ', key);
    const roomItem = {};
    const roomMessages = addMessagesToRoom(key, messages);
    roomItem[key] = {
      users: item[key],
      messages: roomMessages ? roomMessages : []
    };
    console.log('roomItem: ', roomItem);
    return roomItem;
  });

  return roomsMap;
}


module.exports = {
  checkIfConnected,
  addMessage,
  getJoinedRooms,
  getRoomNames,
  getUsersAndMessagesPerRoom
}