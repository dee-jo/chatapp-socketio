import React, { useState, useEffect } from 'react';
import * as classes from './CurrentRoom.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';
import CreateRoom from './create-room/CreateRoom';

const CurrentRoom = ({currentRoom, getMessages, onSendMessage, onSendCreatedNewRoom}) => {

  console.log(currentRoom);


    return (
      <div className='chat-room_container'>
        {currentRoom === 'create room' 
          ? <CreateRoom sendCreatedNewRoom={onSendCreatedNewRoom} />
          : <><MessageList currentRoom={currentRoom} messages={getMessages(currentRoom)} />
            <MessageInput onSendMessage={onSendMessage(currentRoom)} /></>
        }
      </div>
    )
}

export default CurrentRoom;

