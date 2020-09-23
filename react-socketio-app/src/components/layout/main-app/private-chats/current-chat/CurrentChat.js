import React from 'react';
import * as classes from './CurrentChat.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';



const CurrentRoom = ({activeRoom, messages, onSendPrivateMessage}) => {

  console.log(activeRoom);

    return (
      <div className='chat-room_container'>
        <MessageList activeRoom={activeRoom} messages={messages} />
        <MessageInput onSendPrivateMessage={onSendPrivateMessage} />
      </div>
    )
}


export default CurrentRoom;

