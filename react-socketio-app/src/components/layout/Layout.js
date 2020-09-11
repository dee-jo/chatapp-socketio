import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../chat-layout/ChatLayout';
import RoomsDashboard from '../chat-layout/rooms-dashboard/RoomsDashboard';
import Login from '../login/Login';
import useSocket from '../_useSocket';

const Layout = (props) => {
  
 const { 
  authenticateUser,
  logoutUser,
  userAuthenticated,
  roomNames,
  rooms,
  availableRooms,
  getMessagesForRoom,
  sendMessage
} = useSocket();


  // MAPPED FROM USESOCKET: 
  const onAuthenticate = (username, password) => {
    authenticateUser(username, password);
  }
  const onLogout = () => {
    logoutUser();
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
  const getAvailableRooms = () => {
    return availableRooms
  }

  const socketMethodsToProps = {
    onSendMessage,
    onMessageReceived,
    getAvailableRooms,
    getRooms,
    getRoomNames,
    onLogout
  }

    
  const renderChatLayout = () => {
    return (<ChatLayout  {...socketMethodsToProps} />);
  }

  return (
    <div>
      {!userAuthenticated ? <Login authenticateUser={onAuthenticate} /> : null}
      {userAuthenticated && renderChatLayout()}
    </div>
    
  )
}

export default Layout;
