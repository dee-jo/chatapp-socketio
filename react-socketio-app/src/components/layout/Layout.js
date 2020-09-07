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
  const [ socketInit, setSocketInit ] = useState(useSocket(isVerifiedCallback));
  const [ socketManager, setSocketManager ] = useState();

  const renderChatLayout = () => {
    return (<ChatLayout {...socketManager}/>);
  }

  return (
    <div>
      {!isVerified ? <Login setVerified={setVerified} authenticateUser={socketInit.authenticateUser} /> : null}
      {isVerified && renderChatLayout()}
    </div>
    
  )
}

export default Layout;
