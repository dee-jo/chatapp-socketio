// SCROLL ALL THE WAY TO START SECTION

//________________________________________________________________
// DEFINITIONS
//________________________________________________________________

const { Client } = require('pg');
const _ = require('lodash');
const {randomDate} = require('../utils/utils');
const {v4} = require('uuid');


// ________________________________________________________________
// SELECTS

const getUsers = () => {
  let users = [];
  return client.query(`SELECT userid, name FROM users`)
  .then((res) => {
    return res.rows.map(element => { 
      return {
        userid: element.userid,
        name: element.name
      }
    });
    console.log('selected users: ', users);
  });
  // return users;
}

const getRooms = () => {
  let rooms = [];
  return client.query(`SELECT * FROM rooms`)
  .then((res) => {
    return rooms = res.rows.map(element => {
      return {
        roomid: element.roomid,
        name: element.name
      }
    });
    console.log('selected rooms: ', rooms);
  });
  // return rooms;
}



// ________________________________________________________________
// CREATE DB

const createDB = (dbName) => {
  const query = `CREATE DATABASE ${dbName}`;
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}

// createDB('chat_app');


// ________________________________________________________________
// CREATE TABLES
const createUUIDextention = () => {
  client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}


const createTableUsers = () => {
  const query = `CREATE TABLE users (
    userId varchar,
    name TEXT,
    connected BOOLEAN
  );`;
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}

// createTableUsers();

const createTableRooms = () => {
  const query = `CREATE TABLE rooms (
    roomId varchar,
    name TEXT
  );`;
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });   
}

// createTableRooms();

const createTableJoinRoomEvents = () => {
  const query = `CREATE TABLE join_room_events (
    userId varchar,
    roomId varchar,
    joinedDate INT
  );`
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  }); 
}

// createTableJoinRoomEvents();

const createTableMessages = () => {
  const query = `CREATE TABLE messages (
    messageId VARCHAR,
    roomId varchar,
    userId varchar,
    date INT,
    messageText TEXT
  )`;
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });  
}

// createTableMessages();




// ________________________________________________________________
// INSERTS USERS

const insertUser = (amount) => {

  _.times(amount, (i) => {
    const name = 'user' + (i+1);
    const userid = v4();
    const query = `INSERT INTO users (userid, name, connected) VALUES ('${userid}', '${name}', false);`; 
    client.query(query).then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  });
  
}

// insertUser(10);


// INSERTS ROOMS
const insertRoom = (roomsArr) => {
  const roomNames = ['music', 'sport', 'work', 'dance', 'garden', 'news'];
  const rooms = roomsArr ? roomsArr : roomNames;

  _.times(rooms.length, (i) => {
    const name = rooms[i];
    const roomid = v4();
    const query = `INSERT INTO rooms (roomId, name) VALUES ('${roomid}', '${name}');`;
    
    client.query(query).then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  });
}


//  insertRoom(null);



// INSERT JOIN ROOM EVENT

const insertJoinRoomEvent = (userid, roomid, joineddate) => {
  console.log('insertJoinRoomEvent')
  const query = `INSERT INTO join_room_events (userid, roomid, joineddate) VALUES ('${userid}', '${roomid}', '${joineddate}');`; 
  
  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
}

const populateJoinRoomEvents = () => {
  let users = [];
  let rooms = [];
  // select from users
  getUsers().then((usrs) =>  users = usrs)
  .then(() => getRooms().then((rms) => rooms = rms))
  .then(() => {
    console.log('entering times');
    _.times(users.length, () => {
      console.log('in _.times()');
        const room_index = Math.floor(Math.random()*(rooms.length));
        // console.log('room_index', room_index);
        const user_index = Math.floor(Math.random()*(users.length));
        // console.log('user_index', user_index);
        const date = randomDate(new Date(2012, 0, 1), new Date());
        // console.log('date: ', date);

        insertJoinRoomEvent(users[user_index].userid, rooms[room_index].roomid, date);
    })
  })
    .catch(err => {
      console.log(err);
    })
}

// populateJoinRoomEvents();


// INSERT MESSAGES

const insertMessage = (users, rooms) => {
  console.log('in insert message!');
  const user_index = Math.floor(Math.random()*(users.length));
  console.log('user_index', user_index);
  const room_index = Math.floor(Math.random()*(rooms.length));
  console.log('room_index', room_index);
  const messageid = v4();
  const date = randomDate(new Date(2012, 0, 1), new Date());
  const someMessage = 'some message';

  const query = `INSERT INTO messages (messageid, roomid, userid, date, messagetext) VALUES ('${messageid}', '${rooms[room_index].roomid}', '${users[user_index].userid}', '${date}' , '${someMessage}')`;

  // console.log(query);
  // console.log(date);

  client.query(query).then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
  
}

const populateMessages = (users, rooms) => {
  console.log(users)
  console.log(rooms)
  if (users.length > 0 && rooms.length > 0) {
    _.times(20, () => {
      insertMessage(users, rooms);
    });
  }
}

const fetchAndPopulateMessages = () => {
  let users = [];
  let rooms = [];
  getUsers().then(usrs => users = usrs)
  .then(() => getRooms().then(rms => rooms = rms))
  .then(()=> {
    populateMessages(users, rooms)
  });
}

// fetchAndPopulate();



//________________________________________________________________
// START
//________________________________________________________________

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  // database: 'chat_app_new1',
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


// UNCOMMENT TO USE
// _____________________________________________________________________


const dbName = 'chat_app_new1';

createDB(dbName);

{/*createUUIDextention();
createTableUsers();
createTableRooms();
createTableJoinRoomEvents();
createTableMessages();

insertUser(10);
insertRoom(null);
populateJoinRoomEvents();
fetchAndPopulateMessages();*/}





