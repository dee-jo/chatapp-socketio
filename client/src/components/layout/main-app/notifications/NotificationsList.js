import React from 'react'
import { Button, Image, List } from 'semantic-ui-react';
import * as classes from './Notifications.css';

const NotificationsList = ({joinRequests, confirmJoinRequest}) => (
  <>
    <List divided verticalAlign='middle' className='notificationsList'>
    {joinRequests && joinRequests.map(req => 
      <List.Item key={req.id}>
        <List.Content floated='right' className='confirm'>
          <Button className='acceptButton' onClick={() => confirmJoinRequest(req)}>Confirm Request</Button>
        </List.Content>
        <Image floated='left' avatar src='https://react.semantic-ui.com/images/avatar/small/lindsay.png' />
        <List.Content floated='left' >{req.name} send a join request for room: {req.requested_room}</List.Content>
     </List.Item>
    )}
  </List>
  </>
)

export default NotificationsList;
