import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../chat-layout/ChatLayout';
import RoomsDashboard from '../chat-layout/rooms-dashboard/RoomsDashboard';
import Login from '../login/Login';
import useSocket from '../_useSocket';
import JoinRequestsApproved from '../chat-layout/rooms-dashboard/rooms-search/join-requests/JoinRequestsApproved';

const Layout = (props) => {
  
 const { 
  signupNewUser,
  authenticateUser,
  logoutUser,
  userAuthenticated,
  userUnauthorised,
  roomNames,
  rooms,
  availableRooms,
  availableUsers,
  joinRequestSent,
  joinRoomsSuccess,
  joinRequestsToApprove,
  joinRequestsPending,
  joinRequestsApproved,
  confirmJoinRequest,
  setJoinRequestSent,
  sendJoinRequest,
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
  const getAvailableUsers = () => {
    return availableUsers;
  }

  const getJoinRoomsSuccess = () => {
    return joinRoomsSuccess;
  }

  const getJoinRequestSent = () => {
    return joinRequestSent;
  }

  const getJoinRequestsReceived = () => {
    return joinRequestsToApprove;
  }

  const getJoinRequestsPending = () => {
    return joinRequestsPending;
  }

  const getJoinRequestsApproved = () => {
    return joinRequestsApproved;
  }

  const onJoinRoomsRequest = (rooms) => {
    return sendJoinRequest(rooms);
  }

 

  

  

  const socketMethodsToProps = {
    onSendMessage,
    onMessageReceived,
    onJoinRoomsRequest,
    getAvailableRooms,
    getAvailableUsers,
    getJoinRequestSent,
    setJoinRequestSent,
    getJoinRoomsSuccess,
    getJoinRequestsReceived,
    getJoinRequestsApproved,
    getJoinRequestsPending,
    confirmJoinRequest,
    getRooms,
    getRoomNames,
    onLogout
  }

    
  const renderChatLayout = () => {
    return (<ChatLayout  {...socketMethodsToProps} />);
  }

  return (
    <div>
      {!userAuthenticated 
        ? <Login authenticateUser={onAuthenticate} 
                 signupNewUser={signupNewUser} 
                 userUnauthorised={userUnauthorised} /> : null}
      {userAuthenticated && renderChatLayout()}
    </div>
    
  )
}

export default Layout;
