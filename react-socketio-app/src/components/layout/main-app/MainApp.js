import React, { useState, useEffect } from 'react';
import Header from './header/Header';
import * as classes from './MainApp.css';
import Dashboard from './dashboard/Dashboard';
import Notifications from './notifications/Notifications';
import ActiveRooms from './active-rooms/ActiveRooms';

const MainApp = ({
  onSendMessage,
  onSendPrivateMessage,
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
  confirmJoinRequest
}) => {

  const [ activeRoom, setActiveRoom ] = useState(roomNames ? roomNames[0] : null);
  const [ activeTab, setActiveTab ] = useState(activeRoom ? 'messages' : 'dashboard')

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

  const ActiveRoomsProps = {
    roomNames,
    rooms,
    activeRoom,
    setActiveRoom,
    onMessageReceived,
    onSendMessage
  }

  const NotificationsProps = {
    joinRequestsReceived,
    confirmJoinRequest
  }

  const renderSection = (activeTab) => {
    switch (activeTab) {
      case 'logout': return onLogout();
      case 'your rooms': return !activeRoom ? 'Nothing to show!' : <ActiveRooms {...ActiveRoomsProps} />;
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