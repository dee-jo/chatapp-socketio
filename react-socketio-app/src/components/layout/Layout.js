import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../chat-layout/ChatLayout';
import Login from '../login/Login';
import useSocket from '../_useSocket';

const Layout = (props) => {
  
 const { 
  authenticateUser,
  userAuthenticated,
  roomNames,
  rooms,
  getMessagesForRoom,
  sendMessage
} = useSocket();


  // MAPPED FROM USESOCKET: 
  const onAuthenticate = (username, password) => {
    authenticateUser(username, password);
  }
  const onSendMessage = (activeRoom) => {
    return sendMessage(activeRoom);
  }
  const onMessageReceived = (roomName) => {
    return getMessagesForRoom(roomName);
  }
  const getRooms = () => {
    return rooms;
  }
  const getRoomNames = () => {
    return roomNames;
  }

  const socketMethods = {
    onSendMessage,
    onMessageReceived,
    getRooms,
    getRoomNames
  }

    
  const renderChatLayout = () => {
    return (<ChatLayout  {...socketMethods} />);
  }

  return (
    <div>
      {!userAuthenticated ? <Login authenticateUser={onAuthenticate} /> : null}
      {userAuthenticated && renderChatLayout()}
    </div>
    
  )
}

export default Layout;
