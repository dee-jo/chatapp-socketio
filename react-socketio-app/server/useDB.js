const dbManager = require('./seed_DB');

const TEMP_STORE = dbManager.createTempDB();


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

module.exports = {
  getRoomsForUser
}
