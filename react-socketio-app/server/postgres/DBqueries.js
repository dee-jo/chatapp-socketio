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
  const roomid = '';
  const roomIdquery = `SELECT roomid FROM rooms WHERE name = '${roomName}';`
  client.query(roomIdquery).then(res => {
    console.log('roomid found: ', res.rows[0].roomid);
    roomid = res.rows[0].roomid;
  });
  const date = Date.now();
  const addMessageQuery = `INSERT INTO messages(messageid, roomid, userid, date, messagetext) VALUES (uuid_generate_v4(), '${roomid}', '${userid}', '${date}', '${messageText}');`
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

const getUsersInRooms = (roomids) => {
  let query = ''
  let roomsMap = {}
  roomids.forEach(roomid => {
    roomsMap = getUserInRoom(roomid);
  })
  
  return roomsMap;
}

const getUserInRoom = (roomid) => {
  const  roomsMap = {};
  query = `SELECT u.name AS username, r.name AS roomname FROM users u INNER JOIN messages m ON m.userid = u.userid INNER JOIN rooms r ON m.roomid = r.roomid WHERE m.roomid = '${roomid}';`;

  return client.query(query)
  .then(res => {
    res.rows.forEach(row => {
      // console.log('row: ', row);
      const roomName = row.roomname;
      if (!roomsMap[roomName]) {
        roomsMap[roomName] = []
      } else {
        const found = roomsMap[roomName].find(name => row.username === name)
        if (!found) roomsMap[roomName].push(row.username);
      }
    })
    return roomsMap;
    // console.log('roomsMap: ', roomsMap);
  })
  .catch(err => {
    console.log('error in getUsersPerRoom: ', err);
  })
}

const getUsersAndMessagesPerRoom = async (userid, roomids) => {
  const roomidsTxt = quoteStringArray(roomids);
  const messages = await getMessagesPerRoom(userid, roomidsTxt);
  console.log('getUsersAndMessagesPerRoom, messages: ', messages);

  const roomsMap = await getUsersInRooms(roomids);
  console.log('getUsersAndMessagesPerRoom, roomsMap: ', roomsMap);
  
  return {messges: messages, roomsMap: roomsMap};
}

const quoteStringArray = (arr) => {
  const arrMap = arr.map(item => {
    return "'" + item + "'";
  })
  const arrTxt = arrMap.join(',');
  return arrTxt;
}


module.exports = {
  checkIfConnected,
  addMessage,
  getJoinedRooms,
  getRoomNames,
  getUsersAndMessagesPerRoom
}