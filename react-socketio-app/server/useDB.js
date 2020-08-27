const seedDB = require('./seedDB');
const fs = require('fs');
const FILE_NAME = './db_1.json';

let TEMP_STORE = seedDB.useDBfromFile(FILE_NAME); 

// USE THE STORE METHODS

const getRoomsForUser = (user) => {
  const ROOMS = [];
  TEMP_STORE.forEach(roomRecord => {
    const found = roomRecord.users.find(roomUser => roomUser === user);
    if (found) {
      ROOMS
     .push(roomRecord);
    }
 });
// console.log('useDB, getRoomsForUser returns: ', ROOMS);
return ROOMS;
}

const addMessageToRoom = (user, roomName, message) => {
  const room = TEMP_STORE.find(room => room.roomName === roomName);
  // console.log(`${roomName} messages before message was added: `);
  // console.dir(room.messages)
  room.messages.push({user, message});
  // console.log(`${roomName} messages after message was added: `);
  // console.dir(room.messages)
}

module.exports = {
  getRoomsForUser,
  addMessageToRoom,
}
