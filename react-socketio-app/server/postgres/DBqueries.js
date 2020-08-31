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
  const connected = false;
  const userid = '';
  client.query(query).then(res => {
    console.log(res);
    connected = res.rows[0].connected;
    userid = res.rows[0].userid;
    console.log('userid: ', userid, 'connected: ', connected);
  })
  return {connected: connected, userid: userid};
}

const getJoinedRooms = (userid) => {
  console.log('not connected, in getJoinedRooms!')
  return client.query(`SELECT roomid, joineddate FROM join_room_events WHERE userid = '${userid}'`)
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


module.exports = {
  checkIfConnected,
  addMessage,
  getJoinedRooms
}