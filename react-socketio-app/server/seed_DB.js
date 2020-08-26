const _ = require('lodash');
const fs = require('fs');

const USER_AMOUNT = 15;
const ROOM_NAMES = ['music', 'sport', 'gardening', 'dance', 'yoga', 'singing', 'sky diving'];
const USERS = []
_.times(USER_AMOUNT, n => USERS.push('user'+n));



// CREATE AND POPULATE DUMMY MESSAGE_STORE_ARR WITH NEW ENTRIES

let MESSAGE_STORE_ARR = [];

const populate_ms_store = () => {
  ROOM_NAMES
 .forEach((name) => { 
    let obj = {
      roomName: name,
      users: users_toArr(populate_users_for_room()), 
    }
    obj.messages = dummyMessages(obj.users);
    MESSAGE_STORE_ARR.push(obj);
  });
}

const populate_users_for_room = () => {
  const users = {};
  const num_users = Math.floor(Math.random()*16); // random number of users in a given room
  _.times(num_users, i => users['user'+ Math.floor(Math.random()*16)]=''); // random user number
  return users;
}

const users_toArr = (users) => {
  const arr = [];
  let keys = Object.keys(users);
  keys.forEach(key => arr.push(key));
  return arr;
}

const dummyMessages = (users) => {
  let messages = [];
  const messages_amount = Math.floor(Math.random() * 20);
  _.times(messages_amount, (i) => {
    // add random user to message
    const userIndex = Math.floor(Math.random()*users.length);
    const currentUser = users[userIndex]
    messages.push(
      {
        user: currentUser, 
        message: 'some message'
      }
    )
  });
  return messages;
};

// STORE TO MAP
const MESSAGE_STORE_MAP = {}
const messagesArr_to_messagesMap = () => {
  MESSAGE_STORE_ARR.forEach(item => {
    MESSAGE_STORE_MAP[item.room] = {users: item.users, messages: item.messages}
  });
}

 // HANDLE THE STORE

 const makeNewDBandSaveToFile = (fname) => {
   populate_ms_store();
   saveToFile(fname);
 }

 const useDBfromFile = (fname) => {
   MESSAGE_STORE_ARR = require(fname)
   return MESSAGE_STORE_ARR;
 }

 const saveToFile = (fname) => {
    const json = JSON.stringify(MESSAGE_STORE_ARR);
    fs.writeFile(fname, json, (err) => {
      if (err) {
          console.log(err);
      }
  });
 }

const createTempDB = () => {
  populate_ms_store();
  return MESSAGE_STORE_ARR;
}


module.exports = {
  makeNewDBandSaveToFile,
  useDBfromFile,
  createTempDB
}