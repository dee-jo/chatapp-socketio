import React, { useState, useEffect } from 'react';
import * as classes from './CurrentRoom.css'
import MessageInput from './message-input/MessageInput';
import MessageList from './message-list/MessageList';
import CreateRoom from './create-room/CreateRoom';
import RoomsSearch from './rooms-search/RoomsSearch';

const CurrentRoom = ({
  currentRoom, 
  getMessages, 
  onSendMessage, 
  onSendCreatedNewRoom,
  availableRooms,
  onJoinRoomsRequest,
  joinRequestSent,
  setJoinRequestSent
}) => {

  console.log(currentRoom);

  const renderSection = () => {
    switch (currentRoom) {
      case 'create room': return <CreateRoom sendCreatedNewRoom={onSendCreatedNewRoom} />
      case 'join new room': return (
        <RoomsSearch availableRooms={availableRooms} 
                     onJoinRoomsRequest={onJoinRoomsRequest} 
                     joinRequestSent={joinRequestSent}
                     setJoinRequestSent={setJoinRequestSent} />
      )
      default: return <><MessageList currentRoom={currentRoom} messages={getMessages(currentRoom)} />
      <MessageInput onSendMessage={onSendMessage(currentRoom)} /></>
    }
  }
 


    return (
      <div className='chat-room_container'>
        {renderSection()}
        {/* {currentRoom === 'create room' 
          ? <CreateRoom sendCreatedNewRoom={onSendCreatedNewRoom} />
          : <><MessageList currentRoom={currentRoom} messages={getMessages(currentRoom)} />
            <MessageInput onSendMessage={onSendMessage(currentRoom)} /></>
        } */}
      </div>
    )
}

export default CurrentRoom;

