const _ = require('lodash');

const rooms = ['music', 'sport', 'gardening', 'dance', 'yoga', 'singing', 'sky diving'];
const users = []
_.times(15, n => users.push('user'+n));

const message_store_arr = [];

const message_store_map = {}

const populate_ms_store = () => {
  rooms.forEach((room) => { 
    let obj = {
      room,
      users: users_toArr(populate_users_for_room()), 
    }
    obj.messages = dummyMessages(obj.users);
    message_store_arr.push(obj);
  });

}

const populate_users_for_room = () => {
  const users = {};
  const num_users = Math.floor(Math.random()*16); // random number of users in a given room
  _.times(num_users, i => users['user'+ Math.floor(Math.random()*16)]=''); // random user number
  return users;
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

const messagesArr_to_messagesMap = () => {
  message_store_arr.forEach(item => {
    message_store_map[item.room] = {users: item.users, messages: item.messages}
  });
}

const users_toArr = (users) => {
  const arr = [];
  let keys = Object.keys(users);
  keys.forEach(key => arr.push(key));
  return arr;
}


const getRoomsForUser = (user) => {
  
}

populate_ms_store();

module.exports = {
  message_store_arr
}