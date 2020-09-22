import React, { useState } from 'react';
import RoomList from './user-list/UserList';
import CurrentRoom from './current-chat/CurrentChat';
import { Grid, Segment } from 'semantic-ui-react';

const PrivateChats = ({
  PMusernames,
  PMchats,
  onMessageReceived,
  onSendPrivateMessage
}) => {

  const [ PMactiveChat, PMsetActiveChat ] = useState();
  console.log('[PrivateChat] PMchats: ', PMchats)

  return (
    <Grid>
      <Grid.Column width={4}>
        {PMactiveChat && 
          <RoomList PMusernames={PMusernames} activeTab={PMactiveChat} PMsetActiveChat={PMsetActiveChat} />
        }
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Segment>
          {PMchats &&
              ( <CurrentRoom 
              PMactiveChat={PMactiveChat} 
              messages={onMessageReceived(PMactiveChat)} 
              onSendPrivateMessage={onSendPrivateMessage(PMactiveChat)} />)
          }
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default PrivateChats;