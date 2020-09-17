import React from 'react';

const Notifications = ({joinRequestsReceived}) => {
  console.log('[Notifications], joinRequestReceived: ', joinRequestsReceived);
  return (
    <>
      <div>In Notifications</div>
      {joinRequestsReceived.map(req => 
        <>
          <p>{req.requested_room}</p>
          <p>{req.name}</p>
          <p>{req.date}</p>
        </>
      )}
    </>
  )
}

export default Notifications;