import React from 'react';
import * as classes from './CurrentChat.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';



const CurrentChat = ({activeRoom, messages, onSendPrivateMessage}) => {

  console.log(activeRoom);
  console.log('[CurrentChat] messages: ', messages)

    return (
      <div className='chat-room_container'>
        <MessageList activeRoom={activeRoom} messages={messages} />
        <MessageInput onSendPrivateMessage={onSendPrivateMessage} />
      </div>
    )
}


export default CurrentChat;

