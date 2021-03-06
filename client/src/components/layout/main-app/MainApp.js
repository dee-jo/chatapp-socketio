import React, { useState, useEffect } from 'react';
import Header from './header/Header';
import * as classes from './MainApp.css';
import Dashboard from './dashboard/Dashboard';
import Notifications from './notifications/Notifications';
import ActiveRooms from './active-rooms/ActiveRooms';
import PrivateChats from './private-chats/PrivateChats';

const MainApp = ({
  onSendMessage,
  onMessageReceived,
  onJoinRoomsRequest,
  joinRequestSent,
  setJoinRequestSent,
  joinRequestsApproved,
  rooms,
  roomNames,
  joinRequestsReceived,
  joinRequestsPending,
  onLogout,
  availableRooms,
  availableUsers,
  confirmJoinRequest,
  onPrivateMessageReceived,
  PMuserNames,
  PMessages,
  onSendPrivateMessage,
  onSendCreatedNewRoom
}) => {

 
  const [ activeTab, setActiveTab ] = useState(rooms ? 'messages' : 'dashboard');
  console.log('[MainApp] PMessages: ');
  console.dir(PMessages);

  const DashboardProps = {
    availableRooms,
    availableUsers,
    onSendPrivateMessage,
    onJoinRoomsRequest,
    joinRequestsPending,
    joinRequestsApproved,
    joinRequestSent,
    setJoinRequestSent
  }

  const JoinNewRoomProps = {
    availableRooms,
    onJoinRoomsRequest,
    joinRequestSent,
    setJoinRequestSent
  }

  const ActiveRoomsProps = {
    roomNames,
    rooms,
    onMessageReceived,
    onSendMessage,
    onSendCreatedNewRoom
  }

  const PrivateChatsProps = {
    PMuserNames,
    PMessages,
    onPrivateMessageReceived,
    onSendPrivateMessage,
    availableUsers
  }

  const NotificationsProps = {
    joinRequestsReceived,
    confirmJoinRequest
  }

  const renderSection = (activeTab) => {
    switch (activeTab) {
      case 'logout': return onLogout();
      case 'your-rooms': return  (rooms) ? <ActiveRooms {...ActiveRoomsProps} {...JoinNewRoomProps} /> : null;
      case 'private-chats': return (PMessages) ? <PrivateChats {...PrivateChatsProps} /> : null;
      case 'dashboard': return (availableRooms && availableUsers) ? <Dashboard {...DashboardProps} /> : null;
      case 'notifications': return <Notifications {...NotificationsProps} />;
      default: return (availableRooms && availableUsers) ? <Dashboard {...DashboardProps} /> : null;
    }
  }

  return (
    <div className='container'>
      <Header onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      { renderSection(activeTab) }
    </div>
  )
}

export default MainApp;