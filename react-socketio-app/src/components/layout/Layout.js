import React, { useState } from 'react';
import ChatLayout from '../chat-layout/ChatLayout';
import Login from '../login/Login';
import useSocket from '../_useSocket';

const Layout = (props) => {
  
  const isVerifiedCallback = (roomNames, rooms, sendMessage, getMessagesForRoom, pastMessagesReceived) => {
    setSocketManager({roomNames, rooms, sendMessage, getMessagesForRoom, pastMessagesReceived});
    setVerified(true)
  }

  const [ isVerified, setVerified ] = useState(false);
  const [ socketManager, setSocketManager ] = useState(useSocket(isVerifiedCallback));

  const renderChatLayout = () => {
    return (<ChatLayout socketManager={socketManager} />);
  }

  return (
    <div>
      {!isVerified ? <Login authenticateUser={socketManager.authenticateUser} /> : null}
      {isVerified && renderChatLayout()}
    </div>
    
  )
}

export default Layout;
