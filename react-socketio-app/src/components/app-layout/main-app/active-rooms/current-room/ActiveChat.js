import React from 'react';
import * as classes from './ActiveChat.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';



const ActiveChat = ({activeRoom, messages, onSendMessage}) => {

  console.log(activeRoom);

    return (
      <div className='chat-room_container'>
        <MessageList activeRoom={activeRoom} messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    )
}


export default ActiveChat;

