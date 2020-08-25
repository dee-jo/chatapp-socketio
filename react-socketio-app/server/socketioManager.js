const _ = require('lodash');

const message_store = [{
  room: '',
  users: [],
  messages: []
}];

const getMessagesByRooms = (rooms) => {
  rooms.forEach((room) => { 
    message_store.push(
    {
      room,
      users: [ 'user1', 'user2', 'user3'],
      messages: dummyMessages()
    }
  )})

}

const dummyMessages = () => {
  let messages = [];
  messages = _.times(10, (i) => {
    messages.push(
      {
        user: 'name'+ i,
        message: 'some message'
      }
    )
  });
  return messages;
};

module.exports = {
  getMessagesByRooms
}