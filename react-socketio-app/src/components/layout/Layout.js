import React from 'react';
import MainApp from './main-app/MainApp';
import Login from './login/Login';
import useSocket from '../_useSocket';

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
  sendMessage,
  PMUserNames,
  PMChats,
  sendPM
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

  const setJoinReqSent = () => {
    return setJoinRequestSent();
  }

  const getPMusernames = () => {
    return PMUserNames;
  }

  const getPMchats = () => {
    return PMChats;
  }

  const onSendPrivateMessage = (username, message) => {
    return sendPM(username, message);
  }

  const socketMethodsToProps = {
    availableRooms: getAvailableRooms(),
    availableUsers: getAvailableUsers(),
    joinRequestSent: getJoinRequestSent(),
    rooms: getRooms(),
    roomNames: getRoomNames(),
    joinRequestsReceived: getJoinRequestsReceived(),
    joinRoomsSuccess: getJoinRoomsSuccess(),
    joinRequestsApproved: getJoinRequestsApproved(),
    joinRequestsPending: getJoinRequestsPending(),
    setJoinRequestSent: setJoinReqSent,
    onSendMessage,
    onMessageReceived,
    PMusernames: getPMusernames(),
    PMchats: getPMchats(),
    onSendPrivateMessage,
    onJoinRoomsRequest,
    confirmJoinRequest,
    onLogout
  }

    
  const renderMainApp = () => {
    return (<MainApp  {...socketMethodsToProps} />);
  }

  return (
    <div>
      {!userAuthenticated 
        ? <Login authenticateUser={onAuthenticate} 
                 signupNewUser={signupNewUser} 
                 userUnauthorised={userUnauthorised} /> : null}
      {userAuthenticated && renderMainApp()}
    </div>
    
  )
}

export default Layout;
