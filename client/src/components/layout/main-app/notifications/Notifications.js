import React from 'react';
import NotificationsList from './NotificationsList';

const Notifications = ({joinRequestsReceived, confirmJoinRequest}) => {
  console.log('[Notifications], joinRequestReceived: ', joinRequestsReceived);
  return (
      <NotificationsList joinRequests={joinRequestsReceived} confirmJoinRequest={confirmJoinRequest} />
  )
}

export default Notifications;