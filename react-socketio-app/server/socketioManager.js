const _ = require('lodash');


const getMessagesByRooms = (rooms) => {
  return rooms.map(room => {
    return {
      room,
      messages: dummyMessages()
    }
  })
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