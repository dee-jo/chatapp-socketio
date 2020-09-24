import React from 'react';
import * as classes from './CurrentRoom.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';
import CreateRoom from './create-room/CreateRoom';



const CurrentRoom = ({currentRoom, messages, onSendMessage}) => {

  console.log(currentRoom);

    return (
      <div className='chat-room_container'>
        {currentRoom === 'create room' 
          ? <CreateRoom />
          : <><MessageList currentRoom={currentRoom} messages={messages} />
            <MessageInput onSendMessage={onSendMessage} /></>
        }
      </div>
    )
}


export default CurrentRoom;

